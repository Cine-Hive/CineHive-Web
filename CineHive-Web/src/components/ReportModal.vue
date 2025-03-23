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
    }
  },
  data() {
    return {
      reason: ''
    };
  },
  methods: {
    async submitReport() {
      const confirmReport = confirm('정말 신고하시겠습니까?');
      if (!confirmReport) {
        return;
      }

      if (!this.reason.trim()) {
        alert('신고 사유를 입력하세요.');
        return;
      }

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          alert('로그인 정보가 없습니다.');
          return;
        }

        const config = {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        };

        const boardId = this.boardId;
        const response = await axios.post(
            `http://localhost:8081/report/${boardId}`,
            { reason: this.reason },
            config
        );

        console.log(response);
        alert('신고되었습니다.');

        this.closeModal();
      } catch (error) {
        if (error.response) {
          alert('이미 신고한 게시글입니다.');
        } else {
          alert('신고 처리 중 오류가 발생했습니다.');
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
