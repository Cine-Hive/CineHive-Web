<template>
  <div class="detail-board">
    <div class="button-container" v-if="isLoggedIn && isAuthor">
      <button class="edit-btn">수정</button>
      <button class="delete-btn">삭제</button>
    </div>
    <div class="title-section">
      <h1 class="board-title">{{ board.brdTitle }}</h1>
      <div class="info">
        <span>⭐ {{ board.bookmarkCount }}</span>

        <span>👍 {{ board.likeCount }}</span>
        <span>👎 {{ board.dislikeCount }}</span>
        <span>{{ formatDate(board.brgRedDate) }}</span>
      </div>
    </div>

    <div class="meta-info">
      <div class="author-box">
        <div>
          <span class="nickname"><span>작성자 : </span>{{ board.memNickname }}</span>
        </div>
      </div>
      <span>👁️ {{ board.views }}</span>
    </div>

    <div class="content-section">
      <p class="content-text">{{ board.brdContent }}</p>
    </div>

    <button class="board-detail-back-btn">뒤로가기</button>
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


        const bookmarkCountResponse = await axios.get(`http://localhost:8081/bookmark/${boardId}/count`);
        const likeCountResponse = await axios.get(`http://localhost:8081/like/${boardId}/count`);
        const dislikeCountResponse = await axios.get(`http://localhost:8081/dislike/${boardId}/count`);


        this.board.bookmarkCount = bookmarkCountResponse.data;
        this.board.likeCount = likeCountResponse.data;
        this.board.dislikeCount = dislikeCountResponse.data;

        console.log("res", response);
      } catch (error) {
        this.errorMessage = '게시글 상세 조회에 실패했습니다.';
        console.error('게시글 상세 조회에 실패했습니다:', error);
      }
    },
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
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
  padding: 25px;
}


.title-section {
  border-bottom: 2px solid #333;
  padding-bottom: 15px;
  text-align: center;
}

.board-title {
  font-size: 18px;
  font-weight: lighter;
  color: #ffffff;
  margin-bottom: 8px;
  text-align: left;
  position: relative;
  top:15px;
}

.info {
  display: flex;
  justify-content: center;
  gap: 15px;
  font-size: 14px;
  color: gray;
  float: right;
  position: relative;
  top:-10px;
}


.meta-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  border-radius: 8px;
}

.author-box {
  display: flex;
  align-items: center;
}

.nickname {
  font-size: 14px;
  font-weight: lighter;
  color: white;
}


.content-section {
  margin-top: 20px;
  font-size: 16px;
  line-height: 2.5;
  text-align: left;
  border-top: 1px solid #1a1a1a;
}

.content-text {
  color: white;
  height: 600px;
}


.button-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.edit-btn, .delete-btn {
  width: 100px;
  padding: 12px;
  font-size: 14px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.3s;
}

.edit-btn {
  background: #4caf50;
  color: white;
}

.edit-btn:hover {
  background: #388e3c;
}

.delete-btn {
  background: #e53935;
  color: white;
  margin-left: 10px;
}

.delete-btn:hover {
  background: #c62828;
}

/* 반응형 */
@media screen and (max-width: 768px) {
  .detail-board {
    width: 90%;
    padding: 20px;
  }

  .meta-info {
    flex-direction: column;
    align-items: flex-start;
  }

  .button-container {
    justify-content: center;
  }
}
.board-detail-back-btn{
  width: 90px;
  height: 35px;
  font-size: 13px;
  background-color: #EB6015;
  border: #EB6015;
  border-radius: 3px;
  float: right;
  color: #1a1a1a;
}
</style>
