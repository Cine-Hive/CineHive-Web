<template>
  <div class="change-info-wrapper">
    <div class="change-info-container">
      <div class="change-info-sidebar">
        <MyPageSidebar></MyPageSidebar>
      </div>

      <div class="change-info-content">
        <h2 class="content-main-title">회원 탈퇴</h2>

        <div class="withdrawal-message">
          <span>그동안 <span class="disposable-css-title">CINIEVE</span>를 이용해 주셔서 감사합니다.</span>
        </div>

        <div class="withdrawal-warning">
          계정 삭제 시, 모든 데이터는 즉시 삭제되며 복구할 수 없습니다.<br>
          회원 탈퇴를 진행하시면 고객님의 모든 데이터(작업물, 프로젝트, 설정 포함)는 즉시 영구 삭제되며 복구가 불가능합니다. <br>
          신중하게 결정해주시고, 필요한 자료는 미리 백업하시길 바랍니다.
        </div>

        <p class="content-description">회원 탈퇴를 위해 비밀번호를 입력해주세요.</p>

        <div class="withdrawal-form">
          <div class="form-group">
            <label for="password">비밀번호 확인</label>
            <input
                id="password"
                v-model="password"
                type="password"
                placeholder="비밀번호를 입력하세요"
                class="input-field"
            />
            <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
          </div>
          <button
              @click="checkPassword"
              class="submit-button"
              :disabled="isProcessing"
          >
            {{ isProcessing ? '확인 중...' : '확인' }}
          </button>
        </div>

        <div v-if="showConfirmPopup" class="popup-overlay">
          <div class="popup-content">
            <p class="popup-text">정말 탈퇴하시겠습니까?</p>
            <div class="popup-buttons">
              <button @click="confirmWithdrawal" class="submit-button">예</button>
              <button @click="cancelWithdrawal" class="cancel-button">아니오</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import MyPageSidebar from "@/components/MyPageSideBar.vue";
import { checkUserPasswordApi, deleteAccount } from '@/api/user/mypage.js';

export default {
  name: 'DeleteAccount',
  components: { MyPageSidebar },
  data() {
    return {
      password: '',
      showConfirmPopup: false,
      errorMessage: '',
      isProcessing: false,
    };
  },
  methods: {
    async checkPassword() {
      const token = localStorage.getItem('token');
      this.errorMessage = '';

      if (!token) {
        alert('로그인이 필요합니다.');
        this.$router.push('/auth');
        return;
      }

      if (!this.password.trim()) {
        this.errorMessage = '비밀번호를 입력해주세요.';
        return;
      }

      this.isProcessing = true;
      try {
        const responseData = await checkUserPasswordApi(token, this.password);

        if (responseData.success) {
          this.showConfirmPopup = true;
        } else {
          this.errorMessage = responseData.message || '비밀번호가 일치하지 않습니다.';
        }
      } catch (error) {
        console.error('비밀번호 확인 실패:', error);
        this.errorMessage = error || '비밀번호 확인 중 오류가 발생했습니다.';
      } finally {
        this.isProcessing = false;
      }
    },

    async confirmWithdrawal() {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('로그인이 필요합니다.');
        this.$router.push('/auth');
        return;
      }

      try {
        await deleteAccount(token);

        alert('회원 탈퇴가 완료되었습니다.');
        localStorage.clear();

        if (this.$store && this.$store.commit) {
          this.$store.commit('SET_LOGIN', {
            isLoggedIn: false,
            user: {
              name: '',
              nickname: '',
              email: '',
              preferredGenres: [],
            },
            token: '',
            loginType: '',
          });
        }

        this.$router.push('/');
      } catch (error) {
        console.error('회원 탈퇴 실패:', error);
        alert(`회원 탈퇴에 실패했습니다: ${error || '알 수 없는 오류가 발생했습니다.'}`);
      }
    },

    cancelWithdrawal() {
      this.showConfirmPopup = false;
    }
  }
}
</script>


<style scoped>
.change-info-wrapper {
  background-color: black;
  min-height: 100vh;
  color: white;
  text-align: left;
  padding: 2rem;
  position: relative;
  top: 50px;
  left: -220px;
}

.change-info-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  gap: 40px;
}

.change-info-sidebar {
  width: 300px;
  padding-right: 40px;
  flex-shrink: 0;
}

.change-info-content {
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
  margin-bottom: 1rem;
  font-size: 15px;
}

.withdrawal-message {
  margin-bottom: 1.5rem;
}

.withdrawal-warning {
  margin-bottom: 3rem;
  color: #dddddd;
  font-size: 15px;
}

.withdrawal-form {
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

.input-field {
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
  background-color: #333;
  color: white;
  width: 100%;
  box-sizing: border-box;
}

.submit-button {
  padding: 12px 20px;
  background-color: #f87171;
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: bold;
  cursor: pointer;
}

.submit-button:hover {
  background-color: #f55050;
}

.submit-button:disabled {
  background-color: #d1d5db;
  cursor: not-allowed;
}

.cancel-button {
  padding: 10px 20px;
  background-color: gray;
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
}

.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.popup-content {
  background: #222;
  padding: 30px;
  border-radius: 10px;
  text-align: center;
}

.popup-text {
  font-size: 18px;
  margin-bottom: 20px;
}

.popup-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.disposable-css-title {
  color: red;
  font-weight: bold;
}

.error-message {
  color: #f87171;
  font-size: 14px;
  margin-top: 5px;
}
</style>
