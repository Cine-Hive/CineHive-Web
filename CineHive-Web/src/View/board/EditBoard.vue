<template>
  <div class="create-post-container">
    <h3 class="create-post-title">글 수정</h3>

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
        <td><input type="text" v-model="user.nickname" disabled /></td>
      </tr>
      <tr>
        <td>내용</td>
        <td>
          <editor
              class="tui-editor-preview"
              ref="editor"
              :initialEditType="'markdown'"
              :previewStyle="'vertical'"
              :initialValue="brdContent"
          />
        </td>
      </tr>
    </table>

    <button class="create-back-btn" @click="goToBack">뒤로가기</button>
    <button class="submit-btn" @click="confirmUpdate">수정하기</button>
  </div>
</template>

<script>
import axios from 'axios';
import { mapState } from 'vuex';
import { Editor } from '@toast-ui/vue-editor';

export default {
  components: {
    Editor,
  },
  data() {
    return {
      brdTitle: '',
      brdContent: '',
      errorMessage: '',
      successMessage: '',
    };
  },
  computed: {
    ...mapState({
      user: state => state.user,
    }),
  },
  mounted() {
    this.fetchBoardDetail();
  },
  methods: {
    async fetchBoardDetail() {
      const boardId = this.$route.params.id;
      try {
        const response = await axios.get(`http://localhost:8081/boards/detail/${boardId}`);
        this.brdTitle = response.data.brdTitle;
        this.brdContent = response.data.brdContent;
      } catch (error) {
        this.errorMessage = '게시글 조회에 실패했습니다.';
        console.error('게시글 조회에 실패했습니다:', error);
      }
    },
    confirmUpdate() {
      if (confirm("수정 하시겠습니까?")) {
        this.handleUpdate();
      }
    },
    async handleUpdate() {
      const editorInstance = this.$refs.editor;

      if (!editorInstance) {
        this.errorMessage = '에디터 인스턴스를 가져오지 못했습니다.';
        return;
      }

      this.brdContent = editorInstance.invoke('getMarkdown');

      if (!this.brdTitle || !this.brdContent || !this.user.email) {
        this.errorMessage = '모든 필드를 채워주세요.';
        return;
      }

      const boardId = this.$route.params.id;

      try {
        const response = await axios.put(`http://localhost:8081/boards/${boardId}`, {
          memEmail: this.user.email,
          brdTitle: this.brdTitle,
          brdContent: this.brdContent,
        });
        alert("게시글이 수정되었습니다.");
        this.$router.go(-1);
        console.log("res", response);
      } catch (error) {
        this.errorMessage = '게시물 수정에 실패했습니다. 다시 시도해주세요.';
      }
    },
    goToBack() {
      this.$router.go(-1);
    }
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

input, textarea {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border-radius: 4px;
  background-color: #1E1E1E;
  border: 1px solid #1E1E1E;
}

button.submit-btn {
  width: 90px;
  padding: 10px;
  background-color: darkgreen;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 12.2px;
  cursor: pointer;
  position: relative;
  top: 80px;
  float: right;
  margin-left: 10px;
}

.create-back-btn {
  width: 90px;
  padding: 10px;
  background-color: #1E1E1E;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 12.2px;
  cursor: pointer;
  position: relative;
  top: 80px;
  float: right;
  margin-left: 10px;
}

.create-back-btn:hover {
  cursor: pointer;
  background-color: #1a1a1a;
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
  top: 60px;
}


.input-table tr td {
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
  width: 8%;
}

.input-table td:last-child {
  width: 75%;
}


.tui-editor-preview {
  background-color: #ffffff;
  height: 400px !important;
  padding: 20px;
  border-radius: 4px;
  border: 1px solid #333333;
  overflow-y: scroll;
  text-align: left;
}

</style>
