<template>
  <div v-if="movie" class="movie-detail">
    <div class="movie-backdrop">
      <div class="movie-poster">
        <img v-if="movie.posterPath" :src="'https://image.tmdb.org/t/p/original' + movie.posterPath" alt="포스터" class="poster-image" />
      </div>
      <div class="movie-content">
        <div class="info-item">
          <span class="info-label">제목</span>
          <p v-if="movie.title" class="info-text">{{ movie.title }}</p>
        </div>
        <div class="movie-info">
          <div class="info-item">
            <span class="info-label">평점</span>
            <p v-if="movie.voteAverage" class="info-text">{{ movie.voteAverage }}</p>
          </div>
          <div class="info-item">
            <span class="info-label">출연진</span>
            <div v-if="movie.actors && movie.actors.length > 0" class="actors-list">
              <span v-for="actor in movie.actors.slice(0, 5)" :key="actor.id" class="actor-item">
                {{ actor.name }}
              </span>
            </div>
          </div>
          <div class="info-item">
            <span class="info-label">감독</span>
            <p class="info-text">{{ movie.director ? movie.director.name : '정보 없음' }}</p>
          </div>
          <div class="info-item">
            <span class="info-label">출시일</span>
            <p v-if="movie.releaseDate" class="info-text">{{ movie.releaseDate }}</p>
          </div>
          <div class="info-item">
            <span class="info-label">줄거리</span>
            <p class="info-text">{{ movie.overview || '설명 없음' }}</p>
          </div>
        </div>
      </div>
      <div class="trailer-section" v-if="movie.videos && movie.videos.length > 0">
        <iframe
            width="560"
            height="315"
            :src="'https://www.youtube.com/embed/' + movie.videos[0].videoKey"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            class="trailer-iframe"
        ></iframe>
      </div>
    </div>

    <div class="action-buttons">
      <button class="action-button" @click="goToReviewPage">감상평 보기</button>
      <button class="action-button" @click="viewReview">리뷰 보기</button>
      <button class="action-button" @click="addToFavorites">찜하기</button>
      <button class="action-button" @click="goBack">뒤로 가기</button>
    </div>

    <div class="bottom-section">
      <h3 class="section-title">바로가기</h3>
      <div class="streaming-services">
        <img class="streaming-logo" src="@/assets/movieDetailLogo/Wacha.png" alt="Wave" @click="goToLink('https://www.watcha.com')" />
        <img class="streaming-logo" src="@/assets/movieDetailLogo/Wiki.png" alt="Watcha" @click="goToLink('https://www.wavve.com')" />
        <img class="streaming-logo" src="@/assets/movieDetailLogo/Netfilx.png" alt="Netflix" @click="goToLink('https://www.netflix.com')" />
        <img class="streaming-logo" src="@/assets/movieDetailLogo/Tiving.png" alt="Tiving" @click="goToLink('https://www.tving.com')" />
      </div>
    </div>

    <!-- 추천 영화 섹션 추가 -->
    <div class="similar-movies-section" v-if="similarMovies.length > 0">
      <h3 class="section-title">추천 영화</h3>
      <div class="similar-movies-list">
        <div v-for="similar in similarMovies" :key="similar.id" class="similar-movie-item" @click="goToMovieDetail(similar.id)">
          <img v-if="similar.posterPath" :src="'https://image.tmdb.org/t/p/w200' + similar.posterPath" alt="추천 영화 포스터" />
          <p class="similar-movie-title">{{ similar.title }}</p>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <p>영화 정보를 불러오는 중...</p>
  </div>
</template>

<script>
import { fetchMovieDetails, fetchSimilarMovies } from '@/api/movie/topRatedMovie';

export default {
  data() {
    return {
      movie: null,
      similarMovies: []
    };
  },
  async created() {
    const movieId = this.$route.params.id;
    await this.loadMovieData(movieId);
  },
  watch: {
    '$route.params.id': 'fetchMovieDetails' // URL 매개변수 변경 시 데이터 다시 로드
  },
  methods: {
    async loadMovieData(movieId) {
      try {
        this.movie = await fetchMovieDetails(movieId);
        this.similarMovies = await fetchSimilarMovies(movieId);
      } catch (error) {
        console.error('영화 정보를 불러오는 중 오류 발생:', error);
      }
    },
    async fetchMovieDetails(movieId) {
      try {
        this.movie = await fetchMovieDetails(movieId);
      } catch (error) {
        console.error("영화 정보를 불러오는 중 오류 발생:", error);
      }
    },
    async fetchSimilarMovies(movieId) {
      try {
        this.similarMovies = await fetchSimilarMovies(movieId);
      } catch (error) {
        console.error('추천 영화를 가져오는 중 오류 발생:', error);
      }
    },
    goToMovieDetail(movieId) {
      if (this.$route.path !== `/movie/${movieId}`) {
        this.$router.push(`/movie/${movieId}`);
      }
    },
    goBack() {
      this.$router.go(-1);
    },
    goToReviewPage() {
      const userConfirmed = confirm("스포일러가 포함될 수 있습니다. 계속 하시겠습니까?");
      if (!userConfirmed) return;

      this.$router.push({
        name: 'ReviewPage',
        query: {
          id: String(this.movie.id), // 문자열 변환
          title: this.movie.title || '제목 없음', // undefined 방지
          posterPath: this.movie.posterPath || '', // 기본값 설정
          overview: this.movie.overview || '설명 없음' // undefined 방지
        }
      });
    },
    viewReview() {
      console.log('리뷰 보기 클릭됨');
    },
    addToFavorites() {
      console.log('찜하기 클릭됨');
    },
    goToLink(url) {
      window.open(url, '_blank');
    }
  }
}
</script>


<style scoped>
.movie-detail {
  color: white;
  background-color: black;
  display: flex;
  flex-direction: column;
  min-height: 1000px;
  padding: 40px 60px;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  margin-left: 40px;
  margin-top: 40px;
}

.movie-backdrop {
  display: flex;
  align-items: flex-start;
}

.movie-poster {
  margin-right: 20px;
}

.poster-image {
  max-width: 300px;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

.movie-content {
  max-width: 600px;
  text-align: left;
}

.movie-info {
  margin-top: 20px;
}

.info-item {
  margin-bottom: 15px;
}

.info-label {
  font-weight: bolder;
  margin-bottom: 10px;
  font-size: 14px;
  color: #f0f0f0;
}

.info-text {
  margin: 0;
  font-size: 16px;
  color: #ccc;
}

.action-buttons {
  margin-top: 20px;
  display: flex;
  gap: 10px;
}

.action-button {
  padding: 10px 15px;
  background-color: #1a1a1a;
  border: none;
  color: white;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.action-button:hover {
  background-color: #555;
}

.bottom-section {
  margin-top: 20px;
  position: relative;
  top: 50px;
}

.section-title {
  position: relative;
  left: -47.8%;
  top: -10px;
  margin-bottom: 10px;
  font-size: 18px;
  color: #f0f0f0;
}

.streaming-services {
  display: flex;
  gap: 20px;
}

.streaming-logo {
  width: 75px;
  height: 70px;
  border-radius: 8px;
  transition: transform 0.3s;
}

.streaming-logo:hover {
  transform: scale(1.1);
}

.actors-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 10px;
}

.actor-item {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  padding: 5px 10px;
  color: white;
  transition: background-color 0.3s;
}

.actor-item:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

.trailer-section {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-top: 20px;
  position: relative;
  left: 10%;
  top: -40px;
}

.trailer-iframe {
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

.similar-movies-section {
  margin-top: 100px;
  border-radius: 10px;
}

.similar-movies-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 15px;
  justify-items: center;
}

.similar-movie-item {
  background-color: #222;
  border-radius: 12px;
  padding: 10px;
  text-align: center;
  box-shadow: 0 4px 10px rgba(255, 255, 255, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.similar-movie-item:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 15px rgba(255, 255, 255, 0.2);
}

.similar-movie-item img {
  width: 100%;
  max-height: 200px;
  object-fit: cover;
  border-radius: 8px;
}

.similar-movie-title {
  margin-top: 8px;
  font-size: 14px;
  color: #ddd;
  font-weight: bold;
}

</style>
