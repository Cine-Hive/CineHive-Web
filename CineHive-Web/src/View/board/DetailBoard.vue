<template>
  <div class="detail-board">
    <div class="button-container" v-if="isLoggedIn && isAuthor">
      <span class="edit-btn" @click="goToEdit">수정</span>
      <span class="delete-btn" @click="confirmDelete">삭제</span>
    </div>
    <div class="title-section">
      <h1 class="board-title">{{ board.brdTitle }}</h1>
      <div class="info">
        <span @click="toggleBookmark" :style="{ cursor: 'pointer', color: isBookmarked ? 'gold' : 'gray' }">⭐</span>
        {{ board.bookmarkCount }}
        <span @click="toggleLike" :style="{ cursor: 'pointer', color: isLiked ? 'yellow' : 'gray' }">👍</span>
        {{ board.likeCount }}
        <span @click="toggleDisLike" :style="{ cursor: 'pointer', color: isDisliked ? 'red' : 'gray' }">👎</span>
        {{ board.dislikeCount }}
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

    <button class="board-detail-back-btn" @click="goToBack">뒤로가기</button>
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
      successMessage: '',
    };
  },
  computed: {
    ...mapState({
      user: state => state.user,
      isLoggedIn: state => state.isLoggedIn,
      isBookmarked: state => state.isBookmarked,
      isLiked: state => state.isLiked,
      isDisliked: state => state.isDisliked,
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
        await this.fetchCounts(boardId);
      } catch (error) {
        this.errorMessage = '게시글 상세 조회에 실패했습니다.';
        console.error('게시글 상세 조회에 실패했습니다:', error);
      }
    },
    async fetchCounts(boardId) {
      try {
        const bookmarkCountResponse = await axios.get(`http://localhost:8081/bookmark/${boardId}/count`);
        this.board.bookmarkCount = bookmarkCountResponse.data;

        const likeCountResponse = await axios.get(`http://localhost:8081/like/${boardId}/count`);
        this.board.likeCount = likeCountResponse.data;

        const dislikeCountResponse = await axios.get(`http://localhost:8081/dislike/${boardId}/count`);
        this.board.dislikeCount = dislikeCountResponse.data;
      } catch (error) {
        console.error('카운트 조회에 실패했습니다:', error);
      }
    },
    async toggleBookmark() {
      const boardId = this.board.id;
      const memEmail = this.user.email;
      try {
        if (this.isBookmarked) {
          await axios.delete(`http://localhost:8081/bookmark/${boardId}/users/${memEmail}`);
          this.board.bookmarkCount--;
          this.$store.dispatch('setBookmark', false);
          localStorage.setItem('isBookmarked', 'false');
          alert("즐겨찾기가 취소되었습니다.");
        } else {
          await axios.post(`http://localhost:8081/bookmark/${boardId}/users/${memEmail}`);
          this.board.bookmarkCount++;
          this.$store.dispatch('setBookmark', true);
          localStorage.setItem('isBookmarked', 'true');
          alert("즐겨찾기에 추가되었습니다.");
        }
      } catch (error) {
        console.error('즐겨찾기 처리에 실패했습니다:', error);
      }
    },
    async toggleLike() {
      const boardId = this.board.id;
      const memEmail = this.user.email;
      try {
        if (this.isLiked) {
          await axios.delete(`http://localhost:8081/like/${boardId}/users/${memEmail}`);
          this.board.likeCount--;
          this.$store.dispatch('setLike', false);
          localStorage.setItem('isLiked', 'false');
          alert("좋아요가 취소되었습니다.");
        } else {
          await axios.post(`http://localhost:8081/like/${boardId}/users/${memEmail}`);
          this.board.likeCount++;
          this.$store.dispatch('setLike', true);
          localStorage.setItem('isLiked', 'true');
          alert("좋아요가 추가되었습니다.");
        }
      } catch (error) {
        console.error('좋아요 처리에 실패했습니다:', error);
      }
    },
    async toggleDisLike() {
      const boardId = this.board.id;
      const memEmail = this.user.email;
      try {
        if (this.isDisliked) {
          await axios.delete(`http://localhost:8081/dislike/${boardId}/users/${memEmail}`);
          this.board.dislikeCount--;
          this.$store.dispatch('setDislike', false);
          localStorage.setItem('isDisliked', 'false');
          alert("싫어요가 취소되었습니다.");
        } else {
          await axios.post(`http://localhost:8081/dislike/${boardId}/users/${memEmail}`);
          this.board.dislikeCount++;
          this.$store.dispatch('setDislike', true);
          localStorage.setItem('isDisliked', 'true');
          alert("싫어요가 추가되었습니다.");
        }
      } catch (error) {
        console.error('싫어요 처리에 실패했습니다:', error);
      }
    },
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('ko-KR', options);
    },
    goToBack() {
      this.$router.go(-1);
    },
    confirmDelete() {
      if (confirm("정말 삭제하시겠습니까?")) {
        this.deleteBoard();
      }
    },
    async deleteBoard() {
      const boardId = this.board.id;
      try {
        await axios.delete(`http://localhost:8081/boards/delete/${boardId}`);
        alert("게시글이 삭제되었습니다.");
        this.goToBack();
      } catch (error) {
        this.errorMessage = '게시글 삭제에 실패했습니다.';
        console.error('게시글 삭제에 실패했습니다:', error);
      }
    },
    goToEdit() {
      const boardId = this.board.id;
      this.$router.push({ path: `/boards/${boardId}` });
    }
  }
};
</script>

<style scoped> .detail-board {
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
  top: 15px;
}

.info {
  display: flex;
  justify-content: center;
  gap: 13px;
  font-size: 14px;
  color: gray;
  float: right;
  position: relative;
  top: -10px;
}

.meta-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  border-radius: 8px;
  color: white;
  font-size: 13px;
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
  font-size: 14px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.3s;
  background-color: black;
  color: white;
  padding: 3px;
}

.edit-btn:hover {
  color: #ced4da;
}

.delete-btn {
  color: #990000;
}

.delete-btn:hover {
  color: red;
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

.board-detail-back-btn {
  width: 90px;
  height: 35px;
  font-size: 12.5px;
  background-color: #1E1E1E;
  border: #EB6015;
  border-radius: 3px;
  float: right;
  color: white;
}

.board-detail-back-btn:hover {
  cursor: pointer;
  background-color: #1a1a1a;
  transform: scale(1.03);
} </style>