<template>
  <div v-if="animation" class="animation-detail">
    <div class="animation-backdrop">
      <div class="animation-poster">
        <img v-if="animation.posterPath" :src="'https://image.tmdb.org/t/p/original' + animation.posterPath" alt="포스터" class="poster-image" />
      </div>
      <div class="animation-content">
        <div class="info-item">
          <span class="info-label">제목</span>
          <p v-if="animation.name" class="info-text">{{ animation.name }}</p>
        </div>
        <div class="animation-info">
          <div class="info-item">
            <span class="info-label">평점</span>
            <p v-if="animation.voteAverage" class="info-text">{{ animation.voteAverage }}</p>
          </div>
          <div class="info-item">
            <span class="info-label">감독</span>
            <p class="info-text">
              <span v-if="animation.directors && animation.directors.length > 0">
                {{ animation.directors.map(d => d.name).join(', ') }}
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
      <div class="trailer-section" v-if="animation.videos && animation.videos.length > 0">
        <iframe
            width="560"
            height="315"
            :src="'https://www.youtube.com/embed/' + animation.videos[0].videoKey"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            class="trailer-iframe"
        ></iframe>
      </div>
    </div>

    <div class="bookmark-container">
      <img src="@/assets/reviewLogo/like.png" height="20" width="20" class="movie-detail-bookmark" @click="toggleBookmark(animation.id)" />
      <span style="position: relative; left:0.3%;">{{bookmarkCount}}</span>
    </div>

    <div class="action-buttons">
      <button class="action-button" @click="goToReviewPage">감상평 보기</button>
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

    <div class="similar-animations-section" v-if="similarAnimations.length > 0">
      <h3 class="section-title">추천 애니메이션</h3>
      <div class="similar-animations-list">
        <div v-for="similar in similarAnimations" :key="similar.id" class="similar-animation-item" @click="goToAnimationDetail(similar.id)">
          <img v-if="similar.posterPath" :src="'https://image.tmdb.org/t/p/w200' + similar.posterPath" alt="추천 애니메이션 포스터" />
          <p class="similar-animation-title">{{ similar.name }}</p>
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
  fetchAnimationDetails,
  fetchSimilarAnimations,
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
    };
  },
  async created() {
    await this.fetchAnimationDetails();
    await this.fetchSimilarAnimations();
    const animationId = this.$route.params.id;
    try {
      this.bookmarkCount = await this.fetchBookmarkCount(animationId);
    } catch (error) {
      console.error("즐겨찾기 개수 로딩 중 오류 발생:", error);
    }
  },
  watch: {
    '$route.params.id': function() {
      this.fetchAnimationDetails();
      this.fetchSimilarAnimations();
    }
  },
  methods: {
    async toggleBookmark(animationId) {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("로그인 후 이용해주세요.");
        return;
      }

      try {
        const result = await toggleBookmark(animationId, token);
        console.log(result);

        this.isBookmarked = !this.isBookmarked;

        const message = this.isBookmarked ? '즐겨찾기에 추가하였습니다.' : '즐겨찾기를 취소하였습니다';
        alert(message);

        this.bookmarkCount = await this.fetchBookmarkCount(animationId);
      } catch (error) {
        console.error("즐겨찾기 토글 오류:", error);
      }
    },

    async fetchBookmarkCount(animationId) {
      try {
        const count = await fetchBookmarkCount(animationId);
        return count;
      } catch (error) {
        console.error("즐겨찾기 개수 가져오는 중 오류 발생:", error);
        return 0;
      }
    },
    async fetchAnimationDetails() {
      const animationId = this.$route.params.id;
      try {
        this.animation = await fetchAnimationDetails(animationId);
        console.log("res", this.animation);
      } catch (error) {
        console.error('애니메이션 상세 정보를 가져오는 중 오류가 발생했습니다:', error);
      }
    },
    async fetchSimilarAnimations() {
      const animationId = this.$route.params.id;
      try {
        this.similarAnimations = await fetchSimilarAnimations(animationId);
        this.bookmarkCount = await this.fetchBookmarkCount(animationId);
      } catch (error) {
        console.error('추천 애니메이션을 가져오는 중 오류 발생:', error);
      }
    },
    goToReviewPage() {
      const userConfirmed = confirm("스포일러가 포함될 수 있습니다. 계속 하시겠습니까?");
      if (!userConfirmed) return;

      this.$router.push({
        name: 'ReviewPage',
        query: {
          id: String(this.animation.id), // 문자열 변환
          title: this.animation.title || '제목 없음', // undefined 방지
          posterPath: this.animation.posterPath || '', // 기본값 설정
          overview: this.animation.overview || '설명 없음' // undefined 방지
        }
      });
    },
    goToLink(url) {
      window.open(url, '_blank');
    },
    goBack() {
      this.$router.go(-1);
    }
  }
}
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
