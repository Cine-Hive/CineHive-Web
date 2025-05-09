<template>
  <div class="drama-detail">
    <div class="drama-backdrop">
      <div class="drama-poster">
        <img :src="'https://image.tmdb.org/t/p/original' + drama.posterPath" alt="포스터" class="poster-image"/>
      </div>
      <div class="drama-content">
        <div class="info-item">
          <span class="info-label">제목</span>
          <p class="info-text">{{ drama.title }}</p>
        </div>
        <div class="drama-info">
          <div class="info-item">
            <span class="info-label">인기 지수</span>
            <p class="info-text">{{ drama.popularity }}</p>
          </div>
          <div v-if="crew && crew.length > 0" class="info-item">
            <h4 class="info-label">제작진</h4>
            <div class="info-text">
              <span class="info-text">
                {{ crew[0].name }}
              </span>
            </div>
          </div>
          <div class="info-item">
            <span class="info-label">줄거리</span>
            <p class="info-text">{{ drama.overview || '설명 없음' }}</p>
          </div>
        </div>
      </div>
      <div class="trailer-section" v-if="videos && videos.length > 0">
        <iframe
            width="560"
            height="315"
            :src="'https://www.youtube.com/embed/' + videos[0].key"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            class="trailer-iframe"
        ></iframe>
      </div>
    </div>

    <div class="bookmark-container">
      <img src="@/assets/reviewLogo/like.png" height="20" width="20" class="movie-detail-bookmark"
           @click="toggleBookmark(drama.id)"/>
      <span style="position: relative; left:0.3%;">{{ bookmarkCount }}</span>
    </div>

    <div class="action-buttons">
      <button class="action-button" @click="goToReviewPage">감상평 보기</button>
      <button class="action-button" @click="goBack">뒤로 가기</button>
    </div>

    <div class="info-item">
      <span class="info-label" style="position: relative; left:-48%; top:20px; font-size: 16.5px; font-weight: bolder">출연진 정보</span>
      <div v-if="actors && actors.length > 0" class="actors-list">
        <div v-for="actor in actors.slice(0, 5)" :key="actor.id" class="actor-item">
          <img
              v-if="actor.profilePath"
              :src="'https://image.tmdb.org/t/p/w200' + actor.profilePath"
              alt="배우 프로필"
              class="actor-image"
          />
          <span class="actor-name">{{ actor.name }}</span>
        </div>
      </div>
      <p v-else class="info-text">정보 없음</p>
    </div>

    <div v-if="similarTvSeries && similarTvSeries.length > 0"
         class="similar-tv-series">
      <h3 class="section-title" style="font-size: 17px;">유사 TV 시리즈</h3>
      <div class="similar-tv-series-list">
        <div v-for="tv in similarTvSeries.slice(0, 10)" :key="tv.id" class="similar-tv-item"
             @click="goToTvSeriesDetail(tv.id)">
          <img
              v-if="tv.posterPath"
              :src="'https://image.tmdb.org/t/p/w200' + tv.posterPath"
              alt="유사 TV 시리즈 포스터"
              class="tv-poster"
          />
          <p class="similar-tv-title">{{ tv.name || tv.title || '제목 없음' }}</p>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import {
  fetchMediaDetails,
  fetchBookmarkCount,
  toggleBookmark,
} from '@/api/tv/tvDetail';

export default {
  data() {
    return {
      drama: null,
      bookmarkCount: 0,
      isBookmarked: false,
      videos: [],
      credits: null,
      directors: [],
      actors: [],
      crew: [],
      similarTvSeries: [],
    };
  },
  async created() {
    const dramaId = this.$route.params.id;
    const mediaType = 'tv';
    if (dramaId) {
      await this.fetchMediaDetailsAndRelated(mediaType, dramaId);
    }
  },
  watch: {
    '$route.params.id': {
      handler: 'handleRouteChange',
    },
  },
  methods: {
    async handleRouteChange() {
      const dramaId = this.$route.params.id;
      const mediaType = 'tv';
      window.scrollTo(0, 0);
      this.drama = null;
      this.bookmarkCount = 0;
      this.isBookmarked = false;
      this.videos = [];
      this.credits = null;
      this.directors = [];
      this.actors = [];
      this.crew = [];
      this.similarTvSeries = [];
      if (dramaId) {
        await this.fetchMediaDetailsAndRelated(mediaType, dramaId);
      }
    },

    async fetchMediaDetailsAndRelated(mediaType, mediaId) {
      try {
        console.log(`[fetchMediaDetailsAndRelated] 미디어 상세 정보 요청 시작: ${mediaType}, ID: ${mediaId}`);
        const responseData = await fetchMediaDetails(mediaType, mediaId);
        console.log('[fetchMediaDetailsAndRelated] API 응답 데이터:', responseData);

        this.drama = responseData.mediaInfo || null;
        this.videos = responseData.videos || [];
        this.credits = responseData.credits || null;
        this.similarTvSeries = responseData.similar || [];

        console.log('[fetchMediaDetailsAndRelated] 추출된 mediaInfo:', this.drama);
        console.log('[fetchMediaDetailsAndRelated] 추출된 videos:', this.videos);
        console.log('[fetchMediaDetailsAndRelated] 추출된 credits:', this.credits);
        console.log('[fetchMediaDetailsAndRelated] 추출된 similar:', this.similarTvSeries);

        if (this.credits) {
          this.actors = this.credits.cast || [];
          console.log('[fetchMediaDetailsAndRelated] 처리된 actors:', this.actors);

          this.crew = this.credits.crew || [];
          console.log('[fetchMediaDetailsAndRelated] 처리된 crew:', this.crew);

          this.directors = this.crew.filter(member => member.job === "Director") || [];
          console.log('[fetchMediaDetailsAndRelated] 찾은 directors:', this.directors);
        } else {
          this.actors = [];
          this.crew = [];
          this.directors = [];
          console.log('[fetchMediaDetailsAndRelated] credits 데이터 없음.');
        }

        this.bookmarkCount = await fetchBookmarkCount(mediaId);
        console.log('[fetchMediaDetailsAndRelated] 설정된 bookmarkCount:', this.bookmarkCount);

      } catch (error) {
        console.error(`[fetchMediaDetailsAndRelated] ID ${mediaId} (${mediaType}) 정보를 불러오는 중 오류 발생:`, error);
        alert("미디어 정보를 불러오는 중 오류가 발생했습니다. 서버 API 응답 구조를 확인해보세요!");
        this.drama = null;
        this.videos = [];
        this.credits = null;
        this.directors = [];
        this.actors = [];
        this.crew = [];
        this.similarTvSeries = [];
        this.bookmarkCount = 0;
        this.isBookmarked = false;
      }
    },

    async toggleBookmark(dramaId) {
      const idToUse = dramaId || this.$route.params.id;
      const token = localStorage.getItem("token");

      if (!token) {
        alert("로그인 후 이용해주세요.");
        return;
      }

      try {
        const result = await toggleBookmark(idToUse, token);
        console.log(result);

        this.isBookmarked = !this.isBookmarked;
        const message = this.isBookmarked ? '즐겨찾기에 추가하였습니다.' : '즐겨찾기를 취소하였습니다';
        alert(message);

        this.bookmarkCount = await this.fetchBookmarkCount(idToUse);
      } catch (error) {
        console.error("즐겨찾기 토글 오류:", error);
        alert("즐겨찾기 처리에 실패했습니다.");
      }
    },

    async fetchBookmarkCount(dramaId) {
      const idToUse = dramaId || this.$route.params.id;
      try {
        const count = await fetchBookmarkCount(idToUse);
        console.log(`ID ${idToUse} 북마크 개수:`, count);
        if (typeof count === 'number') {
          return count;
        } else {
          console.warn('fetchBookmarkCount API 응답이 숫자가 아님:', count);
          return 0;
        }
      } catch (error) {
        console.error('즐겨찾기 개수 가져오는 중 오류 발생:', error);
        alert("북마크 개수를 가져오는 중 오류가 발생했습니다.");
        return 0;
      }
    },

    goBack() {
      this.$router.go(-1);
    },
    goToLink(url) {
      window.open(url, '_blank');
    },
    goToReviewPage() {
      const userConfirmed = confirm("스포일러가 포함될 수 있습니다. 계속 하시겠습니까?");
      if (!userConfirmed) return;

      if (this.drama) {
        this.$router.push({
          name: 'ReviewPage',
          query: {
            id: String(this.drama.id),
            title: this.drama.title || this.drama.name || '제목 없음',
            posterPath: this.drama.posterPath || '',
            overview: this.drama.overview || '설명 없음',
            mediaType: 'tv'
          },
        });
      } else {
        console.warn('드라마 정보가 없어 감상평 페이지로 이동할 수 없습니다.');
        alert('드라마 정보를 불러오지 못했습니다.');
      }
    },
  },
};
</script>

<style scoped>
.drama-detail {
  min-height: 1150px;
  color: white;
  background-color: black;
  display: flex;
  flex-direction: column;
  height: 1000px;
  padding: 40px 60px;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  margin-left: 40px;
  margin-top: 40px;
}

.drama-backdrop {
  display: flex;
  align-items: flex-start;
}

.drama-poster {
  margin-right: 20px;
}

.poster-image {
  max-width: 300px;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

.drama-content {
  max-width: 600px;
  text-align: left;
}

.drama-info {
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

.section-title {
  position: relative;
  text-align: left;
  top: -10px;
  margin-bottom: 10px;
  font-size: 14px;
  color: #f0f0f0;
}

.trailer-section {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-top: 20px;
  position: relative;
  left: 10%;
  top: -40px;
  position: relative;
}

.trailer-iframe {
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

.actors-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 10px;
  position: relative;
  top: 40px;
}

.actor-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 130px;
  background-color: #393636;
  padding: 5px;
  border-radius: 5px;
}

.actor-item:hover {
  background-color: #555555;
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

.section-title {
  font-size: 20px;
  font-weight: bold;
  color: #fff;
  margin-bottom: 15px;
}

.similar-tv-series {
  margin-top: 40px;
  border-radius: 10px;
}

.similar-tv-series-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 15px;
  justify-items: center;
}

.similar-tv-item {
  border-radius: 12px;
  padding: 10px;
  text-align: center;
  background-color: #333;
  box-shadow: 0 4px 10px rgba(255, 255, 255, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.similar-tv-item:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 15px rgba(255, 255, 255, 0.2);
}

.tv-poster {
  width: 100%;
  max-height: 200px;
  object-fit: cover;
  border-radius: 8px;
}

.similar-tv-title {
  margin-top: 8px;
  font-size: 14px;
  color: #ddd;
  font-weight: bold;
}
</style>
