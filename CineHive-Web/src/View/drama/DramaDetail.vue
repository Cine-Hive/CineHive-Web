<template>
  <div class="drama-detail">
    <div class="drama-backdrop">
      <div class="drama-poster">
        <img :src="'https://image.tmdb.org/t/p/original' + drama.posterPath" alt="포스터" class="poster-image" />
      </div>
      <div class="drama-content">
        <div class="info-item">
          <span class="info-label">제목</span>
          <p class="info-text">{{ drama.name }}</p>
        </div>
        <div class="drama-info">
          <div class="info-item">
            <span class="info-label">인기 지수</span>
            <p class="info-text">{{ drama.popularity }}</p>
          </div>
          <div class="info-item">
            <span class="info-label">감독</span>
            <p class="info-text">
        <span v-if="drama.directors.length > 0">
            {{ [...new Set(drama.directors.map(director => director.name))].join(', ') }}
        </span>
              <span v-else>정보 없음</span>
            </p>
          </div>

          <div class="info-item">
            <span class="info-label">줄거리</span>
            <p class="info-text">{{ drama.overview || '설명 없음' }}</p>
          </div>
        </div>
      </div>
      <div class="trailer-section" v-if="drama.videos && drama.videos.length > 0">
        <iframe
            width="560"
            height="315"
            :src="'https://www.youtube.com/embed/' + drama.videos[0].videoKey"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            class="trailer-iframe"
        ></iframe>
      </div>
    </div>


    <div class="action-buttons">
      <button class="action-button" @click="goToReviewPage">감상평 보기</button>
      <button class="action-button" @click="toggleBookmark(drama.id)">즐겨찾기({{ bookmarkCount }})</button>
      <button class="action-button" @click="goBack">뒤로 가기</button>
    </div>

    <div class="info-item">
      <span class="info-label" style="position: relative; left:-48%; top:20px; font-size: 16.5px; font-weight: bolder">배우 정보</span>
      <div v-if="drama.actors && drama.actors.length > 0" class="actors-list">
        <div v-for="actor in drama.actors.slice(0, 5)" :key="actor.id" class="actor-item">
          <img
              v-if="actor.posterPath"
              :src="'https://image.tmdb.org/t/p/w200' + actor.posterPath"
              alt="배우 프로필"
              class="actor-image"
          />
          <span class="actor-name">{{ actor.name }}</span>
        </div>
      </div>
      <p v-else class="info-text">정보 없음</p>
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
  </div>
</template>
<script>
import { fetchDramaDetails, fetchBookmarkCount, toggleBookmark } from '@/api/drama/dramaDetail';

export default {
  data() {
    return {
      drama: {},
      bookmarkCount: 0,
      isBookmarked: false,
    };
  },
  created() {
    this.fetchDramaDetails();
  },
  watch: {
    '$route.params.id': 'fetchDramaDetails',
  },
  methods: {
    async toggleBookmark(dramaId) {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("로그인 후 이용해주세요.");
        return;
      }

      try {
        const result = await toggleBookmark(dramaId, token);
        console.log(result);

        this.isBookmarked = !this.isBookmarked;

        const message = this.isBookmarked ? '즐겨찾기에 추가하였습니다.' : '즐겨찾기를 취소하였습니다';
        alert(message);

        this.bookmarkCount = await this.fetchBookmarkCount(dramaId);
      } catch (error) {
        console.error("즐겨찾기 토글 오류:", error);
      }
    },
    async fetchBookmarkCount(dramaId) {
      try {
        const count = await fetchBookmarkCount(dramaId);
        return count;
      } catch (error) {
        console.error('즐겨찾기 개수 가져오는 중 오류 발생:', error);
        return 0;
      }
    },
    async fetchDramaDetails() {
      const dramaId = this.$route.params.id;
      try {
        this.drama = await fetchDramaDetails(dramaId);
        this.bookmarkCount = await fetchBookmarkCount(dramaId);
      } catch (error) {
        console.error('드라마 상세 정보를 가져오는 중 오류가 발생했습니다:', error);
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

      this.$router.push({
        name: 'ReviewPage',
        query: {
          id: String(this.drama.id), // 문자열 변환
          title: this.drama.title || '제목 없음', // undefined 방지
          posterPath: this.drama.posterPath || '', // 기본값 설정
          overview: this.drama.overview || '설명 없음' // undefined 방지
        }
      });
    },
  },
};
</script>


<style scoped>
.drama-detail {
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

.bottom-section {
  margin-top: 20px;
  position: relative;
  top: 50px;
}

.section-title {
  position: relative;
  left:-47.8%;
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
  top:40px;
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

.actor-item:hover{
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


</style>
