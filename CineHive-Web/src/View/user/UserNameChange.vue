<template>
  <div class="change-info-wrapper">
    <h1>이름 변경</h1>
    <input v-model="newName" placeholder="새 이름 입력" class="input-field"/>
    <button @click="submitChange" class="submit-button">이름 변경</button>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'UserNameChange',
  data() {
    return {
      newName: '',
    }
  },
  methods: {
    async submitChange() {
      if (this.newName.trim().length < 1) {
        alert('이름을 입력해주세요.');
        return;
      }

      const token = localStorage.getItem('token');
      try {
        await axios.put('http://localhost:8081/myInfo/change-memname',
            { newMemName: this.newName },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        alert('이름이 성공적으로 변경되었습니다.');
        this.$router.push('/mypage');
      } catch (error) {
        console.error('이름 변경 실패:', error);
        alert('이름 변경 실패');
      }
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
</style>
