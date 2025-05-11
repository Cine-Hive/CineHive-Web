<template>
  <div class="user-board-list">
    <h1>{{ title }}</h1>

    <div v-if="loading">로딩 중...</div>

    <div v-else-if="boards.length === 0">{{ emptyMessage }}</div>

    <div v-else class="boards-list">
      <div
          v-for="board in boards"
          :key="board.boardId"
          class="board-card"
          @click="goToBoardDetail(board.boardId)"
      >
        <h3>{{ board.boardTitle }}</h3>
        <p>{{ board.boardContent }}</p>
        <p><strong>조회수:</strong> {{ board.boardViews }}</p>
        <p><strong>등록일:</strong> {{ formatDate(board.boardRegDate) }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'UserBoardList',
  props: {
    title: {
      type: String,
      required: true
    },
    apiUrl: {
      type: String,
      required: true
    },
    emptyMessage: {
      type: String,
      default: '데이터가 없습니다.'
    }
  },
  data() {
    return {
      boards: [],
      loading: true
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
        const response = await axios.get(`http://localhost:8081${this.apiUrl}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.boards = response.data;
      } catch (error) {
        console.error('게시글 가져오기 실패:', error);
      } finally {
        this.loading = false;
      }
    },
    goToBoardDetail(boardId) {
      this.$router.push(`/boards/detail/${boardId}`);
    },
    formatDate(dateString) {
      const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    }
  },
  mounted() {
    this.fetchBoards();
  }
}
</script>

<style scoped>
.user-board-list {
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
  gap: 20px;
  margin-top: 20px;
}

.board-card {
  background-color: #1e1e1e;
  padding: 20px;
  border-radius: 12px;
  width: 80%;
  text-align: left;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.6);
}

.board-card:hover {
  background-color: #2c2c2c;
}

.board-card h3 {
  color: #f87171;
  margin-bottom: 10px;
}
</style>
