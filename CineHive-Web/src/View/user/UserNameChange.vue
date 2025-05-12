<template>
  <div class="change-info-wrapper">
    <div class="change-info-container">
      <div class="change-info-sidebar">
        <MyPageSidebar></MyPageSidebar>
      </div>

      <div class="change-info-content">
        <h2 class="content-main-title">이름 변경</h2>
        <p class="content-description">새로운 이름을 입력하고 변경해주세요.</p>

        <div class="name-change-form">
          <div class="form-group">
            <label for="new-name">새 이름</label>
            <input
                id="new-name"
                v-model="newName"
                placeholder="새 이름을 입력하세요"
                class="input-field"
            />
          </div>
          <button @click="submitChange" class="submit-button">이름 변경</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import MyPageSidebar from "@/components/MyPageSideBar.vue";

export default {
  name: 'UserNameChange',
  components: {MyPageSidebar},
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

        if (error.response && error.response.data) {
          alert(`이름 변경 실패: ${error.response.data}`);
        } else {
          alert('이름 변경 중 알 수 없는 오류가 발생했습니다.');
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

.name-change-form {
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
