<template>
  <div class="change-info-wrapper">
    <div class="change-info-container">
      <div class="change-info-sidebar">
        <MyPageSidebar></MyPageSidebar>
      </div>

      <div class="change-info-content">
        <h2 class="content-main-title">성별 변경</h2>
        <p class="content-description">변경할 성별을 선택하고 변경해주세요.</p>

        <div class="sex-change-form">
          <div class="form-group">
            <label for="new-sex">새 성별</label>
            <select id="new-sex" v-model="newSex" class="input-field">
              <option disabled value="">성별 선택</option>
              <option value="male">남성</option>
              <option value="female">여성</option>
              <option value="other">기타</option>
            </select>
            <div style="font-size : 14px; margin-top: 5px; color: #dddddd;">회원 가입 시 기입 하지 않은 경우, 설정해 주셔야 합니다.</div>
          </div>
          <button @click="submitChange" class="submit-button">성별 변경</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import MyPageSidebar from "@/components/MyPageSideBar.vue";

export default {
  name: 'UserSexChange',
  components: {MyPageSidebar},
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

      const isConfirmed = confirm('정말로 성별을 변경하시겠습니까?');

      if (!isConfirmed) {
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

        if (error.response && error.response.data) {
          let errorMessage = error.response.data.message || error.response.data || '알 수 없는 오류 발생';
          alert(`성별 변경 실패: ${errorMessage}`);
        } else {
          alert('성별 변경 중 네트워크 오류가 발생했습니다.');
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
  font-size: 14px;
}

.sex-change-form {
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
  appearance: none;
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
