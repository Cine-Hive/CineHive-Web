<template>
  <div class="create-post-container">
    <h3 class="create-post-title">글 등록</h3>

    <div class="title-line"></div>
    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
    <div v-if="successMessage" class="success-message">
      {{ successMessage }}
    </div>

    <table class="input-table">
      <tr>
        <td>제목</td>
        <td><input style="font-size: 12px; color: white" placeholder="제목을 입력하세요." type="text" v-model="brdTitle" /></td>
      </tr>
      <tr>
        <td>닉네임</td>
        <td><input  type="text" v-model="user.nickname" disabled /></td>
      </tr>
      <tr>
        <td>내용</td>
        <td><textarea style="font-size: 12px; color: white" placeholder="내용을 입력하세요." v-model="brdContent"></textarea></td>
      </tr>
    </table>

    <button type="submit" class="submit-btn" @click="handleSubmit">등록</button>
  </div>
</template>


<script>
import axios from 'axios';
import { mapState } from 'vuex';

export default {
  data() {
    return {
      brdTitle: '',
      brdContent: '',
      errorMessage: '',
      successMessage: ''
    };
  },
  computed: {
    ...mapState({
      user: state => state.user,
    })
  },
  methods: {
    async handleSubmit() {
      // 비어있는 필드 체크
      if (!this.brdTitle || !this.brdContent || !this.user.email) {
        this.errorMessage = '모든 필드를 채워주세요.';
        return;
      }

      try {
        const response = await axios.post('http://localhost:8081/boards/create', {
          memEmail: this.user.email,
          brdTitle: this.brdTitle,
          brdContent: this.brdContent,
        });
        alert("게시글이 등록되었습니다.");
        console.log("res",response);
      } catch (error) {
        this.errorMessage = '게시물 등록에 실패했습니다. 다시 시도해주세요.';
      }
    },
  },
};
</script>

<style scoped>
.create-post-container {
  width: 60%;
  min-height: 950px;
  margin: 0 auto;
  padding: 20px;
}

.create-post-title {
  color: white;
  position: relative;
  left: -47%;
  top: 50px;
}

.title-line {
  border-bottom: 0.1px solid #1E1E1E;
  position: relative;
  top: 60px;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input, textarea {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border-radius: 4px;
  background-color: #1E1E1E;
  border: 1px solid #1E1E1E;
}

textarea {
  min-height: 300px;
}

.board-create-box {
  width: 100%;
  position: relative;
  top: 100px;
}

textarea {
  height: 150px;
}

button.submit-btn {
  width: 90px;
  padding: 10px;
  background-color: #d95a15;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  position: relative;
  top:80px;
  float: right;
}

button.submit-btn:hover {
  background-color: #45a049;
}
.page-number-button.active {
  background-color: #d95a15; /* 현재 페이지 색상을 #d95a15로 변경 */
  color: white; /* 텍스트 색상은 흰색으로 유지 */
}

.error-message {
  color: red;
  text-align: center;
  margin-bottom: 15px;
}

.success-message {
  color: green;
  text-align: center;
  margin-bottom: 15px;
}

.input-table {
  width: 100%;
  margin-top: 20px;
  color: white;
  border-collapse: collapse;
  position: relative;
  top:60px;
}
.input-table tr td{
  font-size: 14px;
}
.input-table td {
  padding: 10px;
  border: 1px solid #1E1E1E;
}

.input-table th {
  border: 1px solid #1E1E1E;
}
.input-table td:first-child {
  width: 8%; /* 왼쪽 칸의 너비를 줄임 */
}

.input-table td:last-child {
  width: 75%; /* 오른쪽 칸의 너비를 늘림 */
}
</style>
