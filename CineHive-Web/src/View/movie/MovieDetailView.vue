<template>
  <div v-if="movie" class="movie-detail">
    <div class="movie-backdrop">
      <div class="movie-poster">
        <img v-if="movie.posterPath" :src="'https://image.tmdb.org/t/p/original' + movie.posterPath" alt="포스터" class="poster-image" />
        <div v-else class="poster-placeholder">포스터 없음</div>
      </div>
      <div class="movie-content">
        <div class="info-item">
          <span class="info-label">제목</span>
          <p v-if="movie.title" class="info-text">{{ movie.title }}</p>
          <p v-else class="info-text">제목 정보 없음</p>
        </div>
        <div class="movie-info">
          <div class="info-item">
            <span class="info-label">평점</span>
            <p v-if="movie.voteAverage != null" class="info-text">{{ movie.voteAverage.toFixed(1) }}</p>
            <p v-else class="info-text">평점 정보 없음</p>
          </div>

          <div class="info-item" v-if="movie.mediaType === 'movie'">
            <span class="info-label">감독</span>
            <p class="info-text">{{ director ? director.name : '정보 없음' }}</p>
          </div>
          <div class="info-item" v-else-if="movie.mediaType === 'tv' || movie.mediaType === 'animation'">
            <span class="info-label">총 에피소드 수</span>
            <p class="info-text">{{ movie.numberOfEpisodes != null ? movie.numberOfEpisodes : '정보 없음' }}</p>
          </div>

          <div class="info-item">
            <span class="info-label">출시일</span>
            <p v-if="movie.mediaType === 'movie' && movie.releaseDate" class="info-text">{{ movie.releaseDate }}</p>
            <p v-else-if="(movie.mediaType === 'tv' || movie.mediaType === 'animation') && movie.firstAirDate" class="info-text">{{ movie.firstAirDate }} (첫 방영)</p>
            <p v-else class="info-text">출시일 정보 없음</p>
          </div>

          <div class="info-item" v-if="movie.genres && movie.genres.length > 0">
            <span class="info-label">장르</span>
            <p class="info-text">{{ movie.genres.map(genre => genre.name).join(', ') }}</p>
          </div>
          <div class="info-item" v-else>
            <span class="info-label">장르</span>
            <p class="info-text">장르 정보 없음</p>
          </div>

          <div class="info-item">
            <span class="info-label">줄거리</span>
            <p class="info-text">{{ movie.overview || '줄거리 정보 없음' }}</p>
          </div>

          <div class="info-item" v-if="movie.mediaType === 'movie' && movie.runtime">
            <span class="info-label">상영 시간</span>
            <p class="info-text">{{ movie.runtime }}분</p>
          </div>
          <div class="info-item" v-else-if="(movie.mediaType === 'tv' || movie.mediaType === 'animation') && movie.numberOfSeasons != null">
            <span class="info-label">총 시즌 수</span>
            <p class="info-text">{{ movie.numberOfSeasons }}</p>
          </div>

        </div>
      </div>

      <div v-if="videoUrl" class="movie-trailer">
        <iframe :src="videoUrl" width="560" height="315" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      </div>
    </div>

    <div v-if="movie" class="bookmark-container">
      <img src="@/assets/reviewLogo/like.png" height="20" width="20" class="movie-detail-bookmark" @click="toggleBookmark(movie.id)" alt="북마크" />
      <span style="position: relative; left:0.3%;">{{bookmarkCount != null ? bookmarkCount : '0'}}</span>
    </div>

    <div class="action-buttons">
      <button class="action-button" @click="goToReviewPage" :disabled="!movie">감상평 보기</button>
      <button class="action-button" @click="goBack">뒤로 가기</button>
    </div>

    <div class="info-item" v-if="actors && actors.length > 0">
      <span class="info-label" style="position: relative; left:-48%; top:20px; font-size: 16.5px; font-weight: bolder">배우 정보</span>
      <div class="actors-list">
        <div v-for="actor in actors.slice(0, 5)" :key="actor.id" class="actor-item">
          <img
              v-if="actor.profilePath"
              :src="'https://image.tmdb.org/t/p/w200' + actor.profilePath"
              alt="배우 프로필"
              class="actor-image"
          />
          <div v-else class="actor-image-placeholder"></div>
          <span class="actor-name">{{ actor.name }}</span>
        </div>
      </div>
    </div>
    <div class="info-item" v-else>
      <span class="info-label" style="position: relative; left:-48%; top:20px; font-size: 16.5px; font-weight: bolder">배우 정보</span>
      <p style="margin-top: 30px;">배우 정보 없음</p>
    </div>

    <div class="bottom-section">
      <h3 class="section-title">바로가기</h3>
      <div class="streaming-services">
        <img class="streaming-logo" src="@/assets/movieDetailLogo/Wacha.png" alt="Watcha" @click="goToLink('https://www.watcha.com')" />
        <img class="streaming-logo" src="@/assets/movieDetailLogo/Wiki.png" alt="Wavve" @click="goToLink('https://www.wavve.com')" />
        <img class="streaming-logo" src="@/assets/movieDetailLogo/Netfilx.png" alt="Netflix" @click="goToLink('https://www.netflix.com')" />
        <img class="streaming-logo" src="@/assets/movieDetailLogo/Tiving.png" alt="Tiving" @click="goToLink('https://www.tving.com')" />
      </div>
    </div>

    <div class="similar-movies-section" v-if="similarMovies && similarMovies.length > 0">
      <h3 class="section-title">관련 추천 {{ movie.mediaType === 'tv' ? 'TV 프로그램' : movie.mediaType === 'animation' ? '애니메이션' : '영화' }}</h3>
      <div class="similar-movies-list">
        <div v-for="similar in similarMovies.slice(0, 10)" :key="similar.id" class="similar-movie-item" @click="goToMovieDetail(similar.id)">
          <img v-if="similar.posterPath" :src="'https://image.tmdb.org/t/p/w200' + similar.posterPath" alt="추천 미디어 포스터" />
          <div v-else class="similar-movie-placeholder">포스터 없음</div>
          <p class="similar-movie-title">{{ similar.title || similar.name || '제목 없음' }}</p>
        </div>
      </div>
    </div>
    <div class="similar-movies-section" v-else>
      <h3 class="section-title">관련 추천 미디어</h3>
      <p>추천 미디어 정보 없음</p>
    </div>

  </div>
  <div v-else>
    <p>미디어 정보를 불러오는 중...</p>
  </div>
</template>

<script>
import {
  fetchMediaDetails,
  fetchBookmarkCount,
  toggleBookmark
} from '@/api/movie/movieDetail';

export default {
  data() {
    return {
      movie: null,
      similarMovies: [],
      bookmarkCount: 0,
      isBookmarked: false,
      videoUrl: null,
      actors: [],
      crew: [],
      director: null,
    };
  },
  async created() {
    const movieId = this.$route.params.id;
    const mediaType = 'movie';

    await this.fetchMovieDetailsAndRelated(mediaType, movieId);
  },
  watch: {
    '$route.params.id': {
      handler: 'handleRouteChange',
    },
  },
  methods: {
    async handleRouteChange() {
      const movieId = this.$route.params.id;
      const mediaType = 'movie';
      window.scrollTo(0, 0);
      await this.fetchMovieDetailsAndRelated(mediaType, movieId);
    },

    async fetchMovieDetailsAndRelated(mediaType, movieId) {
      this.movie = null;
      this.similarMovies = [];
      this.bookmarkCount = 0;
      this.videoUrl = null;
      this.actors = [];
      this.crew = [];
      this.director = null;

      try {
        console.log(`[fetchMovieDetailsAndRelated] 미디어 상세 정보 요청 시작: ${mediaType}, ID: ${movieId}`);
        const responseData = await fetchMediaDetails(mediaType, movieId);
        console.log('[fetchMovieDetailsAndRelated] API 응답 데이터:', responseData);

        this.movie = responseData.mediaInfo;
        const credits = responseData.credits;
        const videos = responseData.videos;
        const similar = responseData.similar;

        console.log('[fetchMovieDetailsAndRelated] 추출된 mediaInfo:', this.movie);
        console.log('[fetchMovieDetailsAndRelated] 추출된 credits:', credits);
        console.log('[fetchMovieDetailsAndRelated] 추출된 videos:', videos);
        console.log('[fetchMovieDetailsAndRelated] 추출된 similar:', similar);


        const uniqueActorsMap = new Map();
        if (credits && credits.cast) {
          console.log('[fetchMovieDetailsAndRelated] credits.cast 데이터 있음:', credits.cast);
          credits.cast.forEach(actor => {
            if (!uniqueActorsMap.has(actor.id)) {
              uniqueActorsMap.set(actor.id, actor);
            }
          });
          this.actors = Array.from(uniqueActorsMap.values());
          console.log('[fetchMovieDetailsAndRelated] 처리된 actors:', this.actors);
        } else {
          console.log('[fetchMovieDetailsAndRelated] credits 또는 credits.cast 데이터 없음.');
          this.actors = [];
        }

        const uniqueCrewMap = new Map();
        if (credits && credits.crew) {
          console.log('[fetchMovieDetailsAndRelated] credits.crew 데이터 있음:', credits.crew);
          credits.crew.forEach(member => {
            if (!uniqueCrewMap.has(member.id)) {
              uniqueCrewMap.set(member.id, member);
            }
          });
          this.crew = Array.from(uniqueCrewMap.values());
          console.log('[fetchMovieDetailsAndRelated] 처리된 crew:', this.crew);
        } else {
          console.log('[fetchMovieDetailsAndRelated] credits 또는 credits.crew 데이터 없음.');
          this.crew = [];
        }


        this.director = this.crew.find(member => member.job === "Director") || null;
        console.log('[fetchMovieDetailsAndRelated] 찾은 director:', this.director);


        if (videos && videos.length > 0 && videos[0].key) {
          console.log('[fetchMovieDetailsAndRelated] videos 데이터 있고 key 있음:', videos[0].key);
          this.videoUrl = `https://www.youtube.com/embed/${videos[0].key}`;
          console.log('[fetchMovieDetailsAndRelated] 설정된 videoUrl:', this.videoUrl);
        } else {
          console.log('[fetchMovieDetailsAndRelated] videos 데이터 없거나 key 없음.');
          this.videoUrl = null;
        }

        this.similarMovies = similar || [];
        console.log('[fetchMovieDetailsAndRelated] 설정된 similarMovies:', this.similarMovies);

        this.bookmarkCount = await fetchBookmarkCount(movieId);
        console.log('[fetchMovieDetailsAndRelated] 설정된 bookmarkCount:', this.bookmarkCount);

      } catch (error) {
        console.error(`[fetchMovieDetailsAndRelated] ID ${movieId} (${mediaType}) 정보를 불러오는 중 오류 발생:`, error);
        alert("미디어 정보를 불러오는 중 오류가 발생했습니다.");
        this.movie = null;
      }
    },

    goToMovieDetail(movieId) {
      if (this.$route.params.id !== String(movieId)) {
        this.$router.push(`/movie/${movieId}`);
      }
    },
    goBack() {
      this.$router.go(-1);
    },
    goToReviewPage() {
      const userConfirmed = confirm("스포일러가 포함될 수 있습니다. 계속 하시겠습니까?");
      if (!userConfirmed) return;
      if (this.movie) {
        this.$router.push({
          name: 'ReviewPage',
          query: {
            id: String(this.movie.id),
            title: this.movie.title || '제목 없음',
            posterPath: this.movie.posterPath || '',
            overview: this.movie.overview || '설명 없음',
            mediaType: this.movie.mediaType || 'movie'
          }
        });
      } else {
        alert("미디어 정보가 아직 로드되지 않았습니다.");
      }
    },

    async toggleBookmark(movieId) {
      const token = localStorage.getItem('token');
      if (!token) {
        alert("로그인 후 이용해주세요.");
        this.$router.push("/auth");
        return;
      }
      try {
        console.log(`[toggleBookmark] 즐겨찾기 토글 요청 시작: ${movieId}`);
        const result = await toggleBookmark(movieId, token);
        console.log("[toggleBookmark] 북마크 토글 응답:", result);

        alert(result === '추가 성공' ? '즐겨찾기에 추가하였습니다.' : '즐겨찾기를 취소하였습니다.');

        console.log(`[toggleBookmark] 북마크 개수 다시 가져오기: ${movieId}`);
        this.bookmarkCount = await fetchBookmarkCount(movieId);
        console.log('[toggleBookmark] 설정된 bookmarkCount:', this.bookmarkCount);

      } catch (error) {
        console.error('[toggleBookmark] 즐겨찾기 토글 오류:', error);
        alert("즐겨찾기 처리 중 오류가 발생했습니다. 다시 시도해 주세요.");
      }
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
.movie-trailer{
  position: relative;
  left:100px;
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
  text-align: left;
  top:-10px;
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
  position: relative;
  top:40px;
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
.actors-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 30px;
  justify-content: flex-start;
}

.actor-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 130px;
}

.actor-image {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #fff;
  box-shadow: 0 2px 5px rgba(255, 255, 255, 0.2);
}

.actor-name {
  margin-top: 8px;
  font-size: 12px;
  color: #ddd;
  font-weight: bold;
  text-align: center;
  max-width: 70px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.bookmark-container {
  display: inline-flex;
  align-items: center;
}

.movie-detail-bookmark {
  cursor: pointer;
  margin-right: 5px;
}
</style>
