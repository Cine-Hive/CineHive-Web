<template>
  <div class="create-post-container">
    <h1>게시물 등록</h1>

    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
    <div v-if="successMessage" class="success-message">
      {{ successMessage }}
    </div>

    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="title">제목</label>
        <input type="text" id="title" v-model="title" placeholder="게시물 제목"  />
      </div>

      <div class="form-group">
        <label for="content">내용</label>
        <textarea id="content" v-model="content" placeholder="게시물 내용을 입력하세요" ></textarea>
      </div>
      <button type="submit" class="submit-btn">등록</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import { mapState } from 'vuex';

export default {
  data() {
    return {
      title: '',
      content: '',
      author: '',
      errorMessage: '',
      successMessage: ''
    };
  },
  computed: {
    ...mapState({
      user: state => state.user, // Vuex에서 user 정보 가져오기
    })
  },
  methods: {
    async handleSubmit() {
      // 비어있는 필드 체크
      if (!this.title || !this.content || !this.author) {
        this.errorMessage = '모든 필드를 채워주세요.';
        return;
      }

      try {
        const response = await axios.post('http://localhost:8081/api/boards/create', {
          title: this.title,
          content: this.content,
        });

        if (response.status === 201) {
          this.successMessage = '게시물이 성공적으로 등록되었습니다!';
          // 글 등록 후 메인 게시판 목록 페이지로 리다이렉트
          setTimeout(() => {
            this.$router.push('/board');
          }, 2000);
        }
      } catch (error) {
        this.errorMessage = '게시물 등록에 실패했습니다. 다시 시도해주세요.';
      }
    },
  },
};
</script>

<style scoped>
.create-post-container {
  width: 500px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
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
  border: 1px solid #ccc;
  border-radius: 4px;
}

textarea {
  height: 150px;
}

button.submit-btn {
  width: 100%;
  padding: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
}

button.submit-btn:hover {
  background-color: #45a049;
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
</style>
