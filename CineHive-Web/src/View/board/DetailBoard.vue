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
      <Viewer v-if="board && board.brdContent" :initialValue="board.brdContent" />
    </div>
    <button class="board-detail-back-btn" @click="goToBack">뒤로가기</button>
    <div class="comment-section">
    <span class="comment-header">
    <h3>댓글</h3> (<span>{{ board.commentCount }}</span>)
    </span>

      <ul class="comment-list">
        <li v-for="(comment, index) in comments" :key="comment.id" class="comment-item">
          <div class="comment-details">
            <span class="comment-nickname">{{ comment.memNickname }}</span>
            <span class="comment-date">{{ formatDate(comment.brgRedDate) }}</span>
          </div>

          <span class="comment-content">{{ comment.content }}</span>

          <button v-if="comment.memEmail === user.email" @click="deleteComment(comment.id)" class="delete-comment-btn">삭제</button>


          <div v-if="index < comments.length - 1" class="comment-separator"></div>
        </li>
      </ul>


      <div class="comment-input">
        <input v-model="newComment" placeholder="댓글을 입력하세요." />
        <button @click="addComment">등록</button>
      </div>
    </div>

  </div>
</template>

<script>
import axios from 'axios';
import { mapState } from 'vuex';
import { Viewer } from '@toast-ui/vue-editor';

export default {
  components: {
    Viewer,
  },
  data() {
    return {
      board: {},
      errorMessage: '',
      successMessage: '',
      newComment: '',
      comments: []
    };
  },
  computed: {
    ...mapState({
      user: state => state.user,
      isLoggedIn: state => state.isLoggedIn,
    }),
    isBookmarked() {
      return this.$store.state.bookmarks[this.board.id] || false;
    },
    isLiked() {
      return this.$store.state.likes[this.board.id] || false;
    },
    isDisliked() {
      return this.$store.state.dislikes[this.board.id] || false;
    },
    isAuthor() {
      return this.user.email === this.board.memEmail;
    }
  },
  mounted() {
    this.fetchBoardDetail();
    this.fetchComments();
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

    // 댓글 조회 메서드
    async fetchComments() {
      const boardId = this.$route.params.id;
      try {
        const response = await axios.get(`http://localhost:8081/comment/all/board/${boardId}`);
        this.comments = response.data;
      } catch (error) {
        console.error('댓글 조회에 실패했습니다:', error);
      }
    },


    async addComment() {
      const boardId = this.board.id;
      const memEmail = this.user.email;
      try {
        const response = await axios.post(`http://localhost:8081/comment/${boardId}/${memEmail}`, {
          content: this.newComment
        });
        this.comments.push(response.data);
        this.newComment = '';
      } catch (error) {
        console.error('댓글 추가에 실패했습니다:', error);
      }
    },

    async deleteComment(commentId) {
      const boardId = this.board.id;
      try {
        await axios.delete(`http://localhost:8081/comment/board/${boardId}/delete/${commentId}`);
        this.comments = this.comments.filter(comment => comment.id !== commentId);
      } catch (error) {
        console.error('댓글 삭제에 실패했습니다:', error);
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
          this.$store.dispatch('setBookmark', {boardId, status: false});
          localStorage.setItem('isBookmarked', 'false');
          alert("즐겨찾기가 취소되었습니다.");
        } else {
          await axios.post(`http://localhost:8081/bookmark/${boardId}/users/${memEmail}`);
          this.board.bookmarkCount++;
          this.$store.dispatch('setBookmark', {boardId, status: true});
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
          this.$store.dispatch('setLike', {boardId, status: false});
          localStorage.setItem('isLiked', 'false');
          alert("좋아요가 취소되었습니다.");
        } else {
          await axios.post(`http://localhost:8081/like/${boardId}/users/${memEmail}`);
          this.board.likeCount++;
          this.$store.dispatch('setLike', {boardId, status: true});
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
          this.$store.dispatch('setDislike', {boardId, status: false});
          localStorage.setItem('isDisliked', 'false');
          alert("싫어요가 취소되었습니다.");
        } else {
          await axios.post(`http://localhost:8081/dislike/${boardId}/users/${memEmail}`);
          this.board.dislikeCount++;
          this.$store.dispatch('setDislike', {boardId, status: true});
          localStorage.setItem('isDisliked', 'true');
          alert("싫어요가 추가되었습니다.");
        }
      } catch (error) {
        console.error('싫어요 처리에 실패했습니다:', error);
      }
    },
    formatDate(dateString) {
      const options = {year: 'numeric', month: 'long', day: 'numeric'};
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
      this.$router.push({path: `/boards/${boardId}`});
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
::v-deep(.toastui-editor-contents *) {
  color: white !important;
  font-size: 14px;
}
::v-deep(.toastui-editor-contents) {
  min-height: 500px;
}
/* 댓글 섹션 스타일 */
.comment-section {
  margin-top: 60px;
  color: white;
  padding: 10px;
  font-size: 13px;
}

.comment-header {
  display: flex;
  align-items: center;
}

.comment-header h3 {
  margin: 0;
  margin-right: 5px;
}

.commnet-line{
  border:  1px solid #1E1E1E;
  position: relative;
  top:10px;
}
.comment-section h3 {
  text-align: left;
  font-size: 15px;
}

.comment-input {
  display: flex;
  margin-bottom: 15px;
}

.comment-input input {
  flex: 1;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #1E1E1E;
  color: black;
  transition: border 0.3s;
}

.comment-input input:focus {
  border: 1px solid #4CAF50;
}

.comment-input button {
  padding: 10px 15px;
  background-color: darkgreen;
  color: white;
  font-size: 12.5px;
  width: 70px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 10px;
  transition: background-color 0.3s;
}
.comment-separator {
  border-top: 0.1px solid #1E1E1E;
  margin: 2px 0;
}

.comment-input button:hover {
  background-color: #45a049;
}

.comment-list {
  padding: 0;
  text-align: left;
  position: relative;
  top:10px;
}

.comment-item {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
  padding: 5px;
  border-radius: 6px;
  transition: background-color 0.3s;
}



.comment-details {
  display: flex;
  justify-content: space-between;
}

.comment-nickname {
  font-weight: lighter;
}

.comment-content {
  margin-top: 5px;
  float: left;
}

.comment-date {
  font-size: 12px;
  color: gray;
  margin-top: 5px;
  text-align: right;
}

.delete-comment-btn {
  background-color: transparent;
  color: #e74c3c;
  border: none;
  cursor: pointer;
  transition: color 0.3s;
  text-align: right;
  position: relative;
  top: -10px;
}

.delete-comment-btn:hover {
  text-decoration: underline;
}

.button-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.edit-btn,
.delete-btn {
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
}

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
</style>