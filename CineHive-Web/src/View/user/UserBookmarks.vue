<template>
  <div class="user-bookmarks">
    <h1>찜한 영화 목록</h1>

    <div v-if="loading">로딩 중...</div>

    <div v-else-if="bookmarks.length === 0">
      찜한 영화가 없습니다.
    </div>

    <div v-else class="bookmark-list">
      <div
          v-for="movie in bookmarks"
          :key="movie.id"
          class="bookmark-card"
          @click="goToMovieDetail(movie.id)"
      >
        <img :src="'https://image.tmdb.org/t/p/w300' + movie.posterPath" alt="포스터" class="poster"/>
        <div class="movie-info">
          <h3>{{ movie.title }}</h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'UserBookmarks',
  data() {
    return {
      bookmarks: [],
      loading: true,
    }
  },
  methods: {
    goToMovieDetail(movieId) {
      this.$router.push(`/movie/${movieId}`)
    },
    async fetchBookmarks() {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('로그인이 필요합니다.');
        return;
      }

      try {
        const response = await axios.get('http://localhost:8081/myPage/bookmarks', {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        this.bookmarks = response.data;
      } catch (error) {
        console.error('찜한 영화 가져오기 실패:', error);
      } finally {
        this.loading = false;
      }
    }
  },
  mounted() {
    this.fetchBookmarks();
  }
}
</script>

<style scoped>
.user-bookmarks {
  padding: 20px;
  background-color: black;
  color: white;
  min-height: 950px;
  text-align: center;
}

.bookmark-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 30px;
  margin-top: 20px;
}

.bookmark-card {
  cursor: pointer;
  width: 220px;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
  background-color: #1e1e1e;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.6);
}

.bookmark-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.8);
}

.poster {
  width: 100%;
  height: 320px;
  object-fit: cover;
  border-bottom: 2px solid #F50000;
}

.movie-info {
  padding: 15px;
}
</style>
