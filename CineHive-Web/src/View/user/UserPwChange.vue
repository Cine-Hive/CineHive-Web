<template>
  <div class="pw-change-wrapper">
    <h1>비밀번호 변경</h1>

    <form @submit.prevent="handleChangePassword" class="pw-change-form">
      <input
          v-model="oldPassword"
          type="password"
          placeholder="현재 비밀번호"
          required
      />
      <input
          v-model="newPassword"
          type="password"
          placeholder="새 비밀번호 (대문자 + 특수문자 포함)"
          required
      />
      <button type="submit">비밀번호 변경</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'UserPwChange',
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
  background: black;
  color: white;
  min-height: 950px;
  padding: 40px;
  text-align: center;
}

.pw-change-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 400px;
  margin: 0 auto;
}

.pw-change-form input {
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
}

.pw-change-form button {
  padding: 12px;
  border-radius: 8px;
  background-color: #f87171;
  color: white;
  font-weight: bold;
  cursor: pointer;
}

.pw-change-form button:hover {
  background-color: #f55050;
}
</style>
