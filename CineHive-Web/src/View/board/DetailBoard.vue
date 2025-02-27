<template>
  <div class="detail-board">
    <h3 class="detail-title">게시글 상세</h3>

    <div class="title-line"></div>

    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>

    <div v-if="successMessage" class="success-message">
      {{ successMessage }}
    </div>

    <table class="input-table">
      <tr>
        <td><strong>제목</strong></td>
        <td>{{ board.brdTitle }}</td>
      </tr>
      <tr>
        <td><strong>닉네임</strong></td>
        <td>{{ board.memNickname }}</td>
      </tr>
      <tr>
        <td><strong>작성일</strong></td>
        <td>{{ formatDate(board.brgRedDate) }}</td>
      </tr>
      <tr>
        <td><strong>내용</strong></td>
        <td>{{ board.brdContent }}</td>
      </tr>
      <tr>
        <td><strong>좋아요 수</strong></td>
        <td>{{ board.likeCount }}</td>
      </tr>
      <tr>
        <td><strong>댓글 수</strong></td>
        <td>{{ board.commentCount }}</td>
      </tr>
      <tr>
        <td><strong>북마크 수</strong></td>
        <td>{{ board.bookmarkCount }}</td>
      </tr>
      <tr>
        <td><strong>신고 수</strong></td>
        <td>{{ board.reportCount }}</td>
      </tr>
      <tr>
        <td><strong>싫어요 수</strong></td>
        <td>{{ board.dislikeCount }}</td>
      </tr>
    </table>

    <div class="button-container" v-if="isLoggedIn && isAuthor">
      <button class="btn">수정</button>
      <button class="btn">삭제</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { mapState } from 'vuex';

export default {
  data() {
    return {
      board: {},
      errorMessage: '',
      successMessage: ''
    };
  },
  computed: {
    ...mapState({
      user: state => state.user,
      isLoggedIn: state => state.isLoggedIn,
    }),
    isAuthor() {
      return this.user.email === this.board.memEmail;
    }
  },
  mounted() {
    this.fetchBoardDetail();
  },
  methods: {
    async fetchBoardDetail() {
      const boardId = this.$route.params.id;
      try {
        const response = await axios.get(`http://localhost:8081/boards/detail/${boardId}`);
        this.board = response.data;
        console.log("res", response);
      } catch (error) {
        this.errorMessage = '게시글 상세 조회에 실패했습니다.';
        console.error('게시글 상세 조회에 실패했습니다:', error);
      }
    },
    formatDate(dateString) {
      const options = {year: 'numeric', month: 'long', day: 'numeric'};
      return new Date(dateString).toLocaleDateString('ko-KR', options);
    }
  }
};
</script>

<style scoped>

.detail-board {
  width: 60%;
  min-height: 950px;
  margin: 0 auto;
  padding: 20px;
}

.detail-title {
  color: white;
  font-size: 24px;
  text-align: center;
  margin-bottom: 20px;
}

.title-line {
  border-bottom: 2px solid #d95a15;
  margin-bottom: 20px;
}

.error-message, .success-message {
  text-align: center;
  margin-bottom: 15px;
  color: red;
}

.success-message {
  color: green;
}

.input-table {
  width: 100%;
  margin-top: 20px;
  color: white;
  border-collapse: collapse;
}

.input-table tr td {
  padding: 10px;
  border: 1px solid #1E1E1E;
  font-size: 14px;
}

.input-table td:first-child {
  width: 20%;
  font-weight: bold;
}

.button-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

button.btn {
  width: 90px;
  padding: 10px;
  background-color: #d95a15;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  margin-left: 10px;
  transition: background-color 0.3s;
}

button.btn:hover {
  background-color: #45a049;
}
</style>
