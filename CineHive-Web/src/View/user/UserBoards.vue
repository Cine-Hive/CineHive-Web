<template>
  <div class="user-boards">
    <h1>작성한 게시글 목록</h1>

    <div v-if="loading">로딩 중...</div>

    <div v-else-if="boards.length === 0">
      작성한 게시글이 없습니다.
    </div>

    <div v-else class="boards-list">
      <div
          v-for="board in boards"
          :key="board.id"
          class="board-card"
          @click="goToBoardDetail(board.id)"
      >
        <h2 class="board-title">{{ board.brdTitle }}</h2>
        <p class="board-content">{{ board.brdContent }}</p>
        <p class="board-info">
          작성자: {{ board.memNickname }} |
          작성일: {{ formatDate(board.brdRegDate) }} |
          조회수: {{ board.views }} |
          댓글 수: {{ board.commentCount }}
        </p>

        <div v-if="board.comments.length > 0" class="comments">
          <h3>댓글 목록:</h3>
          <div v-for="comment in board.comments" :key="comment.id" class="comment">
            <p>{{ comment.memNickname }}: {{ comment.content }}</p>
          </div>
        </div>

        <div v-else class="no-comments">
          댓글이 없습니다.
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'UserBoards',
  data() {
    return {
      boards: [],
      loading: true,
    }
  },
  methods: {
    async fetchBoards() {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('로그인이 필요합니다.');
        return;
      }

      try {
        const response = await axios.get('http://localhost:8081/myPage/boards', {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        this.boards = response.data;
      } catch (error) {
        console.error('작성한 게시글 가져오기 실패:', error);
      } finally {
        this.loading = false;
      }
    },
    formatDate(dateString) {
      const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    },
    goToBoardDetail(boardId) {
      this.$router.push(`/boards/detail/${boardId}`);
    }
  },
  mounted() {
    this.fetchBoards();
  }
}
</script>

<style scoped>
.user-boards {
  padding: 20px;
  background-color: black;
  color: white;
  min-height: 950px;
  text-align: center;
}

.boards-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  margin-top: 20px;
}

.board-card {
  background-color: #1e1e1e;
  padding: 20px;
  border-radius: 12px;
  width: 80%;
  text-align: left;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.6);
  cursor: pointer;
}

.board-title {
  font-size: 22px;
  font-weight: bold;
  color: #f87171;
  margin-bottom: 10px;
}

.board-content {
  font-size: 18px;
  margin-bottom: 10px;
}

.board-info {
  font-size: 14px;
  color: #ccc;
  margin-bottom: 15px;
}

.comments {
  margin-top: 10px;
}

.comment {
  background-color: #333;
  padding: 10px;
  border-radius: 8px;
  margin-top: 5px;
}

.no-comments {
  font-size: 14px;
  color: gray;
  margin-top: 10px;
}
</style>
