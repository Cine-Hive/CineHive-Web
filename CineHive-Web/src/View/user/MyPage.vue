<template>
  <div class="mypage-wrapper">
    <div class="mypage-container">
      <div class="mypage-sidebar">
          <MyPageSidebar></MyPageSidebar>
      </div>

      <!-- 오른쪽 섹션: 내 정보 -->
      <div class="mypage-content">
        <h2 class="content-main-title">내 정보</h2>
        <p class="content-description">고객님께서 가입하신 회원 정보입니다.</p>
        <div v-if="user" class="user-info-section">
          <div class="info-row">
            <span class="info-label">이름</span>: {{ user.memName }}
          </div>
          <div class="info-row">
            <span class="info-label">이메일</span>: {{ user.memEmail }}
          </div>
          <div class="info-row">
            <span class="info-label">닉네임</span>: {{ user.memNickname }}
          </div>
          <div class="info-row">
            <span class="info-label">성별</span>: {{ user.memSex }}
          </div>
        </div>

        <!-- 사용자 선호 장르 -->
        <div v-if="user?.genres?.length" class="user-genres-section">
          <p class="genres-title">{{ user.memNickname }}님이 선호하는 장르</p>
          <p class="genres-list">{{ user.genres.join(' / ') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import axios from 'axios'
import MyPageSidebar from "@/components/MyPageSideBar.vue";
export default {
  name: 'MyPage',
  components: {MyPageSidebar},
  data() {
    return {
      user: null,
    }
  },
  methods: {
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

.mypage-wrapper {
  background-color: black;
  min-height: 100vh;
  color: white;
  text-align: left;
  padding: 2rem;
  position: relative;
  top:50px;
  position: relative;
  left:-220px;
}

.mypage-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  gap: 40px;
}

.mypage-sidebar {
  width: 300px;
  padding-right: 40px;
  flex-shrink: 0;
}

.sidebar-main-title {
  font-size: 2rem;
  color: white;
  padding-bottom: 10px;
  padding-top: 15px;
  margin-bottom: 10px;
}

.sidebar-menu-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
  font-size: 16px;
}

.mypage-content {
  flex-grow: 1;
  padding-left: 40px;
}

.content-main-title {
  font-size: 2rem;
  color: white;
  padding-bottom: 10px;
  padding-top: 15px;
  margin-bottom: 10px;
}

.content-description {
  color: #9ca3af;
  margin-bottom: 2rem;
}

.user-info-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info-row {

}

.info-label {
  display: inline-block;
  color: #9ca3af;
  font-weight: bold;
  margin-right: 6px;
}

.user-genres-section {
  margin-top: 7rem;
}

.genres-title {
  font-weight: bold;
  color: #e5e7eb;
  margin-bottom: 0.5rem;
  font-size: 20px;
}
</style>
