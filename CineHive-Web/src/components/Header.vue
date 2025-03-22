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
        const response = await axios.get(`http://localhost:8081/api/auth/${loginType}/login/success`, {
          withCredentials: true
        });

        console.log("응답 데이터:", response.data);

        const token = response.data.token;
        const userInfo = response.data.userInfo;

        if (!token) {
          console.error("토큰이 없습니다.");
          return;
        }
        if (!userInfo) {
          console.error("사용자 정보가 없습니다.");
          return;
        }

        localStorage.setItem('token', token);

        this.$store.commit('SET_LOGIN', {
          isLoggedIn: true,
          user: {
            email: userInfo.memEmail,
            nickname: userInfo.memNickname,
            name: userInfo.memName || '',
            preferredGenres: userInfo.genres || []
          },
          loginType: userInfo.mem_type || loginType,
          token: token
        });

        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('user', JSON.stringify({
          email: userInfo.memEmail || '',
          nickname: userInfo.memNickname,
          name: userInfo.memName || '',
          preferredGenres: userInfo.genres || [],
          mem_type: userInfo.mem_type
        }));
        localStorage.setItem('loginType', userInfo.mem_type || loginType);
      } catch (error) {
        console.error(`${loginType} 사용자 정보 가져오기 실패:`, error);
      }
    },
    logout() {
      this.$store.commit('SET_LOGOUT');

      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('user');
      localStorage.removeItem('loginType');
      localStorage.removeItem('token');
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
    const token = localStorage.getItem('token');

    if (storedUser) {
      this.$store.commit('SET_LOGIN', {
        isLoggedIn: true,
        user: storedUser,
        loginType,
        token
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