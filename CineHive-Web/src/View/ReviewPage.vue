<template>
  <div class="review-page">
    <!-- 영화 정보 표시 -->
    <div class="movie-info">
      <img v-if="posterPath" :src="'https://image.tmdb.org/t/p/original' + posterPath" alt="포스터" class="poster-image" />
      <div class="movie-details">
        <h2>{{ title }}</h2>
        <p class="overview">{{ overview }}</p>
      </div>
    </div>

    <!-- 감상평 목록 (테이블 형식) -->
    <div class="review-section">
      <table class="review-table">
        <thead>
        <tr>
          <th>NO</th>
          <th>닉네임</th>
          <th>감상평</th>
          <th>작성일</th>
          <th>평가</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(review, index) in reviews" :key="review.id">
          <td>{{ index + 1 }}</td>
          <td>{{ review.memNickname }}</td>
          <td>{{ review.reviewContent }}</td>
          <td>{{ formatDate(review.replyRegDate) }}</td>
          <td>
            <!-- 좋아요 버튼 -->
            <button class="action-button" @click="toggleLike(review)">
              👍({{ review.likeCount }})
            </button>

            <!-- 싫어요 버튼 -->
            <button class="action-button" @click="toggleDislike(review)">
              👎({{ review.dislikeCount }})
            </button>

            <!-- 리뷰 삭제 버튼 (작성자와 현재 사용자 이메일이 같을 경우에만 표시) -->
            <button v-if="review.memEmail === userEmail" @click="deleteReview(review.id)">
              삭제
            </button>
          </td>
        </tr>
        </tbody>
      </table>
      <p v-if="reviews.length === 0">아직 감상평이 없습니다.</p>
    </div>

    <!-- 감상평 작성 버튼 -->
    <button @click="openReviewPopup">감상평 작성</button>

    <!-- 감상평 작성 팝업 -->
    <div v-if="showPopup" class="popup-overlay">
      <div class="popup-content">
        <h3>감상평 작성</h3>

        <!-- 감상평 입력 -->
        <textarea v-model="newReview.text" placeholder="여러분의 감상평을 남겨주세요"></textarea>
        <p class="char-limit">{{ newReview.text.length }} / 1000</p>

        <div class="popup-buttons">
          <button @click="submitReview">등록</button>
          <button @click="closeReviewPopup">취소</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import {
  fetchReviews,
  toggleLike,
  toggleDislike,
  fetchLikeCount,
  fetchDislikeCount,
  submitReview,
  deleteReview
} from "@/api/review";

export default {
  data() {
    return {
      id: this.$route.query.id || "",
      posterPath: this.$route.query.posterPath || "",
      title: this.$route.query.title || "",
      overview: this.$route.query.overview || "",
      reviews: [],
      showPopup: false,
      newReview: {
        text: "",
        email: localStorage.getItem("email") || "",
        nickname: localStorage.getItem("nickname") || ""
      }
    };
  },
  async created() {
    const movieId = this.$route.params.id;
    if (!movieId) {
      console.error("영화 ID가 없습니다!");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8081/movies/${movieId}`);
      if (!response.ok) throw new Error("영화 정보를 가져오지 못했습니다.");
      this.movie = await response.json();
    } catch (error) {
      console.error("영화 정보를 불러오는 중 오류 발생:", error);
    }
    this.fetchReviews();
  },
  computed: {
    userEmail() {
      return localStorage.getItem("email") || "";
    },
    userToken() {
      return localStorage.getItem("token") || "";
    }
  },
  methods: {
    async fetchReviews() {
      try {
        this.reviews = await fetchReviews(this.id);

        const reviewsWithLikesAndDislikes = await Promise.all(this.reviews.map(async (review) => {
          const likeCount = await fetchLikeCount(review.id);
          const dislikeCount = await fetchDislikeCount(review.id);
          return {
            ...review,
            likeCount,
            dislikeCount,
          };
        }));

        this.reviews = reviewsWithLikesAndDislikes;
      } catch (error) {
        console.error("감상평을 불러오는 중 오류 발생:", error);
      }
    },

    async toggleLike(review) {
      try {
        await toggleLike(review.id, this.id, this.userToken);
        review.likeCount = await fetchLikeCount(review.id);

        console.log(`좋아요 처리됨. 리뷰 ID: ${review.id}, 좋아요 개수: ${review.likeCount}`);  // 로그 추가
      } catch (error) {
        console.error("좋아요 처리 중 오류 발생:", error);
      }
    },

    async toggleDislike(review) {
      try {
        await toggleDislike(review.id, this.id, this.userToken);
        review.dislikeCount = await fetchDislikeCount(review.id);
        console.log(`싫어요 처리됨. 리뷰 ID: ${review.id}, 싫어요 개수: ${review.dislikeCount}`);  // 로그 추가
      } catch (error) {
        console.error("싫어요 처리 중 오류 발생:", error);
      }
    },
    async submitReview() {
      if (!this.newReview.text.trim()) {
        alert("감상평을 입력해주세요!");
        return;
      }
      if (this.newReview.text.length > 1000) {
        alert("감상평은 1000자를 초과할 수 없습니다.");
        return;
      }
      if (!this.userToken) {
        alert("로그인이 필요합니다!");
        this.$router.push("/auth");
        return;
      }

      try {
        await submitReview(this.id, this.newReview.nickname, this.newReview.text, this.userToken);
        alert("감상평이 등록되었습니다!");
        this.newReview.text = "";
        this.closeReviewPopup();
        this.fetchReviews();
      } catch (error) {
        console.error("감상평 등록 중 오류 발생:", error);
        alert("감상평 등록에 실패했습니다.");
      }
    },

    // 감상평 삭제
    async deleteReview(replyId) {
      if (!confirm("정말 삭제하시겠습니까?")) return;

      try {
        await deleteReview(this.id, replyId, this.userToken);
        alert("감상평이 삭제되었습니다!");
        this.fetchReviews();
      } catch (error) {
        console.error("감상평 삭제 중 오류 발생:", error);
        alert("감상평 삭제에 실패했습니다.");
      }
    },
    // 날짜 포맷
    formatDate(dateString) {
      if (!dateString) return "날짜 없음";
      const date = new Date(dateString);
      return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
    },

    openReviewPopup() {
      this.showPopup = true;
    },
    closeReviewPopup() {
      this.showPopup = false;
    }
  }
};
</script>

<style scoped>
.review-page {
  color: white;
  background-color: black;
  padding: 40px;
  border-radius: 10px;
}

.char-limit {
  font-size: 12px;
  color: gray;
  text-align: right;
  margin-top: 5px;
}

.movie-info {
  display: flex;
  align-items: flex-start;
}

.poster-image {
  width: 150px;
  height: auto;
  margin-right: 20px;
  border-radius: 8px;
}

.movie-details {
  max-width: 600px;
}

.review-section {
  margin-top: 30px;
}

.review-table {
  width: 100%;
  border-collapse: collapse;
}

.review-table th, .review-table td {
  border: 1px solid #555;
  padding: 10px;
  text-align: center;
}

.review-table th {
  background-color: #222;
  color: white;
}

button {
  margin-top: 10px;
  padding: 10px;
  background-color: #1a1a1a;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

button:hover {
  background-color: #555;
}

/* 팝업 스타일 */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.popup-content {
  background: black;
  color: white;
  padding: 30px;
  border-radius: 10px;
  width: 450px;
  text-align: center;
  z-index: 1001;
}

/* 별점 스타일 */
.rating {
  font-size: 28px;
  cursor: pointer;
  margin-bottom: 15px;
}

.rating span {
  margin: 0 5px;
  color: gray;
  cursor: pointer;
}

.rating .selected {
  color: gold;
}

/* 텍스트 입력창 */
textarea {
  width: 100%;
  height: 120px;
  padding: 10px;
  border-radius: 5px;
  background-color: black;
  color: white;
  border: 1px solid gray;
}

.popup-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}

.popup-buttons button {
  flex: 1;
  margin: 0 5px;
  background-color: #1a1a1a;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  padding: 12px;
  font-size: 16px;
}

.popup-buttons button:hover {
  background-color: #555;
}
</style>
