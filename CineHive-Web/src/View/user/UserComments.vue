<template>
  <div class="user-comments">
    <h1>작성한 댓글 목록</h1>

    <div v-if="loading">로딩 중...</div>

    <div v-else-if="comments.length === 0">
      작성한 댓글이 없습니다.
    </div>

    <div v-else class="comments-list">
      <div
          v-for="comment in comments"
          :key="comment.id"
          class="comment-card"
          @click="goToBoardDetail(comment.boardId)"
      >
      <p><strong>댓글 내용:</strong> {{ comment.content }}</p>
      <p><strong>작성자:</strong> {{ comment.memNickname }}</p>
    </div>
  </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'UserComments',
  data() {
    return {
      comments: [],
      loading: true,
    }
  },
  methods: {
    async fetchComments() {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('로그인이 필요합니다.');
        return;
      }

      try {
        const response = await axios.get('http://localhost:8081/myPage/comments', {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        this.comments = response.data;
      } catch (error) {
        console.error('작성한 댓글 가져오기 실패:', error);
      } finally {
        this.loading = false;
      }
    },
    formatDate(dateString) {
      const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    },
    goToBoardDetail(boardId) {
      if (boardId) {
        this.$router.push(`/boards/detail/${boardId}`);
      } else {
        console.warn('boardId가 없습니다.');
      }
    }
  },
  mounted() {
    this.fetchComments();
  }
}
</script>

<style scoped>
.user-comments {
  padding: 20px;
  background-color: black;
  color: white;
  min-height: 950px;
  text-align: center;
}

.comments-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin-top: 20px;
}

.comment-card {
  background-color: #1e1e1e;
  padding: 20px;
  border-radius: 12px;
  width: 80%;
  text-align: left;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.6);
  cursor: pointer; /* ⭐ 카드 클릭 가능하게 커서 설정 */
}
.comment-card p {
  margin: 8px 0;
}

.comment-card strong {
  color: #f87171;
}
</style>
