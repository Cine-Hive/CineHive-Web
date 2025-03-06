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
          <th>좋아요</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(review, index) in reviews" :key="review.id">
          <td>{{ index + 1 }}</td>
          <td>{{ review.memNickname }}</td>
          <td>{{ review.reviewContent }}</td>
          <td>{{ formatDate(review.replyRegDate) }}</td>  <!-- ✅ 날짜 출력 변경 -->
          <td>
            <button @click="likeReview(review.id)"> 좋아요{{ review.likes }}</button>
            <button v-if="review.memEmail === userEmail" @click="deleteReview(review.id)">삭제</button>
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

        <!-- 별점 입력 -->
        <div class="rating">
          <span
              v-for="star in 5"
              :key="star"
              @click="newReview.rating = star"
              :class="{ selected: newReview.rating >= star }"
          >
            ★
          </span>
        </div>

        <!-- 감상평 입력 -->
        <textarea v-model="newReview.text" placeholder="여러분의 감상평을 남겨주세요"></textarea>
        <p class="char-limit">{{ newReview.text.length }} / 1000</p>  <!-- ✅ 글자 수 표시 -->

        <div class="popup-buttons">
          <button @click="submitReview">등록</button>
          <button @click="closeReviewPopup">취소</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      id: this.$route.query.id || '',
      posterPath: this.$route.query.posterPath || '',
      title: this.$route.query.title || '',
      overview: this.$route.query.overview || '',
      reviews: [],
      showPopup: false,
      newReview: {
        text: '',
        rating: 0,
        email: localStorage.getItem("email") || '',
        nickname: localStorage.getItem("nickname") || ''
      }
    };
  },
  created() {
    console.log("로컬 스토리지에서 가져온 이메일:", localStorage.getItem("email"));
    this.newReview.email = localStorage.getItem("email") || '';
    this.newReview.nickname = localStorage.getItem("nickname") || '';
    this.fetchReviews();
  },
  computed: {
    userEmail() {
      return localStorage.getItem("email") || '';
    }
  },
  methods: {
    openReviewPopup() {
      this.showPopup = true;
    },
    closeReviewPopup() {
      this.showPopup = false;
    },
    async fetchReviews() {
      try {
        const response = await axios.get(`http://localhost:8081/api/reply/movie/${this.id}`);
        this.reviews = response.data;
      } catch (error) {
        console.error("감상평을 불러오는 중 오류 발생:", error);
      }
    },
    async submitReview() {
      if (!this.newReview.text.trim()) {
        alert("감상평을 입력해주세요!");
        return;
      }
      if (this.newReview.text.length > 1000) { // ✅ 글자 수 제한 (백엔드와 동일)
        alert("감상평은 1000자를 초과할 수 없습니다.");
        return;
      }

      if (!this.userEmail) {
        alert("로그인이 필요합니다!");
        this.$router.push("/auth");
        return;
      }

      try {
        console.log("감상평 등록 요청:", {
          memEmail: this.userEmail,
          memNickname: this.newReview.nickname,
          movieId: this.id,
          content: this.newReview.text
        });

        await axios.post(`http://localhost:8081/api/reply?` +
            `memNickname=${encodeURIComponent(this.newReview.nickname)}` +
            `&memEmail=${encodeURIComponent(this.userEmail)}` +
            `&movieId=${encodeURIComponent(this.id)}` +
            `&content=${encodeURIComponent(this.newReview.text)}`
        );

        alert("감상평이 등록되었습니다!");
        this.newReview.text = "";
        this.newReview.rating = 0;
        this.closeReviewPopup();
        this.fetchReviews();
      } catch (error) {
        console.error("감상평 등록 중 오류 발생:", error);
        if (error.response && error.response.status === 400) {
          alert(error.response.data); // 백엔드에서 반환한 오류 메시지 표시
        }
      }
    }

    ,
    async likeReview(reviewId) {
      try {
        await axios.post(`http://localhost:8081/api/reply/${reviewId}/like`);
        this.fetchReviews();
      } catch (error) {
        console.error("좋아요 추가 중 오류 발생:", error);
      }
    },
    async deleteReview(replyId) {
      if (!confirm("정말 삭제하시겠습니까?")) return;

      try {
        const movieId = this.id; // 현재 페이지에서 영화 ID 가져오기
        console.log(`삭제 요청: /api/reply/${movieId}/${replyId}`);

        await axios.delete(`http://localhost:8081/api/reply/${movieId}/${replyId}`);

        alert("감상평이 삭제되었습니다!");
        this.fetchReviews(); // 감상평 목록 다시 불러오기
      } catch (error) {
        console.error("감상평 삭제 중 오류 발생:", error);
      }
    }
    ,
    formatDate(dateString) {
      if (!dateString) return "날짜 없음";
      const date = new Date(dateString);
      return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 ${date.getHours()}시 ${date.getMinutes()}분`;
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
