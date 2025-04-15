<template>
  <div class="animation-list">
    <h1>애니메이션 목록</h1>

    <div class="button-group">
      <span
          @click="resetSort"
          :class="['rating-button', { active: !sorted && !popularitySorted }]">전체</span> &nbsp;&nbsp;
      <span
          @click="sortByRating"
          :class="['rating-button', { active: sorted }]">평점 순</span> &nbsp;&nbsp;
      <span
          @click="sortByPopularity"
          :class="['rating-button', { active: popularitySorted }]">인기 순</span> &nbsp;&nbsp;
      <span
          @click="filterByDecade(2000)"
          :class="['rating-button', { active: decadeFiltered === 2000 }]">2000s</span> &nbsp;&nbsp;
      <span
          @click="filterByDecade(2010)"
          :class="['rating-button', { active: decadeFiltered === 2010 }]">2010s</span> &nbsp;&nbsp;
      <span
          @click="filterByDecade(2020)"
          :class="['rating-button', { active: decadeFiltered === 2020 }]">2020s</span> &nbsp;&nbsp;
      <span
          @click="filterByDecade(2000, true)"
          :class="['rating-button', { active: decadeFiltered === 'before2000' }]">2000s 이하</span>
    </div>

    <div class="search-bar">
      <input
          type="text"
          v-model="searchQuery"
          placeholder="애니메이션 제목 검색..."
      />
    </div>

    <div class="separator"></div>
    <div class="top-slider">
      <div
          class="animation-card"
          v-for="animation in paginatedAnimations"
          :key="animation.id"
          @click="goToAnimationDetail(animation.id)"
      >
        <img :src="'https://image.tmdb.org/t/p/w300' + animation.posterPath" alt="animation poster" class="animation-poster" />
        <div class="animation-info">
          <h3 class="animation-title">{{ animation.name }}</h3>
          <p class="info-text">
            <span v-if="animation.directors.length > 0">
              {{ [...new Set(animation.directors.map(d => d.name))].join(', ') }}
            </span>
            <span v-else>정보 없음</span>
          </p>
          <p class="rating-text" v-if="sorted">평점: {{ animation.voteAverage.toFixed(1) }}</p>
          <p class="popularity-text" v-if="popularitySorted">인기: {{ animation.popularity.toFixed(1) }}</p>
        </div>
      </div>
    </div>

    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">이전</button>
      <span class="pagination-total-count">{{ currentPage }} / {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">다음</button>
    </div>
  </div>
</template>

<script>
import { fetchAnimations } from '@/api/animation/animationList';

export default {
  name: 'AnimationList',
  data() {
    return {
      animations: [],
      sorted: false,
      popularitySorted: false,
      decadeFiltered: null, // 연대 필터 상태 추가
      searchQuery: '',
      currentPage: 1,
      itemsPerPage: 21,
    };
  },
  created() {
    this.fetchAnimations();
  },
  computed: {
    sortedAnimations() {
      let filtered = this.animations;

      if (this.searchQuery) {
        filtered = filtered.filter(animation =>
            animation.name.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      }

      // 연대 필터링
      if (this.decadeFiltered === 2000) {
        filtered = filtered.filter(animation => {
          const year = parseInt(animation.releaseDate.split('-')[0]);
          return year >= 2000 && year < 2010;
        });
      } else if (this.decadeFiltered === 2010) {
        filtered = filtered.filter(animation => {
          const year = parseInt(animation.releaseDate.split('-')[0]);
          return year >= 2010 && year < 2020;
        });
      } else if (this.decadeFiltered === 2020) {
        filtered = filtered.filter(animation => {
          const year = parseInt(animation.releaseDate.split('-')[0]);
          return year >= 2020;
        });
      } else if (this.decadeFiltered === 'before2000') {
        filtered = filtered.filter(animation => {
          const year = parseInt(animation.releaseDate.split('-')[0]);
          return year < 2000;
        });
      }

      if (this.popularitySorted) {
        return filtered.slice().sort((a, b) => b.popularity - a.popularity);
      } else if (this.sorted) {
        return filtered.slice().sort((a, b) => b.voteAverage - a.voteAverage);
      }
      return filtered;
    },
    paginatedAnimations() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.sortedAnimations.slice(start, start + this.itemsPerPage);
    },
    totalPages() {
      return Math.ceil(this.sortedAnimations.length / this.itemsPerPage);
    }
  },
  methods: {
    async fetchAnimations() {
      try {
        this.animations = await fetchAnimations();
      } catch (error) {
        console.error('애니메이션 데이터를 가져오는 중 오류가 발생했습니다:', error);
      }
    },
    goToAnimationDetail(animationId) {
      this.$router.push({ path: `/animation/${animationId}` });
    },
    sortByRating() {
      this.sorted = true;
      this.popularitySorted = false;
    },
    resetSort() {
      this.sorted = false;
      this.popularitySorted = false;
      this.decadeFiltered = null;
      this.searchQuery = '';
      this.fetchAnimations();
    },
    sortByPopularity() {
      this.popularitySorted = true;
      this.sorted = false;
    },
    filterByDecade(decade, before2000 = false) {
      this.decadeFiltered = before2000 ? 'before2000' : decade;
      this.sorted = false;
      this.popularitySorted = false;
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    }
  }
}
</script>

<style scoped>
.animation-list {
  padding: 20px;
  background-color: black;
  color: white;
  overflow-x: hidden;
  min-height: 950px;
}

.animation-list h1 {
  text-align: left;
  color: white;
  font-size: 19px;
  margin-bottom: 20px;
  position: relative;
  left: 4%;
}

.separator {
  width: 93%;
  border-bottom: 1px solid;
  background-color: white;
  margin-bottom: 20px;
  position: relative;
  left: 4%;
}

.search-bar {
  position: relative;
  text-align: right;
  width: 97%;
  top: -10px;
}

.search-bar input {
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  width: 500px;
}

.button-group {
  display: flex;
  margin-bottom: 20px;
  position: relative;
  left: 4%;
}

.rating-button {
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}

.rating-button:hover {
  transform: scale(1.05);
}

.rating-button.active {
  font-weight: bold;
  text-decoration: underline;
}

.top-slider {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 30px;
}

.animation-card {
  cursor: pointer;
  width: 220px;
  min-height: 400px;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
  background-color: #1e1e1e;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.6);
}

.animation-card:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.8);
}

.animation-poster {
  width: 100%;
  height: 320px;
  object-fit: cover;
  border-bottom: 2px solid #F50000;
}

.animation-info {
  padding: 15px;
  text-align: center;
  background-color: rgba(30, 30, 30, 0.9);
}

.animation-title {
  font-size: 14px;
  font-weight: bold;
  color: #F50000;
  margin: 5px 0;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.info-text {
  font-size: 1rem;
  color: #ccc;
  margin: 5px 0;
  font-style: italic;
}

.rating-text {
  font-size: 1rem;
  color: #FFD700;
  margin-top: 5px;
}

.popularity-text {
  font-size: 1rem;
  color: #FFD700;
  margin-top: 5px;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.pagination button {
  background-color: #F50000;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 15px;
  cursor: pointer;
  margin: 0 5px;
  transition: background-color 0.3s;
}

.pagination button:disabled {
  background-color: #555;
  cursor: not-allowed;
}

.pagination button:hover:not(:disabled) {
  background-color: #c00000;
}

.pagination-total-count {
  position: relative;
  top: 8px;
}
</style>

