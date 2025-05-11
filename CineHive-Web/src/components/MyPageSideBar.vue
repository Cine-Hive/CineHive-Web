<template>
  <div class="mypage-sidebar-content">
    <div class="mypage-sidebar">
      <h2 class="sidebar-main-title">마이페이지</h2>
      <div class="title-line"></div>
      <div class="sidebar-menu-section">
      </div>
    </div>
  <div class="menu-group">
    <span class="section-title">영화 정보 조회</span>
    <ul class="menu-list">
      <li @click="goToBookmarks" class="menu-item">찜한 목록</li>
      <li @click="goToReplies" class="menu-item">작성한 감상평</li>
      <li @click="goToLikedReplies" class="menu-item">좋아요한 감상평</li>
      <li @click="goToDislikedReplies" class="menu-item">싫어요한 감상평</li>
    </ul>
  </div>

  <div class="menu-group">
    <div class="title-line"></div>
    <span class="section-title">게시판 정보 조회</span>
    <ul class="menu-list">
      <li @click="goToBoards" class="menu-item">작성한 게시글</li>
      <li @click="goToComments" class="menu-item">작성한 댓글</li>
      <li @click="goToLikedBoards" class="menu-item">좋아요 누른 게시글</li>
      <li @click="goToDislikedBoards" class="menu-item">싫어요 누른 게시글</li>
      <li @click="goToBookmarkedBoards" class="menu-item">즐겨찾기 누른 게시글</li>
    </ul>
  </div>

  <!-- 회원 정보 그룹 -->
  <div class="menu-group">
    <div class="title-line"></div>
    <span class="section-title">회원 정보</span>
    <ul class="menu-list">
      <li @click="openChangeName" class="menu-item">이름 변경</li>
      <li @click="goToPasswordChange" class="menu-item">비밀번호 변경</li>
      <li @click="openChangeSex" class="menu-item">성별 변경</li>
      <li @click="goToDeleteAccount" class="menu-item">회원 탈퇴</li>
    </ul>
  </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'MyPageSidebar',
  data() {
    return {
      user: null,
    }
  },
  methods: {
    goToDeleteAccount() {
      const targetPath = '/mypage/delete-account';
      if (this.$route.path !== targetPath) {
        this.$router.push(targetPath);
      }
    },
    goToDislikedReplies() {
      const targetPath = '/mypage/disliked-replies';
      if (this.$route.path !== targetPath) {
        this.$router.push(targetPath);
      }
    },
    goToLikedReplies() {
      const targetPath = '/mypage/liked-replies';
      if (this.$route.path !== targetPath) {
        this.$router.push(targetPath);
      }
    },
    goToBookmarks() {
      const targetPath = '/mypage/bookmarks';
      if (this.$route.path !== targetPath) {
        this.$router.push(targetPath).then(() => window.location.reload());
      }
    },
    goToReplies() {
      const targetPath = '/mypage/replies';
      if (this.$route.path !== targetPath) {
        this.$router.push(targetPath).then(() => window.location.reload());
      }
    },
    goToLikedBoards() {
      const targetPath = '/mypage/liked-boards';
      if (this.$route.path !== targetPath) {
        this.$router.push(targetPath).then(() => window.location.reload());
      }
    },
    goToDislikedBoards() {
      const targetPath = '/mypage/disliked-boards';
      if (this.$route.path !== targetPath) {
        this.$router.push(targetPath).then(() => window.location.reload());
      }
    },
    goToBoards() {
      const targetPath = '/mypage/boards';
      if (this.$route.path !== targetPath) {
        this.$router.push(targetPath).then(() => window.location.reload());
      }
    },goToComments() {
      const targetPath = '/mypage/comments';
      if (this.$route.path !== targetPath) {
        this.$router.push(targetPath).then(() => window.location.reload());
      }
    },goToBookmarkedBoards() {
      const targetPath = '/mypage/bookmarked-boards';
      if (this.$route.path !== targetPath) {
        this.$router.push(targetPath).then(() => window.location.reload());
      }

    },goToPasswordChange() {
      const targetPath = '/mypage/password-change';
      if (this.$route.path !== targetPath) {
        this.$router.push(targetPath).then(() => window.location.reload());
      }
    },
    openChangeName() {
      const targetPath = '/mypage/name-change';
      if (this.$route.path !== targetPath) {
        this.$router.push(targetPath);
      }
    },
    openChangeSex() {
      const targetPath = '/mypage/sex-change';
      if (this.$route.path !== targetPath) {
        this.$router.push(targetPath);
      }
    },


    async fetchUserInfo() {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('로그인이 필요합니다.');
        return;
      }

      try {
        const { data } = await axios.get('http://localhost:8081/myInfo/info', {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.user = data;
      } catch (error) {
        console.error('사용자 정보 가져오기 실패:', error);
      }
    }


  },
  mounted() {
    this.fetchUserInfo();
  }
}
</script>

<style scoped>

.section-title {
  font-size: 20px;
  font-weight: bolder;
}

.title-line {
  border-bottom: 1px solid lightgray;
  padding: 0;
  margin-bottom: 20px;
  margin-top: 10px;
  width: 100%;
}

.menu-group {
  /* 필요한 추가 스타일 */
}

.menu-list {
  list-style: none;
  position: relative;
  left:-3px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.menu-item {
  font-size: 16px;
  cursor: pointer;
  padding-left: 0.25rem;
  padding-bottom: 0.25rem;
  transition: color 0.2s ease-in-out;
}

.menu-item:hover {
  color: #f87171;
}


</style>
