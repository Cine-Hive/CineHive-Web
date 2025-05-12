<template>
  <div class="change-info-wrapper">
    <div class="change-info-container">
      <div class="change-info-sidebar">
        <!-- 마이페이지 사이드바 컴포넌트 사용 -->
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
          </div>
          <!-- 버튼 클릭 시 submitChangeNickname 메소드 호출 -->
          <button @click="submitChangeNickname" class="submit-button">닉네임 변경</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
// 마이페이지 사이드바 컴포넌트 경로 확인!
import MyPageSidebar from "@/components/MyPageSideBar.vue";

export default {
  name: 'UserNicknameChange', // 컴포넌트 이름
  components: {MyPageSidebar}, // 사용할 컴포넌트 등록
  data() {
    return {
      newNickname: '', // 새 닉네임을 저장할 데이터 속성
    }
  },
  methods: {
    async submitChangeNickname() {
      // 1. 입력 필드 유효성 검사
      if (this.newNickname.trim().length < 1) {
        alert('닉네임을 입력해주세요.');
        return;
      }

      // 2. 로컬 스토리지에서 토큰 가져오기
      const token = localStorage.getItem('token');
      if (!token) {
        alert('로그인이 필요합니다.'); // 토큰 없으면 로그인 필요 메시지
        this.$router.push('/auth'); // 로그인 페이지로 이동 (네 라우터 경로에 맞게 수정)
        return;
      }

      try {
        // 3. 서버 API 호출 (PUT 요청)
        // 서버 컨트롤러 엔드포인트 경로 확인!
        await axios.put('http://localhost:8081/myInfo/change-nickname',
            // 요청 바디에 새 닉네임을 JSON 형태로 담아서 보냄
            { newNickname: this.newNickname },
            // 요청 헤더에 JWT 토큰 포함
            { headers: { Authorization: `Bearer ${token}` } }
        );

        // 4. API 호출 성공 시 처리
        alert('닉네임이 성공적으로 변경되었습니다.');
        // 닉네임 변경 후 마이페이지 등으로 이동 (네 라우터 경로에 맞게 수정)
        this.$router.push('/mypage');

      } catch (error) {
        // 5. API 호출 실패 시 에러 처리
        console.error('닉네임 변경 실패:', error); // 개발자용 콘솔 로그

        // ⭐⭐ 서버 응답 에러를 확인해서 사용자에게 구체적으로 알려줌 ⭐⭐
        if (error.response) {
          // 서버 응답(error.response)이 있다면 상태 코드 확인
          if (error.response.status === 409) {
            // 상태 코드가 409 (Conflict)이면 닉네임 중복 에러!
            alert('이미 사용 중인 닉네임입니다.');
          } else if (error.response.data) {
            // 그 외 다른 HTTP 에러인데 서버에서 메시지를 보냈으면 그 메시지를 보여줌
            alert(`닉네임 변경 실패: ${error.response.data}`);
          } else {
            // 상태 코드는 있는데 특별한 메시지가 없거나 다른 에러
            alert(`닉네임 변경 중 오류가 발생했습니다. (상태 코드: ${error.response.status})`);
          }
        } else {
          // error.response 자체가 없다는 건 네트워크 문제 등일 가능성 높음
          alert('닉네임 변경 중 네트워크 오류가 발생했습니다.');
        }
      }
    }
  }
}
</script>

<style scoped>
/* 이름 변경 페이지랑 스타일이 거의 같으니, 필요하다면 공유 스타일 또는 동일한 스타일 적용 가능 */
/* 예시를 위해 이름 변경 페이지의 스타일 복사 */
.change-info-wrapper {
  background-color: black;
  min-height: 100vh;
  color: white;
  text-align: left;
  padding: 2rem;
  position: relative;
  top:50px;
  left:-220px; /* 이 위치 조정은 네 레이아웃에 맞게 바꿔야 해 */
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

.nickname-change-form { /* 이름 변경 폼 이름과 구분 */
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
