<template>
  <div class="change-info-wrapper">
    <h1>회원 탈퇴</h1>

    <input
        v-model="password"
        type="password"
        placeholder="비밀번호를 입력하세요"
        class="input-field"
    />
    <button @click="checkPassword" class="submit-button">확인</button>

    <!-- 탈퇴 확인 팝업 -->
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
</template>

<script>
import axios from 'axios'

export default {
  name: 'DeleteAccount',
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
  padding: 30px;
  background: black;
  min-height: 950px;
  color: white;
  text-align: center;
}

.input-field {
  padding: 10px;
  width: 250px;
  margin-top: 20px;
  margin-bottom: 20px;
}

.submit-button {
  padding: 10px 20px;
  background-color: red;
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
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
