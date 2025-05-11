<template>
  <div class="user-disliked-replies">
    <h1>싫어요한 감상평</h1>

    <div v-if="loading">로딩 중...</div>

    <div v-else-if="replies.length === 0">
      싫어요한 감상평이 없습니다.
    </div>

    <div v-else class="replies-list">
      <div
          v-for="reply in replies"
          :key="reply.id"
          class="reply-card"
      >
        <p><strong>영화 ID:</strong> {{ reply.movieId }}</p>
        <p><strong>내용:</strong> {{ reply.reviewContent }}</p>
        <p><strong>작성자:</strong> {{ reply.memNickname }}</p>
        <p><strong>작성일:</strong> {{ formatDate(reply.replyRegDate) }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'UserDislikedReplies',
  data() {
    return {
      replies: [],
      loading: true,
    };
  },
  methods: {
    async fetchDislikedReplies() {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:8081/myPage/reply-dislikes', {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.replies = response.data;
      } catch (error) {
        console.error('싫어요한 감상평 조회 실패:', error);
      } finally {
        this.loading = false;
      }
    },
    formatDate(dateString) {
      const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    }
  },
  mounted() {
    this.fetchDislikedReplies();
  }
}
</script>

<style scoped>
.user-disliked-replies {
  padding: 30px;
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
}

.reply-card p {
  margin: 8px 0;
}

.reply-card strong {
  color: #f87171;
}
</style>
