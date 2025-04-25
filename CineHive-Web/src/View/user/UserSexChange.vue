<template>
  <div class="change-info-wrapper">
    <h1>성별 변경</h1>
    <select v-model="newSex" class="input-field">
      <option disabled value="">성별 선택</option>
      <option value="male">남성</option>
      <option value="female">여성</option>
      <option value="other">기타</option>
    </select>
    <button @click="submitChange" class="submit-button">성별 변경</button>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'UserSexChange',
  data() {
    return {
      newSex: '',
    }
  },
  methods: {
    async submitChange() {
      if (!this.newSex) {
        alert('성별을 선택해주세요.');
        return;
      }

      const token = localStorage.getItem('token');
      try {
        await axios.put('http://localhost:8081/myInfo/change-memsex',
            { newMemSex: this.newSex },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        alert('성별이 성공적으로 변경되었습니다.');
        this.$router.push('/mypage');
      } catch (error) {
        console.error('성별 변경 실패:', error);
        alert('성별 변경 실패');
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
