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
            <div v-if="errorOldPassword" class="error-message">{{ errorOldPassword }}</div>
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
            <div v-if="errorNewPassword" class="error-message">{{ errorNewPassword }}</div>
          </div>
          <div>
            <span style="font-size: 14px; color: #cccccc"> 대,소문자 특수 문자를 포함하여 8자 이상으로 입력해 주세요.</span>
          </div>
          <button type="submit">비밀번호 변경</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import MyPageSidebar from "@/components/MyPageSideBar.vue";
import { changeUserPassword } from '@/api/user/mypage.js';

export default {
  name: 'UserPwChange',
  components: {MyPageSidebar},
  data() {
    return {
      oldPassword: '',
      newPassword: '',
      errorOldPassword: '',
      errorNewPassword: '',
    }
  },
  methods: {
    async handleChangePassword() {
      this.errorOldPassword = '';
      this.errorNewPassword = '';

      const token = localStorage.getItem('token');
      if (!token) {
        alert('로그인이 필요합니다.');
        return;
      }

      if (this.oldPassword.length < 1) {
        this.errorOldPassword = '현재 비밀번호를 입력해주세요.';
        alert(this.errorOldPassword);
        return;
      }

      const passwordRegex = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/;
      if (!passwordRegex.test(this.newPassword)) {
        this.errorNewPassword = '대문자, 특수문자를 포함하여 8자 이상 입력해주세요.';
        alert(this.errorNewPassword);
        return;
      }

      const isConfirmed = confirm('정말로 비밀번호를 변경하시겠습니까? 변경 후 다시 로그인해야 합니다.');

      if (!isConfirmed) {
        console.log('비밀번호 변경이 취소되었습니다.');
        return;
      }

      try {
        await changeUserPassword(token, this.oldPassword, this.newPassword);

        alert('비밀번호가 성공적으로 변경되었습니다.\n다시 로그인해주세요.');

        localStorage.clear();
        this.$router.push('/auth');

      } catch (error) {
        console.error('비밀번호 변경 실패:', error);

        const message = error || '비밀번호 변경 중 오류가 발생했습니다.';

        alert(`비밀번호 변경 실패: ${message}`);

        if (message.includes('현재 비밀번호') || message.includes('일치하지')) {
          this.errorOldPassword = message;
        } else {
          this.errorNewPassword = message;
        }
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
  font-size: 1.6rem;
  color: white;
  padding-bottom: 10px;
  padding-top: 15px;
  margin-bottom: 10px;
}

.content-description {
  color: #9ca3af;
  margin-bottom: 2rem;
  font-size: 14px;
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

.error-message {
  font-size: 14px;
  margin-top: 5px;
  color: #f87171;
}

</style>
