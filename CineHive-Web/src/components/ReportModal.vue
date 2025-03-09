<template>
  <div v-if="showModal" class="modal-overlay">
    <div class="modal-content">
      <div class="modal-header">
        <span class="modal-title">신고하기</span>
        <span class="modal-warning">*정당한 사유 없이 신고하지 않으면 불이익이 있을 수 있습니다.</span>
      </div>
      <textarea v-model="reason" placeholder="신고 사유를 입력하세요." rows="4" class="modal-textarea"></textarea>
      <div class="modal-buttons">
        <button @click="submitReport" class="btn-confirm">신고하기</button>
        <button @click="closeModal" class="btn-cancel">취소</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: {
    showModal: {
      type: Boolean,
      required: true
    },
    boardId: {
      type: Number,
      required: true
    },
    userEmail: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      reason: ''
    };
  },
  methods: {
    async submitReport() {
      this.reason = 'ㅎㅇㅎㅇ'; // 직접 설정하여 테스트

      if (!this.reason.trim()) {
        alert('신고 사유를 입력하세요.');
        return;
      }

      try {
        const boardId = this.boardId;
        const memEmail = this.userEmail;

        const encodedReason = encodeURIComponent(this.reason);
        const url = `http://localhost:8081/report/${boardId}/users/${memEmail}?reason=${encodedReason}`;

        const response = await axios.post(url, null);

        alert(response.data);
        this.closeModal();
      } catch (error) {
        if (error.response) {
          alert('신고하기에 실패했습니다: ' + error.response.data);
        } else if (error.request) {
          alert('신고하기에 실패했습니다: 요청이 이루어졌으나 응답을 받지 못했습니다.');
        } else {
          alert('신고하기에 실패했습니다: ' + error.message);
        }
      }
    },
    closeModal() {
      this.$emit('close');
      this.reason = '';
    }
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  animation: fadeIn 0.3s ease-out;
}

.modal-content {
  background: #fff;
  padding: 25px 30px;
  border-radius: 16px;
  width: 100%;
  max-width: 600px;
  min-height: 300px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease;
  animation: slideUp 0.3s ease-out;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title {
  margin: 0;
  color: black;
  font-weight: bolder;
  font-size: 13px;
  text-align: left;
  position: relative;
  top: -10px;
}

.modal-warning {
  font-size: 11px;
  font-weight: bolder;
  color: #e53935;
  position: relative;
  top:-10px;
}

.modal-textarea {
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 14px;
  font-size: 12px;
  resize: none;
  transition: border 0.3s;
  box-sizing: border-box;
  margin-bottom: 20px;
  height: 170px;
}

.modal-textarea:focus {
  border-color: #4CAF50;
  outline: none;
}

.modal-buttons {
  gap: 10px;
  text-align: right;
  position: relative;
  top: 8px;
}

.btn-confirm, .btn-cancel {
  height: 33px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition: background-color 0.3s, transform 0.2s;
  width: 14%;
  box-sizing: border-box;
}

.btn-confirm {
  background-color: red;
  color: white;
  position: relative;
  left: -1%;
}

.btn-cancel {
  background-color: #4a5855;
  color: white;
}

.btn-confirm:hover {
  background-color: #990000;
  transform: scale(1.05);
}

.btn-cancel:hover {
  background-color: #2a584f;
  transform: scale(1.05);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(10px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
