<template>
  <div class="mypage-wrapper">
    <div class="max-w-6xl mx-auto flex">
      <div class="w-1/3 pr-8 border-r border-gray-700">
        <h1 class="text-xl font-bold mb-6">마이페이지</h1>
        <div class="space-y-6 text-sm menu-section">
          <div>
            <h2 class="font-semibold text-gray-400 mb-1">영화 정보 조회</h2>
            <ul class="space-y-1">
              <li @click="goToBookmarks">찜한 목록</li>
              <li @click="goToReplies">작성한 감상평</li>
              <li @click="goToLikedReplies">좋아요한 감상평</li>
              <li @click="goToDislikedReplies">싫어요한 감상평</li>
            </ul>
          </div>

          <div>
            <h2 class="font-semibold text-gray-400 mb-1">게시판 정보 조회</h2>
            <ul class="space-y-1">
              <li @click="goToBoards">작성한 게시글</li>
              <li @click="goToComments">작성한 댓글</li>
              <li @click="goToLikedBoards">좋아요 누른 게시글</li>
              <li @click="goToDislikedBoards">싫어요 누른 게시글</li>
              <li @click="goToBookmarkedBoards">즐겨찾기 누른 게시글</li>
            </ul>
          </div>

          <div>
            <h2 class="font-semibold text-gray-400 mb-1">회원 정보</h2>
            <ul class="space-y-1">
              <li @click="openChangeName">이름 변경</li>
              <li @click="goToPasswordChange">비밀번호 변경</li>
              <li @click="openChangeSex">성별 변경</li>
              <li @click="goToDeleteAccount">회원 탈퇴</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 오른쪽 사용자 정보 -->
      <div class="w-2/3 pl-8">
        <h2 class="text-xl font-bold mb-6">내 정보</h2>
        <p class="text-gray-400 mb-6">고객님께서 가입하신 회원 정보입니다.</p>

        <div v-if="user" class="space-y-4">
          <p><span class="info-label">이름</span>: {{ user.memName }}</p>
          <p><span class="info-label">이메일</span>: {{ user.memEmail }}</p>
          <p><span class="info-label">닉네임</span>: {{ user.memNickname }}</p>
          <p><span class="info-label">성별</span>: {{ user.memSex }}</p>
        </div>

        <div v-if="user?.genres?.length" class="mt-8">
          <p class="font-bold text-gray-200 mb-2">{{ user.memNickname }}님이 선호하는 장르</p>
          <p>{{ user.genres.join(' / ') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'MyPage',
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
        const { data } = await axios.get('http://localhost:8081/myPage/info', {
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
.mypage-wrapper {
  all: unset;
  background-color: black;
  min-height: 100vh;
  color: white;
  text-align: left;
  padding: 2rem;
  display: block;
}

ul {
  list-style: none;
  padding-left: 0;
}

h1{
  font-size: 3rem;
  color: white;
  padding-bottom: 10px;
}

h2{
  font-size: 2rem;
  color: white;
  padding-bottom: 10px;
  padding-top: 15px;
}

/* 왼쪽 메뉴 hover 효과 */
.menu-section li {
  cursor: pointer;
  padding-left: 0.25rem;
  padding-bottom: 0.25rem;
  transition: color 0.2s ease-in-out;
}
.menu-section li:hover {
  color: #f87171; /* Tailwind text-red-400 */
}

/* 오른쪽 사용자 정보 key label 스타일 */
.info-label {
  width: 6rem;
  display: inline-block;
  color: #9ca3af; /* Tailwind text-gray-400 */
}
</style>
