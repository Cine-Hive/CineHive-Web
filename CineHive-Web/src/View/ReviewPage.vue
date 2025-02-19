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

    <!-- 감상평 목록 -->
    <div class="review-section">
      <h3>감상평</h3>
      <div v-if="reviews.length > 0">
        <div v-for="review in reviews" :key="review.id" class="review">
          <p class="review-text">{{ review.reviewContent }}</p>
          <p class="review-meta">작성자: {{ review.email }}</p>
        </div>
      </div>
      <p v-else>아직 감상평이 없습니다.</p>
    </div>

    <!-- 감상평 작성 -->
    <div class="review-form">
      <h3>감상평 작성</h3>
      <textarea v-model="newReview.text" placeholder="여러분의 감상평을 남겨주세요"></textarea>
      <button @click="submitReview">등록</button>
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
      newReview: {
        text: '',
        email: localStorage.getItem("email") || '' // 로그인한 사용자 이메일 가져오기
      }
    };
  },
  created() {
    console.log("로컬 스토리지에서 가져온 이메일:", localStorage.getItem("email")); // ✅ 여기서 확인
    this.newReview.email = localStorage.getItem("email") || ''; // ✅ email 값 설정
    this.fetchReviews();
  },
  computed: {
    userEmail() {
      return localStorage.getItem("email") || '';
    }
  },
  methods: {
    // 감상평 데이터 가져오기
    async fetchReviews() {
      try {
        const response = await axios.get(`http://localhost:8081/api/reviews/movie/${this.id}`);
        this.reviews = response.data;
      } catch (error) {
        console.error("감상평을 불러오는 중 오류 발생:", error);
      }
    },

    // 감상평 등록
    async submitReview() {
      console.log("현재 로그인된 이메일:", this.userEmail); // ✅ 콘솔에서 확인

      if (!this.newReview.text.trim()) {
        alert("감상평을 입력해주세요!");
        return;
      }

      if (!this.userEmail) {
        alert("로그인이 필요합니다!");
        this.$router.push("/auth");
        return;
      }

      try {
        await axios.post(`http://localhost:8081/api/reviews?email=${encodeURIComponent(this.userEmail)}&movieId=${encodeURIComponent(this.id)}&content=${encodeURIComponent(this.newReview.text)}`);

        alert("감상평이 등록되었습니다!");
        this.newReview.text = "";
        this.fetchReviews();
      } catch (error) {
        console.error("감상평 등록 중 오류 발생:", error);
      }
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

.review {
  border-bottom: 1px solid #555;
  padding: 10px 0;
}

.review-text {
  font-size: 16px;
}

.review-meta {
  font-size: 12px;
  color: gray;
}

.review-form {
  margin-top: 20px;
}

textarea {
  width: 100%;
  height: 100px;
  padding: 10px;
  border-radius: 5px;
  background-color: black;
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
</style>
