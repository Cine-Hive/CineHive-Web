<template>
  <div id="homepage">
    <div class="main-image">
      <img src="@/assets/home/HomeImageSecond.jpg">
      <img src="@/assets/home/HomeImage.jpg">
      <img src="@/assets/home/HomeImageThird.jpg">
      <div class="main-text">
        <p>다양한 이야기들이 한자리에,</p>
        <p>이곳에서 진정한 감동과 재미를 느끼고,</p>
        <p>잊지 못할 순간들을 경험해보세요.</p>
      </div>
    </div>


    <svg class="curved-divider" viewBox="0 0 1440 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M0,100 Q720,0 1440,100" stroke="white" stroke-width="1" fill="black"/>
    </svg>

    <div class="movie-section-container">
      <div class="movie-tabs">
        <button v-for="(movies, category) in movieCategories" :key="category"
                :class="{ active: selectedCategory === category }"
                @click="selectCategory(category)">
          {{ categoryNames[category] }}
        </button>
      </div>

      <div class="movie-content" v-if="selectedCategory">
        <div class="top-slider">
          <div class="movie-card" v-for="movie in movieCategories[selectedCategory]" :key="movie.id"
               @click="goToMovieDetail(movie.id, selectedCategory)">
            <img :src="'https://image.tmdb.org/t/p/w300' + movie.posterPath" alt="movie poster" />
          </div>
        </div>
      </div>
    </div>

    <div class="ott-container">

      <div class="ott-tabs">
        <button v-for="(movies, platform) in ottMovies" :key="platform"
                :class="{ active: selectedPlatform === platform }"
                @click="selectPlatform(platform)">
          {{ platformNames[platform] }}
        </button>
      </div>

      <div class="ott-content" v-if="selectedPlatform">
        <div class="movie-list">
          <div class="movie-item" v-for="movie in ottMovies[selectedPlatform]" :key="movie.id">
            <img :src="'https://image.tmdb.org/t/p/w154' + movie.posterPath" alt="movie poster" class="movie-poster"/>
            <div class="movie-info">
    <span class="movie-title">
      <span class="fire-icon">🔥</span> {{ movie.title }}
    </span>
              <span class="movie-release">{{ movie.releaseDate }}</span>
              <span class="movie-overview">{{ movie.overview.length > 100 ? movie.overview.substring(0, 100) + '...' : movie.overview }}</span>
            </div>
          </div>


        </div>
      </div>

    </div>

    <section class="prefer-genre">
      <h2 class="section-title">
        선호 장르
        <span class="more-info" @click="toggleShowMore" v-if="!showSearchButton">
        <span class="plus-sign">{{ showMore ? '−' : '+' }}</span>
        <span class="more-text">{{ showMore ? '접기' : '더 보기' }}</span>
      </span>
      </h2>

      <SearchBar v-if="showSearchButton" @click="searchMovies" class="search-bar"></SearchBar>

      <div v-if="!user" class="login-prompt-container">
        <p class="login-prompt bounce-text">로그인을 하시면 선호하는 장르를 추천해드립니다.</p>
        <button class="login-button" @click="goToLogin">로그인</button>
      </div>


      <div v-else>
        <div class="prefer-slide">
          <div class="movie-card" v-for="content in prefer" :key="`prefer-${content.id}`" @click="goToContentDetail(content.id)">
            <img :src="'https://image.tmdb.org/t/p/w300' + content.posterPath" alt="movie poster" />
          </div>
        </div>

        <transition name="fade">
          <div v-if="showMore" class="prefer-slide">
            <div class="movie-card" v-for="content in prefer.slice(18)" :key="`prefer-more-${content.id}`" @click="goToMovieDetail(content.id)">
              <img :src="'https://image.tmdb.org/t/p/w300' + content.posterPath" alt="movie poster"/>
            </div>
          </div>
        </transition>
      </div>
    </section>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { fetchOttMovies } from '@/api/ott/ott';
import {
  fetchMovies,
  fetchTopMovies,
  fetchUpcomingMovies,
  fetchPopularMovies,
  fetchPreferredGenres,
  searchMovies
} from '@/api/movie/movie';

import SearchBar from "@/components/SearchBar.vue";

export default {
  components: { SearchBar },
  data() {
    return {
      movieCategories: {
        nowPlaying: [],
        upcoming: [],
        topRated: [],
        popular: []
      },
      selectedCategory: 'nowPlaying',
      categoryNames: {
        nowPlaying: '상영중인 영화',
        upcoming: '개봉 예정 영화',
        topRated: '역대 평점 영화',
        popular: '인기 영화'
      },
      prefer: [],
      showMore: false,
      showSearchButton: false,
      searchQuery: '',
      loading: false,
      ottMovies: {
        netflix: [],
        disney: [],
        watcha: [],
        tving: [],
        wavve: []
      },
      selectedPlatform: 'netflix',
      platformNames: {
        netflix: 'Netflix',
        disney: 'Disney+',
        watcha: 'Watcha',
        tving: 'Tving',
        wavve: 'Wavve'
      }
    };
  },

  computed: {
    ...mapState(['user']),
  },

  methods: {
    async loadMovies() {
      try {
        this.movieCategories.nowPlaying = await fetchMovies();
        this.movieCategories.upcoming = await fetchUpcomingMovies();
        this.movieCategories.topRated = await fetchTopMovies();
        this.movieCategories.popular = await fetchPopularMovies();
      } catch (error) {
        console.error('영화 데이터를 가져오는 중 오류가 발생했습니다:', error);
      }
    },
    async loadOttMovies() {
      this.ottMovies.netflix = await fetchOttMovies(8);
      this.ottMovies.disney = await fetchOttMovies(337);
      this.ottMovies.watcha = await fetchOttMovies(97);
      this.ottMovies.tving = await fetchOttMovies(356);
      this.ottMovies.wavve = await fetchOttMovies(356);
    },
    selectPlatform(platform) {
      this.selectedPlatform = platform;
    },
    async fetchPreferredGenres() {
      try {
        if (this.user && this.user.preferredGenres) {
          this.prefer = await fetchPreferredGenres(this.user.preferredGenres);
        }
      } catch (error) {
        console.error('선호 장르 데이터를 가져오는 중 오류가 발생했습니다:', error);
      }
    },

    async searchMovies() {
      if (!this.searchQuery.trim()) {
        alert("검색어를 입력하세요!");
        return;
      }
      this.loading = true;

      try {
        const results = await searchMovies(this.searchQuery);
        this.updateSearchResults(results);
        this.$router.push({
          path: '/search',
          query: { q: this.searchQuery }
        });
      } catch (error) {
        console.error("검색 중 오류가 발생했습니다:", error);
      } finally {
        this.loading = false;
      }
    },

    toggleShowMore() {
      this.showMore = !this.showMore;
      if (!this.showSearchButton) {
        this.showSearchButton = true;
      }
    },

    goToContentDetail(movieId) {
      const selectedContent = this.prefer.find(content => content.id === movieId);
      if (selectedContent) {
        switch (selectedContent.genre) {
          case '드라마':
            this.$router.push({ name: 'DramaDetail', params: { id: movieId } });
            break;
          case '애니메이션':
            this.$router.push({ name: 'AnimationDetail', params: { id: movieId } });
            break;
          case '영화':
            this.$router.push({ name: 'MovieDetail', params: { id: movieId } });
            break;
          default:
            console.error('알 수 없는 장르입니다.');
        }
      }
    },

    goToLogin() {
      this.$router.push('/auth');
    },
    selectCategory(category) {
      this.selectedCategory = category;
    },
    goToMovieDetail(movieId, category) {
      const routeName = category === 'topRated' ? 'TopMovieDetail' : 'MovieDetail';
      this.$router.push({ name: routeName, params: { id: movieId } });
    },
  },

  watch: {
    user(newUser) {
      if (newUser && newUser.preferredGenres && newUser.preferredGenres.length > 0) {
        this.fetchPreferredGenres();
      }
    }
  },
  mounted() {
    this.loadOttMovies();
    this.loadMovies();
    if (this.user && this.user.preferredGenres && this.user.preferredGenres.length > 0) {
      this.fetchPreferredGenres();
    } else {
      console.log('선호 장르가 없거나 user 데이터가 없음');
    }
  }
};
</script>

<style scoped>

#homepage {
  height: 1200px;
  flex: 1;
  background-color : black;
  color: white;
  overflow-x: hidden;
  overflow-y: hidden;
}

.main-image {
  position: relative;
  top: 100px;
  margin-bottom: 150px;
}
.main-image img {
  opacity: 0.3;
}
.main-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: white;
  font-size: 28px;
  font-weight: bolder;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  line-height: 2.2;
  white-space: pre-wrap;
  opacity: 0;
  transform: translate(-50%, -60%);
  animation: fadeInMove 2s ease-out forwards;
}

.curved-divider {
  width: 100%;
  height: auto;
  display: block;
  position: relative;
  top: -170px;
}

@keyframes fadeInMove {
  0% {
    opacity: 0;
    transform: translate(-50%, -60%);
  }
  100% {
    opacity: 1;
    transform: translate(-50%, -50%);
  }
}

@keyframes bounce {
  0% {
    transform: translateY(20px);
  }
  50% {
    transform: translateY(-10px);
    opacity: 1;
  }
  100% {
    transform: translateY(0);
  }
}

.main-text p {
  animation: fadeIn 0.5s forwards;
  opacity: 0;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.bounce-text {
  display: inline-block;
  animation: bounce 2s infinite;
  transition: transform 0.3s ease-in-out;
}

@keyframes bounce {
  0%, 100% {
    transform: scale(1) translateY(0);
  }

  50% {
    transform: scale(1.05) translateY(-10px);
  }
}

.main-text p:nth-child(1) { animation-delay: 0.1s; }
.main-text p:nth-child(2) { animation-delay: 0.3s; }
.main-text p:nth-child(3) { animation-delay: 0.5s; }

h1 {
  color: red;
  text-align: center;
}

.movie-section-container {
  margin-top: 40px;
  background-color: black;
  padding: 20px;
  border-radius: 10px;
  color: white;
  width: 95%;
  margin: auto;
}
.movie-tabs {
  justify-content: left;
  gap: 10px;
  margin-bottom: 20px;
}

.movie-tabs button {
  background-color: #333;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: 0.3s;
  text-align: left;
}

.movie-content {
  text-align: center;
}

.movie-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
}

.top-slider {
  display: flex;
  overflow-x: auto;
  gap: 15px;
  padding-bottom: 10px;
  justify-content: center;
}

.movie-card {
  flex: 0 0 auto;
  width: 150px;
  cursor: pointer;
  transition: transform 0.3s ease-in-out;
}

.movie-card:hover {
  transform: scale(1.1);
}
.top-slider {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-bottom: 100px;
}

.movie-card {
  flex: 0 0 auto;
  width: 180px;
  cursor: pointer;
  transition: transform 0.3s ease-in-out;
}

.movie-card img {
  width: 100%;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(255, 255, 255, 0.2);
}

.movie-card:hover {
  transform: scale(1.1);
}
.movie-poster img {
  width: 200px;
  height: 300px;
  cursor: pointer;
  transition: transform 0.3s;
}

.movie-poster img:hover {
  transform: scale(1.1);
}

.movie-modal-content button {
  margin-top: 20px;
  padding: 10px;
  background-color : #1a1a1a;
  border: none;
  color: white;
  cursor: pointer;
  border-radius: 5px;
}

.movie-modal-content button:hover {
  background-color: #555;
}

.search-bar input {
  width: 80%;
  max-width: 600px;
  padding: 10px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
}

.search-bar input:focus {
  outline: none;
  box-shadow: 0 0 5px rgba(255, 0, 0, 0.8);
}

@keyframes fadeInContainer {
  0% {
    opacity: 0;
    transform: scale(0.95);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}


@keyframes fadeInText {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounceText {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0);
  }
}

.prefer-genre {
  width: 100%;
  max-width: 1750px;
  margin: 40px auto;
  padding: 20px;
}

.section-title {
  font-size: 20px;
  font-weight: bold;
  color: #bbb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 2px solid #ddd;
}

.more-info {
  font-size: 16px;
  color: #007bff;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: transform 0.3s ease;
}

.plus-sign {
  font-size: 20px;
  font-weight: bold;
  margin-right: 5px;
  transition: transform 0.3s ease;
}

.more-info:hover .plus-sign {
  transform: scale(1.2);
}

.login-prompt-container {
  text-align: center;
  background: black;
  padding: 20px;
  border-radius: 10px;
  margin: 20px auto;
  width: 60%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  color: #bbb;
}

.login-prompt {
  font-size: 16px;
  color: #bbb;
  margin-bottom: 10px;
}

.login-button {
  background: rebeccapurple;
  color: #bbb;
  padding: 12px 22px;
  font-size: 13px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease;
  position: relative;
  top:50px;
  left:-220px;
}

.login-button:hover {
  background: purple;
}
.prefer-slide {
  display: flex;
  overflow-x: auto;
  padding: 10px 0;
  gap: 15px;
  scrollbar-width: thin;
  scrollbar-color: #888 #f1f1f1;
}


.prefer-slide::-webkit-scrollbar {
  height: 8px;
}

.prefer-slide::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.prefer-slide::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

.prefer-slide::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.movie-card {
  flex: 0 0 auto;
  width: 150px;
  border-radius: 10px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.movie-card img {
  width: 100%;
  border-radius: 10px;
}

.movie-card:hover {
  transform: scale(1.1);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

@media (max-width: 768px) {
  .login-prompt-container {
    width: 80%;
  }

  .movie-card {
    width: 120px;
  }

  .section-title {
    font-size: 20px;
  }
}



.movie-card {
  flex: 0 0 calc(11.1% - 15px);
  max-width: calc(11.1% - 15px);
}


.more-text {
  background-color: transparent;
  border: 2px solid darkslateblue;;
  color: darkslateblue;;
  font-size: 15px;
  padding: 5px 15px;
  border-radius: 25px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
  animation: bounce 1s infinite;
}

.more-text:hover {
  background-color: #1E1E1E;
  color: white;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-5px);
  }
  60% {
    transform: translateY(-3px);
  }
}
.ott-container {
  margin-top: 40px;
  background-color: black;
  padding: 20px;
  border-radius: 12px;
  color: white;
  margin: auto;
  width: 60%;
}

.ott-tabs, .movie-tabs {
  display: flex;
  overflow-x: auto;
  white-space: nowrap;
  padding: 10px 0;
  border-bottom: 2px solid #444;
  scrollbar-width: none;
}

.ott-tabs::-webkit-scrollbar, .movie-tabs::-webkit-scrollbar {
  display: none;
}

.ott-tabs button, .movie-tabs button {
  background: none;
  color: #bbb;
  font-size: 16px;
  padding: 8px 15px;
  margin-right: 10px;
  border: none;
  cursor: pointer;
  transition: color 0.3s, font-weight 0.3s;
  position: relative;
}

.ott-tabs button.active, .movie-tabs button.active {
  color: white;
  font-weight: bold;
}

.ott-tabs button.active::after, .movie-tabs button.active::after {
  content: '';
  display: block;
  width: 100%;
  height: 2px;
  background: #ff4757;
  position: absolute;
  bottom: -2px;
  left: 0;
}

.ott-content, .movie-content {
  text-align: center;
  padding-top: 10px;
}

.movie-title {
  font-size: 15px;
  font-weight: bold;
  margin-bottom: 15px;
  text-align: left;
  color: purple;
}

.top-slider {
  display: flex;
  overflow-x: auto;
  gap: 10px;
  padding-bottom: 10px;
  scrollbar-width: thin;
  scrollbar-color: #666 #222;
}

.top-slider::-webkit-scrollbar {
  height: 5px;
}

.top-slider::-webkit-scrollbar-thumb {
  background: #666;
  border-radius: 10px;
}


.movie-card:hover {
  transform: scale(1.1);
}

.movie-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 10px;
  max-height: 500px;
  overflow-y: auto;
  overflow-x: hidden;
}
.movie-item {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  padding: 12px;
  border-radius: 8px;
  transition: background 0.3s ease, transform 0.3s ease;
  cursor: pointer;
  text-align: left;
  gap: 15px;
}

.movie-item:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: scale(1.02);
}
.movie-item:hover .movie-poster {
  transform: scale(1.05);
}

.movie-poster {
  width: 80px;
  height: 100px;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(255, 255, 255, 0.2);
  flex-shrink: 0;
}

.movie-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
  flex-grow: 1;
}
.movie-title {
  font-size: 16px;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 5px;
}

.fire-icon {
  font-size: 20px;
  color: #ff4500;
  animation: flicker 1s infinite alternate;
}

@keyframes flicker {
  0% { opacity: 1; transform: scale(1); }
  100% { opacity: 0.7; transform: scale(1.1); }
}

.movie-release {
  font-size: 14px;
  color: #bbb;
}

.movie-overview {
  font-size: 13px;
  color: #ddd;
  line-height: 1.4;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

</style>