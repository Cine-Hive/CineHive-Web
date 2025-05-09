<template>
  <div v-if="animation" class="animation-detail">
    <div class="animation-backdrop">
      <div class="animation-poster">
        <img v-if="animation.posterPath" :src="'https://image.tmdb.org/t/p/original' + animation.posterPath" alt="포스터" class="poster-image" />
      </div>
      <div class="animation-content">
        <div class="info-item">
          <span class="info-label">제목</span>
          <p v-if="animation.title" class="info-text">{{ animation.title }}</p>
        </div>
        <div class="animation-info">
          <div class="info-item">
            <span class="info-label">평점</span>
            <p v-if="animation.voteAverage" class="info-text">{{ animation.voteAverage }}</p>
          </div>
          <div class="info-item">
            <span class="info-label">감독</span>
            <p class="info-text">
              <span v-if="directors && directors.length > 0">
                {{ directors.map(d => d.name).join(', ') }}
              </span>
              <span v-else>정보 없음</span>
            </p>
          </div>
          <div class="info-item">
            <span class="info-label">줄거리</span>
            <p class="info-text">{{ animation.overview || '설명 없음' }}</p>
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
      <img src="@/assets/reviewLogo/like.png" height="20" width="20" class="movie-detail-bookmark" @click="handleToggleBookmark" />
      <span style="position: relative; left:0.3%;">{{ bookmarkCount }}</span>
    </div>

    <div class="action-buttons">
      <button class="action-button" @click="goToReviewPage">감상평 보기</button>
      <button class="action-button" @click="goBack">뒤로 가기</button>
    </div>

    <div class="bottom-section">
      <h3 class="section-title">바로가기</h3>
      <div class="streaming-services">
        <img class="streaming-logo" src="@/assets/movieDetailLogo/Wacha.png" alt="Watcha" @click="goToLink('https://www.watcha.com')" />
        <img class="streaming-logo" src="@/assets/movieDetailLogo/Wiki.png" alt="Wavve" @click="goToLink('https://www.wavve.com')" />
        <img class="streaming-logo" src="@/assets/movieDetailLogo/Netfilx.png" alt="Netflix" @click="goToLink('https://www.netflix.com')" />
        <img class="streaming-logo" src="@/assets/movieDetailLogo/Tiving.png" alt="Tving" @click="goToLink('https://www.tving.com')" />
      </div>
    </div>

    <div class="similar-animations-section" v-if="similarAnimations.length > 0">
      <h3 class="section-title">추천 애니메이션</h3>
      <div class="similar-animations-list">
        <div v-for="similar in similarAnimations" :key="similar.id" class="similar-animation-item" @click="goToAnimationDetail(similar.id)">
          <img v-if="similar.posterPath" :src="'https://image.tmdb.org/t/p/w200' + similar.posterPath" alt="추천 애니메이션 포스터" />
          <p class="similar-animation-title">{{ similar.title || '제목 없음' }}</p>
        </div>
      </div>
    </div>
  </div>

  <div v-else>
    <p>애니메이션 정보를 불러오는 중...</p>
  </div>
</template>

<script>
import {
  fetchMediaDetails,
  fetchBookmarkCount,
  toggleBookmark,
} from '@/api/animation/animationDetail';

export default {
  data() {
    return {
      animation: null,
      similarAnimations: [],
      bookmarkCount: 0,
      isBookmarked: false,
      videos: [],
      directors: [],
      actors: [],
      crew: [],
    };
  },
  async created() {
    const animationId = this.$route.params.id;
    const mediaType = 'animation';
    if (animationId) {
      await this.fetchMediaDetailsAndRelated(mediaType, animationId);
    }
  },
  watch: {
    '$route.params.id': {
      handler: 'handleRouteChange',
    },
  },
  methods: {
    async handleRouteChange() {
      const animationId = this.$route.params.id;
      const mediaType = 'animation';
      window.scrollTo(0, 0);
      this.animation = null;
      this.similarAnimations = [];
      this.bookmarkCount = 0;
      this.isBookmarked = false;
      this.videos = [];
      this.directors = [];
      this.actors = [];
      this.crew = [];
      if (animationId) {
        await this.fetchMediaDetailsAndRelated(mediaType, animationId);
      }
    },

    async fetchMediaDetailsAndRelated(mediaType, mediaId) {
      try {
        console.log(`[fetchMediaDetailsAndRelated] 미디어 상세 정보 요청 시작: ${mediaType}, ID: ${mediaId}`);
        const responseData = await fetchMediaDetails(mediaType, mediaId);
        console.log('[fetchMediaDetailsAndRelated] API 응답 데이터:', responseData);

        this.animation = responseData.mediaInfo || null;
        this.videos = responseData.videos || [];
        const credits = responseData.credits;
        this.similarAnimations = responseData.similar || [];

        console.log('[fetchMediaDetailsAndRelated] 추출된 mediaInfo:', this.animation);
        console.log('[fetchMediaDetailsAndRelated] 추출된 videos:', this.videos);
        console.log('[fetchMediaDetailsAndRelated] 추출된 credits:', credits);
        console.log('[fetchMediaDetailsAndRelated] 추출된 similar:', this.similarAnimations);

        if (credits) {
          this.actors = credits.cast || [];
          console.log('[fetchMediaDetailsAndRelated] 처리된 actors:', this.actors);

          this.crew = credits.crew || [];
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
        this.animation = null;
        this.videos = [];
        this.directors = [];
        this.actors = [];
        this.crew = [];
        this.similarAnimations = [];
        this.bookmarkCount = 0;
        this.isBookmarked = false;
      }
    },

    async handleToggleBookmark() {
      const animationId = this.$route.params.id;
      const token = localStorage.getItem("token");

      if (!token) {
        alert("로그인 후 이용해주세요.");
        return;
      }

      try {
        await toggleBookmark(animationId, token);
        this.isBookmarked = !this.isBookmarked;
        alert(this.isBookmarked ? '즐겨찾기에 추가하였습니다.' : '즐겨찾기를 취소하였습니다.');
        this.bookmarkCount = await fetchBookmarkCount(animationId);
      } catch (error) {
        console.error("즐겨찾기 토글 오류:", error);
        alert("즐겨찾기 처리에 실패했습니다.");
      }
    },

    goToReviewPage() {
      const userConfirmed = confirm("스포일러가 포함될 수 있습니다. 계속 하시겠습니까?");
      if (!userConfirmed) return;

      if (this.animation) {
        this.$router.push({
          name: 'ReviewPage',
          query: {
            id: String(this.animation.id),
            title: this.animation.title || '제목 없음',
            posterPath: this.animation.posterPath || '',
            overview: this.animation.overview || '설명 없음',
            mediaType: 'tv'
          },
        });
      } else {
        console.warn('애니메이션 정보가 없어 감상평 페이지로 이동할 수 없습니다.');
        alert('애니메이션 정보를 불러오지 못했습니다.');
      }
    },
    goToLink(url) {
      window.open(url, '_blank');
    },
    goBack() {
      this.$router.go(-1);
    },
    goToAnimationDetail(animationId) {
      if (this.$route.params.id !== String(animationId)) {
        this.$router.push({ name: 'AnimationDetail', params: { id: animationId } });
      }
    },
  },
};
</script>

<style scoped>
.animation-detail {
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

.animation-backdrop {
  display: flex;
  align-items: flex-start;
}

.animation-poster {
  margin-right: 20px;
}

.poster-image {
  max-width: 300px;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

.animation-content {
  max-width: 600px;
  text-align: left;
}

.animation-info {
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

.similar-animations-section {
  margin-top: 40px;
}


.similar-animations-section {
  margin-top: 100px;
  border-radius: 10px;
}

.similar-animations-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 15px;
  justify-items: center;
}

.similar-animation-item {
  border-radius: 12px;
  padding: 10px;
  text-align: center;
  box-shadow: 0 4px 10px rgba(255, 255, 255, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.similar-animation-item:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 15px rgba(255, 255, 255, 0.2);
}

.similar-animation-item img {
  width: 100%;
  max-height: 200px;
  object-fit: cover;
  border-radius: 8px;
}

.similar-animation-title {
  margin-top: 8px;
  font-size: 14px;
  color: #ddd;
  font-weight: bold;
}

.bookmark-container {
  display: inline-flex;
  align-items: center; /* 세로 정렬을 맞추기 위해 추가 */
}

.movie-detail-bookmark {
  cursor: pointer;
  margin-right: 5px; /* 이미지와 숫자 간의 간격을 설정 */
}

</style>
