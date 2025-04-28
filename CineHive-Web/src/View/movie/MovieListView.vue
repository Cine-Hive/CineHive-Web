<template>
  <div class="movie-list">

    <div class="movies-section">
      <div class="search-guide">
        더 많은 영화를 검색해 보실 수 있습니다.
      </div>

      <div class="search-bar">
        <input
            v-model="searchQuery"
            @keyup.enter="searchMovies"
            placeholder="영화 제목을 입력하세요"
            class="search-input"
        />
        <button @click="searchMovies" class="search-button">검색</button>
      </div>

      <div v-if="movies.length > 0" class="movie-grid">
        <div v-for="movie in movies" :key="movie.id" class="movie-item">
          <div class="movie-card">
            <img
                v-if="movie.posterPath"
                :src="'https://image.tmdb.org/t/p/w300' + movie.posterPath"
                :alt="movie.title"
                class="movie-poster"
            />
            <p class="movie-title">{{ movie.title }}</p>
          </div>
        </div>
      </div>
    </div>


    <div class="movie-section-container">
      <div class="home-movie-title"><span style="color:red;">CINEHIVE</span>의 오늘의 영화</div>
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
  </div>
</template>


<script>
import { fetchMoviesSearch } from '@/api/movie/movieList';
import { fetchMovies, fetchTopMovies, fetchUpcomingMovies, fetchPopularMovies } from '@/api/movie/movie';

export default {
  name: 'MovieList',
  data() {
    return {
      mostNowPlayingMovsie: null,
      mostUpcomingMovie: null,
      mostTopRatedMovie: null,
      mostPopularMovie: null,
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
      searchQuery: '',
      movies: [],
      page: 1,
    };
  },
  mounted() {
    this.loadMovies();
  },
  methods: {
    async loadMovies() {
      try {
        const nowPlaying = await fetchMovies();
        const upcoming = await fetchUpcomingMovies();
        const topRated = await fetchTopMovies();
        const popular = await fetchPopularMovies();

        this.movieCategories.nowPlaying = nowPlaying;
        this.movieCategories.upcoming = upcoming;
        this.movieCategories.topRated = topRated;
        this.movieCategories.popular = popular;

        // 각 카테고리의 첫 번째 영화 = 1등 영화로 저장
        this.mostNowPlayingMovie = nowPlaying[0] || null;
        this.mostUpcomingMovie = upcoming[0] || null;
        this.mostTopRatedMovie = topRated[0] || null;
        this.mostPopularMovie = popular[0] || null;

      } catch (error) {
        console.error('영화 데이터를 가져오는 중 오류가 발생했습니다:', error);
      }
    },
    selectCategory(category) {
      this.selectedCategory = category;
    },
    goToMovieDetail(movieId, category) {
      const routeName = category === 'topRated' ? 'TopMovieDetail' : 'MovieDetail';
      this.$router.push({ name: routeName, params: { id: movieId } });
    },
    async searchMovies() {
      if (!this.searchQuery.trim()) {
        alert('검색어를 입력해주세요.');
        return;
      }
      try {
        const data = await fetchMoviesSearch(this.searchQuery, this.page);
        this.movies = data.results || [];
      } catch (error) {
        console.error('영화 검색 중 오류 발생:', error);
      }
    },
  },
};
</script>

<style scoped>
.movie-list {
  padding: 40px 20px;
  background-color: black;
  min-height: 100vh;
  color: #ffffff;
  font-family: 'Noto Sans KR', sans-serif;
  overflow-x: hidden;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes shine {
  0% {
    text-shadow: 0 0 5px #ff4b2b, 0 0 10px #ff4b2b;
  }
  100% {
    text-shadow: 0 0 10px #ff416c, 0 0 20px #ff416c;
  }
}

.movies-section {
  width: 100%;
  max-width: 1700px;
  margin: 0 auto;
  padding: 30px;
  background-color: #121212;
  color: white;
  font-family: 'Arial', sans-serif;
}

.search-guide {
  font-size: 16px;
  margin-bottom: 20px;
  color: #b3b3b3;
  text-align: center;
}


.section-header h2 {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 10px;
}

.section-header p {
  font-size: 16px;
  color: #b3b3b3;
}

/* 검색창 */
.search-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-bottom: 30px;
}

.search-input {
  padding: 10px 15px;
  width: 500px;
  border: 1px solid #444;
  border-radius: 5px;
  background-color: #1f1f1f;
  color: #fff;
  font-size: 14px;
  transition: border 0.3s ease;
}

.search-input:focus {
  border-color: #f39c12;
  outline: none;
}

.search-button {
  padding: 8.5px 15px;
  font-size: 14px;
  background: linear-gradient(135deg, #ff416c, #ff4b2b);
  color: white;
  border: none;
  border-radius: 0 8px 8px 0;
  cursor: pointer;
  transition: background 0.3s ease;
  position: relative;
  left:-20px;
}

.search-button:hover {
  background: linear-gradient(135deg, #ff4b2b, #ff416c);
}

.movie-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 20px;
  justify-items: center;
  padding: 10px;
}

.movie-card {
  background-color: #1c1c1c;
  border-radius: 15px;
  padding: 15px;
  width: 160px;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.movie-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.3);
}

/* 영화 포스터 */
.movie-poster {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 15px;
}

/* 영화 제목 */
.movie-title {
  font-size: 16px;
  font-weight: bold;
  color: #fff;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
.movie-content {
  text-align: center;
}

.home-movie-title {
  text-align: left;
  font-size: 1.5rem;
  font-weight: bold;
  color: #dddddd;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
  margin-bottom: 24px;
}

.movie-title {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 15px;
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
  background-color: #1a1a1a;
  border: none;
  color: white;
  cursor: pointer;
  border-radius: 5px;
}

.movie-modal-content button:hover {
  background-color: #555;
}

.movie-tabs {
  display: flex;
  overflow-x: auto;
  white-space: nowrap;
  padding: 10px 0;
  border-bottom: 2px solid #444;
  scrollbar-width: none;
}

.movie-tabs::-webkit-scrollbar {
  display: none;
}

.ott-container > span {
  display: block;
  text-align: center;
  font-size: 1.3em;
  font-weight: bold;
  color: #cccccc;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #eee;
}

.ott-tabs button,
.movie-tabs button {
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

.ott-tabs button.active,
.movie-tabs button.active {
  color: white;
  font-weight: bold;
}

.ott-tabs button.active::after,
.movie-tabs button.active::after {
  content: '';
  display: block;
  width: 100%;
  height: 2px;
  background: #ff4757;
  position: absolute;
  bottom: -2px;
  left: 0;
}
</style>
