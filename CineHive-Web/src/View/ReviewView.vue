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

    <!-- 감상평 목록 (카드 형식) -->
    <div class="review-section">
      <div v-if="reviews.length === 0" class="no-reviews">아직 감상평이 없습니다.</div>

      <div class="review-cards">
        <div v-for="(review) in reviews" :key="review.id" class="review-card">
          <div class="review-header">
            <div class="review-author">
              <span class="nickname">{{ review.memNickname }}</span>
              <span class="review-date">{{ formatDate(review.replyRegDate) }}</span>
            </div>
            <div v-if="review.memEmail === userEmail" class="delete-btn">
              <button @click="deleteReview(review.id)">삭제</button>
            </div>
          </div>
          <div class="review-content">
            <p>{{ review.reviewContent }}</p>
          </div>
          <div class="review-footer">
            <div class="like-dislike">
              <button class="action-button" @click="toggleLike(review)">
                <img src="@/assets/reviewLogo/like.png" height="15" width="15">
                {{ review.likeCount }}
              </button>
              <button class="action-button" @click="toggleDislike(review)">
                <img src="@/assets/reviewLogo/dislike.png" height="15" width="15">
                {{review.dislikeCount}}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 감상평 작성 버튼 -->
    <button @click="openReviewPopup" class="review-create-btn">작성하기</button>

    <!-- 감상평 작성 팝업 -->
    <div v-if="showPopup" class="popup-overlay">
      <div class="popup-content">
        <h3>감상평 작성</h3>
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
      } catch (error) {
        console.error("좋아요 처리 중 오류 발생:", error);
        alert("다시 로그인해 주세요.");
        this.$store.dispatch('logout');
        this.$router.push("/auth");
      }
    },
    async toggleDislike(review) {
      try {
        await toggleDislike(review.id, this.id, this.userToken);
        review.dislikeCount = await fetchDislikeCount(review.id);
      } catch (error) {
        console.error("싫어요 처리 중 오류 발생:", error);
        alert("다시 로그인해 주세요.");
        this.$store.dispatch('logout');
        this.$router.push("/auth");
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
        alert("다시 로그인해 주세요.");
        this.$store.dispatch('logout');
        this.$router.push("/auth");
      }
    },
    async deleteReview(replyId) {
      if (!confirm("정말 삭제하시겠습니까?")) return;
      try {
        await deleteReview(this.id, replyId, this.userToken);
        alert("삭제되었습니다.");
        this.fetchReviews();
      } catch (error) {
        console.error("감상평 삭제 중 오류 발생:", error);
        alert("다시 로그인해 주세요.");
        this.$store.dispatch('logout');
        this.$router.push("/auth");
      }
    },
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
  min-height: 900px;
}

.movie-info {
  display: flex;
  align-items: flex-start;
}

.poster-image {
  width: 180px;
  height: auto;
  margin-right: 30px;
  border-radius: 8px;
  transition: transform 0.3s ease;
}

.poster-image:hover {
  transform: scale(1.05);
}

.movie-details {
  max-width: 600px;
}

.movie-details h2{
  text-align: left;
}
.review-section {
  margin-top: 50px;
}

.overview{
  position: relative;
  top: 30px;
  text-align: left;
}
.review-cards {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;
}

.review-card {
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.review-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
}
.review-cards img:hover {
  transform: scale(1.2);
  filter: brightness(1.2);
}
.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.nickname {
  font-weight: bold;
  color: #fff;
}

.review-date {
  color: #aaa;
  font-size: 12px;
  margin-left: 10px;
}

.delete-btn button {
  color: red;
  border: none;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 5px;
  background-color: black;
}
.review-content {
  color: white;
  margin-bottom: 15px;
  text-align: left;
}

.review-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.like-dislike button {
  background-color: black;
  color: white;
  border: none;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 5px;
}

.like-dislike button:hover {
  background-color: #555;
}

.review-create-btn {
  position: relative;
  top: 100px;
  left: 46%;
  width: 88px;
  height: 40px;
  background-color: #4a5855;
  border-radius: 8px;
  color: white;
  font-size: 12px;
}

.review-create-btn:hover {
  background-color: #4a5855;
  transform: scale(1.01);
  filter: brightness(1.2);
  cursor: pointer;
}

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
  border-radius: 10px;
  width: 600px;
  min-height: 300px;
  text-align: center;
  z-index: 1001;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.popup-content{
  font-size: 13px;
  font-weight: bold;
  text-align: left;
}
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
