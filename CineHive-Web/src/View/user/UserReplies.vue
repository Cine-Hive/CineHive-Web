<template>
  <div class="user-replies">
    <h1>작성한 감상평 목록</h1>

    <div v-if="loading">로딩 중...</div>

    <div v-else-if="replies.length === 0">
      작성한 감상평이 없습니다.
    </div>

    <div v-else class="replies-list">
      <div
          v-for="reply in replies"
          :key="reply.id"
          class="reply-card"
          @click="goToMovieDetail(reply.movieId)"
      >
        <p><strong>영화 ID:</strong> {{ reply.movieId }}</p>
        <p><strong>내용:</strong> {{ reply.reviewContent }}</p>
        <p><strong>작성일:</strong> {{ formatDate(reply.replyRegDate) }}</p>
        <p><strong>작성자 닉네임:</strong> {{ reply.memNickname }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'UserReplies',
  data() {
    return {
      replies: [],
      loading: true,
    }
  },
  methods: {
    async fetchReplies() {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('로그인이 필요합니다.');
        return;
      }

      try {
        const response = await axios.get('http://localhost:8081/myPage/replies', {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        this.replies = response.data;
      } catch (error) {
        console.error('작성한 감상평 가져오기 실패:', error);
      } finally {
        this.loading = false;
      }
    },
    formatDate(dateString) {
      const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    },
    goToMovieDetail(movieId) {
      this.$router.push(`/movie/${movieId}`)
    },
  },
  mounted() {
    this.fetchReplies();
  }
}
</script>

<style scoped>
.user-replies {
  padding: 20px;
  background-color: black;
  color: white;
  min-height: 950px;
  text-align: center;
}

.replies-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin-top: 20px;
}

.reply-card {
  background-color: #1e1e1e;
  padding: 20px;
  border-radius: 12px;
  width: 80%;
  text-align: left;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.6);
  cursor: pointer;
}

.reply-card p {
  margin: 8px 0;
}

.reply-card strong {
  color: #f87171; /* Tailwind 빨간색 계열 */
}
</style>
