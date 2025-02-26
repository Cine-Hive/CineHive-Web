<template>
  <header>
    <div class="header-container">
      <router-link to="/" class="site-title">
        <span @click="goToHome">CINEHIVE</span>
      </router-link>

      <nav class="nav">
        <ul style="cursor: pointer">
          <li @click="goToAnimationsList" >Animation</li>
          <li @click="goToMoviesList" >Movie</li>
          <li @click="goToDramasList">Drama</li>
          <li @click="goToBoardList" >Community</li>
          <li >My List</li>
          <li >Watched List</li>
        </ul>
      </nav>


      <SearchBar class="search-bar-info" ></SearchBar>

      <div class="login-area">
        <template v-if="isLoggedIn">
          <span @click="logout" class="logout-link">Logout</span>
          <router-link to="/mypage" class="nav-link">My Page</router-link>
        </template>
        <template v-else>
          <router-link to="/auth" class="login-link">Login</router-link>
          <router-link to="/auth" class="signup-link">회원이 아니신가요?</router-link>
        </template>
      </div>
    </div>

  </header>
</template>
<script>
import axios from 'axios';
import { mapState } from 'vuex';
import SearchBar from "@/components/SearchBar.vue";

export default {
  name: 'HeaderComponent',
  components: { SearchBar },
  data() {
    return {
      searchQuery: "",
      userInfo: null
    };
  },
  computed: {
    ...mapState(['isLoggedIn', 'user']),
  },
  methods: {
    async getUserInfo(loginType) {
      try {
        const response = await axios.get(`http://localhost:8081/api/auth/${loginType}/success`, {
          withCredentials: true
        });

        const userData = response.data;
        this.userInfo = userData;

        console.log(`${loginType} 로그인 사용자 데이터:`, userData);

        const finalLoginType = userData.mem_type || loginType;

        this.$store.commit('SET_LOGIN', {
          isLoggedIn: true,
          user: {
            email: userData.memEmail,
            nickname: userData.memNickname,
            name: userData.memName || '',
            preferredGenres: userData.genres || []
          },
          loginType: finalLoginType
        });

        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('user', JSON.stringify({
          email: userData.memEmail || '',
          nickname: userData.memNickname,
          name: userData.memName || '',
          preferredGenres: userData.genres || [],
          mem_type: userData.mem_type
        }));
        localStorage.setItem('loginType', finalLoginType);
      } catch (error) {
        console.error(`${loginType} 사용자 정보 가져오기 실패:`, error);
      }
    },
    logout() {
      this.$store.commit('SET_LOGOUT');

      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('user');
      localStorage.removeItem('loginType');

      axios.get('http://localhost:8081/api/auth/logout', { withCredentials: true })
          .then(() => {
            console.log("로그아웃 성공");
            window.location.reload();
          })
          .catch(error => {
            console.error("로그아웃 오류:", error);
          });
    },
    goToMoviesList(){
      if(this.$route.path!=='/movies')
        this.$router.push({ path: '/movies' });
    },
    goToAnimationsList(){
      if(this.$route.path!=='/animations')
        this.$router.push({ path: '/animations' });
    },
    goToDramasList(){
      if(this.$route.path!=='/dramas')
        this.$router.push({ path: '/dramas' });
    },
    goToBoardList(){
      if(this.$route.path!=='/boards')
        this.$router.push({ path: '/boards' });
    },
    goToHome() {
      if (this.$route.path !== '/') {
        this.$router.push('/');
      }
    },
  },
  created() {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const loginType = localStorage.getItem('loginType');

    if (storedUser) {
      this.$store.commit('SET_LOGIN', {
        isLoggedIn: true,
        user: storedUser,
        loginType
      });
    } else if (loginType) {
      this.getUserInfo(loginType);
    }
  }

};
</script>


<style scoped>


.site-title {
  text-decoration: none;
  color: inherit; 
}

header {
  background-color: black;
  padding: 20px;
  text-align: center;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

.site-title {
  flex: 1;
  color: #F50000;
  font-size: 22px;
  margin-left: 10px;
  position: absolute;
}

.nav ul {
  list-style: none;
  display: flex;
  gap: 20px;
  margin: 0;
  padding: 0;
  color: white;
  font-size: 14px;
  margin-left: 230px;
}


.login-area {
  display: flex;
  align-items: center;
  gap: 15px;
}

.login-link,
.logout-link,
.nav-link {
  color: white;
  text-decoration: none;
  cursor: pointer;
}

.login-link:hover,
.logout-link:hover,
.nav-link:hover {
  color: #F50000;
}

.search-bar-info{
  position: relative;
  top:0px;
  left: 10px;
}
@media (max-width: 768px) {
  .header-container {
    flex-direction: column;
    align-items: flex-start;
    padding: 10px;
  }

  .site-title {
    font-size: 18px;
    margin: 10px 0;
  }

  .nav ul {
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
    margin: 10px 0;
  }

  .login-area {
    width: 100%;
    justify-content: flex-start;
  }
}

@media (max-width: 480px) {
  .header-container {
    text-align: center;
  }

  .site-title {
    font-size: 16px;
    margin-bottom: 10px;
  }

  .nav ul {
    display: none;
    cursor: pointer;
  }

  .login-area {
    flex-direction: column;
    align-items: center;
    gap: 5px;
    position: relative;
  }
}

.signup-link{
  text-decoration: none;
  color: white;
  position: relative;
  top:0.5px;
  font-size: 14.5px;
}
.signup-link:hover{
  color: red;
}
</style>
