<template>
  <div class="pw-change-wrapper">
    <div class="pw-change-container">
      <!-- 왼쪽 섹션: 마이페이지 사이드바 -->
      <div class="pw-change-sidebar">
        <MyPageSidebar></MyPageSidebar>
      </div>

      <!-- 오른쪽 섹션: 비밀번호 변경 내용 -->
      <div class="pw-change-content">
        <h2 class="content-main-title">비밀번호 변경</h2>
        <p class="content-description">안전하게 비밀번호를 변경해주세요.</p>

        <form @submit.prevent="handleChangePassword" class="pw-change-form">
          <div class="form-group">
            <label for="old-password">현재 비밀번호</label>
            <input
                id="old-password"
                v-model="oldPassword"
                type="password"
                placeholder="현재 비밀번호를 입력하세요"
                required
            />
          </div>
          <div class="form-group">
            <label for="new-password">새 비밀번호</label>
            <input
                id="new-password"
                v-model="newPassword"
                type="password"
                placeholder="새 비밀번호 (대문자 + 특수문자 포함)"
                required
            />
          </div>

          <button type="submit">비밀번호 변경</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import MyPageSidebar from "@/components/MyPageSideBar.vue";

export default {
  name: 'UserPwChange',
  components: {MyPageSidebar},
  data() {
    return {
      oldPassword: '',
      newPassword: '',
    }
  },
  methods: {
    async handleChangePassword() {
      const token = localStorage.getItem('token');
      try {
        await axios.put('http://localhost:8081/myInfo/change-password', {
          oldPassword: this.oldPassword,
          newPassword: this.newPassword,
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });

        alert('비밀번호가 성공적으로 변경되었습니다.\n다시 로그인해주세요.');

        // ✅ 성공 시: localStorage 비우고 로그인 페이지로 이동
        localStorage.clear();
        this.$router.push('/auth');

      } catch (error) {
        alert('비밀번호 변경 실패: ' + (error.response?.data || error.message));
      }
    }
  }
}
</script>

<style scoped>
.pw-change-wrapper {
  background-color: black;
  min-height: 100vh;
  color: white;
  text-align: left;
  padding: 2rem;
  position: relative;
  top:50px;
  left:-220px;
}

.pw-change-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  gap: 40px;
}

.pw-change-sidebar {
  width: 300px;
  padding-right: 40px;
  flex-shrink: 0;
}

.pw-change-content {
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

.pw-change-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 400px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 1rem;
}

.form-group label {
  color: #e5e7eb;
  font-weight: bold;
  font-size: 1rem;
}

.pw-change-form input {
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
  background-color: #333;
  color: white;
}

.pw-change-form button {
  padding: 12px;
  border-radius: 8px;
  background-color: #f87171;
  color: white;
  font-weight: bold;
  cursor: pointer;
  border: none;
  margin-top: 1rem;
}

.pw-change-form button:hover {
  background-color: #f55050;
}
</style>
