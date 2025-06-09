<template>
  <div id="add-info">
    <div id="additional-info-container" class="container">
      <h1 class="signup-title">CINEHIVE</h1>

      <div class="step-progress">
        <div class="progress-text">{{ step }}/3</div>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: (step * 33.3) + '%' }"></div>
        </div>
        <div class="step-message">
          <span v-if="step === 2">거의 다 기입하셨어요!</span>
          <span v-if="step === 3">마지막 단계입니다!</span>
        </div>
      </div>

      <form @submit.prevent="submitAdditionalInfo" class="form">

        <!-- STEP 1 -->
        <transition name="fade">
          <div v-if="step === 1" class="form-group-signup">
            <label class="step-label">성별을 입력하세요</label>
            <select id="gender" class="input-field" v-model="memSex">
              <option value="" disabled>성별 선택</option>
              <option value="male">남성</option>
              <option value="female">여성</option>
              <option value="other">기타</option>
            </select>
            <div class="gender-content">* 귀하의 성별을 입력해 주세요.<span style="font-size: 12px; color: red; position: relative; left:10px;">(선택사항)</span></div>
          </div>
        </transition>

        <!-- STEP 2 -->
        <transition name="fade">
          <div v-if="step === 2" class="form-group-signup">
            <label class="step-label">이름을 입력하세요</label>
            <input type="text" id="name" class="input-field" placeholder="이름" v-model="memName" />
            <div class="name-content">* 귀하의 이름을 입력해 주세요. .<span style="font-size: 12px; color: red; position: relative; left:10px;">(선택사항)</span></div>
          </div>
        </transition>

        <!-- STEP 3 -->
        <transition name="fade">
          <div v-if="step === 3" class="form-group-signup">
            <label class="step-label">선호하는 장르를 선택하세요</label>
            <div class="genre-text-container">
              <div
                  v-for="genre in genres"
                  :key="genre"
                  class="genre-text-item"
                  :class="{ selected: selectedGenres.includes(genre) }"
                  @click="toggleGenre(genre)"
              >
                {{ genre }}
              </div>
            </div>
            <div class="name-content">* 선호하는 장르를 선택하시면, 추천받으실 수 있습니다. <span style="color: red; font-size: 12px; position: relative; left:10px;">중복 가능</span></div>
          </div>
        </transition>


        <!-- 버튼 -->
        <div class="button-group">
          <button v-if="step > 1" type="button" class="submit-btn" @click="step--">이전</button>
          <button v-if="step < 3" type="button" class="submit-btn" @click="goToNextStep">다음</button>
          <button v-if="step === 3" type="submit" :disabled="!userInfo" class="submit-btn">회원가입</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { getUserInfo, registerUser } from '@/api/user/userAddInfo';

export default {
  data() {
    return {
      step: 1,
      memName: '',
      memSex: '',
      userInfo: null,
      selectedGenres: [],
      loginType: '',
      genres: ['TV', '애니메이션', '영화']
    };
  },
  created() {
    this.loginType = this.$route.query.loginType;
    this.loadUserInfo();
  },
  methods: {
    async loadUserInfo() {
      try {
        this.userInfo = await getUserInfo(this.loginType);
        this.$store.commit('SET_LOGIN', {
          isLoggedIn: true,
          user: this.userInfo
        });
      } catch (error) {
        alert('로그인 실패. 다시 시도해 주세요.');
      }
    },

    goToNextStep() {
      this.step++;
    },

    async submitAdditionalInfo() {
      if (!this.selectedGenres.length) {
        alert('최소 하나의 장르를 선택해 주세요.');
        return;
      }

      try {
        const userData = {
          memNickname: this.userInfo.memNickname,
          memEmail: this.userInfo.memEmail,
          memName: this.memName,
          memSex: this.memSex,
          genres: this.selectedGenres,
          memPassword: '0'
        };

        const response = await registerUser(this.loginType, userData);
        this.$store.commit('SET_USER', response.user);

        alert('회원가입에 성공하셨습니다. 다시 로그인해주세요.');
        this.$router.push('/auth');
      } catch (error) {
        alert('정보 제출 중 오류가 발생했습니다. 다시 시도해 주세요.');
      }
    },

    toggleGenre(genre) {
      const index = this.selectedGenres.indexOf(genre);
      if (index === -1) {
        this.selectedGenres.push(genre);
      } else {
        this.selectedGenres.splice(index, 1);
      }
    }
  }
};
</script>

<style scoped>
/* 전체 배경 */
#add-info {
  background-color: #111;
  display: flex;
  height: 100vh;
  justify-content: center;
  align-items: center;
}

.form-group-signup{
  position: relative;
  top:-150px;
}

.step-label{
  color: #cccccc;
  font-size: 14px;
}

.signup-title {
  text-align: center;
  color: #e50914;
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 20px;
  position: relative;
  top:-250px;
}

.step-progress {
  text-align: center;
  margin-bottom: 30px;
  position: relative;
  top:-200px;
}

.progress-text {
  font-size: 18px;
  color: #fff;
  margin-bottom: 8px;
}

.progress-bar {
  width: 80%;
  height: 8px;
  background-color: #555;
  border-radius: 4px;
  margin: 0 auto;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #e50914, #f5c518);
  width: 0%;
  transition: width 0.5s ease-in-out;
}

.step-message {
  color: #f5c518;
  font-size: 14px;
  margin-top: 6px;
}
.gender-content{
  position: relative;
  top:100px;
  color: #cccccc;
  font-size: 14px;
}

.name-content{
  position: relative;
  top:100px;
  color: #cccccc;
  font-size: 14px;
}

.form {
  display: flex;
  flex-direction: column;
}

.input-field {
  width: 110%;
  padding: 12px;
  border: none;
  border-radius: 6px;
  background-color: #333;
  color: #fff;
  margin-top: 10px;
  font-size: 14px;
  position: relative;
  left:-3%;
  top:20px;
}

.input-field:focus {
  outline: 2px solid #e50914;
}


.button-group {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}

.submit-btn {
  background: linear-gradient(to right, #e50914, #b81d24);
  color: white;
  font-weight: bold;
  font-size: 14px;
  border: none;
  border-radius: 6px;
  padding: 12px 20px;
  margin: 20px auto 0;
  width: 140px;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.submit-btn:hover {
  background-color: #ff3d00;
  transform: scale(1.05);
  cursor: pointer;
}

.genre-text-container {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 30px;
  margin-top: 30px;
}

.genre-text-item {
  padding: 12px 20px;
  background-color: #333;
  color: #ccc;
  border-radius: 15px;
  border: 2px solid transparent;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.genre-text-item:hover {
  background-color: #444;
  color: #fff;
  transform: scale(1.05);
}

.genre-text-item.selected {
  background: linear-gradient(to right, #e50914, #f5c518);
  color: #fff;
  font-weight: bold;
  border-color: #f5c518;
}

</style>