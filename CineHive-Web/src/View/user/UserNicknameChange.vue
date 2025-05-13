<template>
  <div class="change-info-wrapper">
    <div class="change-info-container">
      <div class="change-info-sidebar">
        <MyPageSidebar></MyPageSidebar>
      </div>

      <div class="change-info-content">
        <h2 class="content-main-title">닉네임 변경</h2>
        <p class="content-description">새로운 닉네임을 입력하고 변경해주세요.</p>

        <div class="nickname-change-form">
          <div class="form-group">
            <label for="new-nickname">새 닉네임</label>
            <input
                id="new-nickname"
                v-model="newNickname"
                placeholder="새 닉네임을 입력하세요"
                class="input-field"
            />
            <div style="font-size: 14px; margin-top: 7px; color: #dddddd">
              중복된 닉네임을 사용할 수 없으니, 확인하고 설정해 주세요.
            </div>
            <div v-if="errorMessage" style="font-size: 14px; margin-top: 5px; color: #f87171;">
              {{ errorMessage }}
            </div>
          </div>
          <button @click="submitChangeNickname" class="submit-button">닉네임 변경</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import MyPageSidebar from "@/components/MyPageSideBar.vue";

export default {
  name: 'UserNicknameChange',
  components: {MyPageSidebar},
  data() {
    return {
      newNickname: '',
      errorMessage: ''
    }
  },
  methods: {
    async submitChangeNickname() {
      this.errorMessage = ''; // 기존 메시지 초기화

      if (this.newNickname.trim().length < 1) {
        const msg = '닉네임을 입력해주세요.';
        alert(msg);
        this.errorMessage = msg;
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        const msg = '로그인이 필요합니다.';
        alert(msg);
        this.errorMessage = msg;
        this.$router.push('/auth');
        return;
      }

      try {
        await axios.put(
            'http://localhost:8081/myInfo/change-nickname',
            { newNickname: this.newNickname },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        alert('닉네임이 성공적으로 변경되었습니다.');
        this.$router.push('/mypage');
      } catch (error) {
        console.error('닉네임 변경 실패:', error);

        if (error.response) {
          let msg = '';
          if (error.response.status === 409) {
            msg = '이미 사용 중인 닉네임입니다.';
          } else if (error.response.data) {
            msg = error.response.data;
          } else {
            msg = `닉네임 변경 중 오류가 발생했습니다. (상태 코드: ${error.response.status})`;
          }
          alert(`닉네임 변경 실패: ${msg}`);
          this.errorMessage = msg;
        } else {
          const msg = '닉네임 변경 중 네트워크 오류가 발생했습니다.';
          alert(msg);
          this.errorMessage = msg;
        }
      }
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
  font-size: 1.6rem;
  color: white;
  padding-bottom: 10px;
  padding-top: 15px;
  margin-bottom: 10px;
}

.content-description {
  color: #9ca3af;
  margin-bottom: 2rem;
}

.nickname-change-form {
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
</style>
