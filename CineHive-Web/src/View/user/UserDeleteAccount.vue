<template>
  <div class="change-info-wrapper">
    <div class="change-info-container">
      <div class="change-info-sidebar">
        <MyPageSidebar></MyPageSidebar>
      </div>

      <div class="change-info-content">
        <h2 class="content-main-title">회원 탈퇴</h2>
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
          </div>
          <button @click="checkPassword" class="submit-button">확인</button>
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
import axios from 'axios'
import MyPageSidebar from "@/components/MyPageSideBar.vue";

export default {
  name: 'DeleteAccount',
  components: {MyPageSidebar},
  data() {
    return {
      password: '',
      showConfirmPopup: false,
    }
  },
  methods: {
    async checkPassword() {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('로그인이 필요합니다.');
        this.$router.push('/auth');
        return;
      }

      try {
        const response = await axios.post('http://localhost:8081/myInfo/check-password',
            { password: this.password },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.success) {
          this.showConfirmPopup = true;
        } else {
          alert('비밀번호가 일치하지 않습니다.');
        }
      } catch (error) {
        console.error('비밀번호 확인 실패:', error);
        alert('오류가 발생했습니다.');
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
        await axios.delete('http://localhost:8081/myInfo/delete-account', {
          headers: { Authorization: `Bearer ${token}` }
        });

        alert('회원 탈퇴가 완료되었습니다.');
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        localStorage.removeItem('nickname');

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

        this.$router.push('/');
      } catch (error) {
        console.error('회원 탈퇴 실패:', error);
        alert('오류가 발생했습니다.');
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
  top:50px;
  left:-220px;
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
  margin-bottom: 2rem;
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
</style>
