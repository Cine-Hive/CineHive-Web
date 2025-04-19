<template>
  <div class="drama-list">
    <h1>드라마 목록</h1>

    <div class="button-group">
      <span
          @click="resetSort"
          :class="['rating-button', { active: !popularitySorted }]">전체</span> &nbsp;&nbsp;
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
          @click="filterByDecade('before2000')"
          :class="['rating-button', { active: decadeFiltered === 'before2000' }]">2000s 이하</span>
    </div>

    <div class="search-bar">
      <input
          type="text"
          v-model="searchQuery"
          placeholder="드라마 제목 검색..."
      />
    </div>

    <div class="separator"></div>

    <div class="top-slider">
      <div
          class="drama-card"
          v-for="drama in paginatedDramas"
          :key="drama.id"
          @click="goToDramaDetail(drama.id)"
      >
        <img :src="'https://image.tmdb.org/t/p/w300' + drama.posterPath" alt="drama poster" class="drama-poster" />
        <div class="drama-info">
          <h3 class="drama-title">{{ drama.name }}</h3>
          <p class="info-text">
            <span v-if="drama.directors.length > 0">
              {{ [...new Set(drama.directors.map(director => director.name))].join(', ') }}
            </span>
            <span v-else>정보 없음</span>
          </p>
          <p class="popularity-text" v-if="popularitySorted">인기: {{ drama.popularity.toFixed(1) }}</p>
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
import { fetchDramas } from '@/api/drama/dramaList';

export default {
  name: 'DramaList',
  data() {
    return {
      dramas: [],
      popularitySorted: false,
      decadeFiltered: null,
      searchQuery: '',
      currentPage: 1,
      itemsPerPage: 21,
    };
  },
  created() {
    this.fetchDramas();
  },
  computed: {
    filteredDramas() {
      let filtered = this.dramas;

      if (this.searchQuery) {
        filtered = filtered.filter(drama =>
            drama.name.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      }

      // 연대 필터링
      if (this.decadeFiltered === 2000) {
        filtered = filtered.filter(drama => {
          const year = new Date(drama.firstAirDate).getFullYear();
          return year >= 2000 && year < 2010;
        });
      } else if (this.decadeFiltered === 2010) {
        filtered = filtered.filter(drama => {
          const year = new Date(drama.firstAirDate).getFullYear();
          return year >= 2010 && year < 2020;
        });
      } else if (this.decadeFiltered === 2020) {
        filtered = filtered.filter(drama => {
          const year = new Date(drama.firstAirDate).getFullYear();
          return year >= 2020;
        });
      } else if (this.decadeFiltered === 'before2000') {
        filtered = filtered.filter(drama => {
          const year = new Date(drama.firstAirDate).getFullYear();
          return year < 2000;
        });
      }

      // 인기 기준 정렬
      if (this.popularitySorted) {
        return filtered.slice().sort((a, b) => b.popularity - a.popularity);
      }

      return filtered; // 기본 목록
    },
    paginatedDramas() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.filteredDramas.slice(start, start + this.itemsPerPage);
    },
    totalPages() {
      return Math.ceil(this.filteredDramas.length / this.itemsPerPage);
    }
  },
  methods: {
    async fetchDramas() {
      try {
        this.dramas = await fetchDramas();
      } catch (error) {
        console.error('드라마 데이터를 가져오는 중 오류가 발생했습니다:', error);
      }
    },
    goToDramaDetail(dramaId) {
      this.$router.push({ path: `/drama/${dramaId}` });
    },
    resetSort() {
      this.popularitySorted = false;
      this.decadeFiltered = null;
      this.searchQuery = '';
      this.fetchDramas();
    },
    sortByPopularity() {
      this.popularitySorted = true;
    },
    filterByDecade(decade) {
      this.decadeFiltered = decade;
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
.drama-list {
  padding: 20px;
  background-color: black;
  color: white;
  overflow-x: hidden;
  min-height: 950px;
}

.drama-list h1 {
  text-align: left;
  color: white;
  font-size: 19px;
  position: relative;
  left: 4%;
  margin-bottom: 20px;
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
  background-color: #d40000;
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

.drama-card {
  cursor: pointer;
  width: 220px;
  min-height: 400px;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
  background-color: #1e1e1e;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.6);
}

.drama-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.8);
}

.drama-poster {
  width: 100%;
  height: 320px;
  object-fit: cover;
  border-bottom: 2px solid #F50000;
}

.drama-info {
  padding: 15px;
  text-align: center;
  background-color: rgba(30, 30, 30, 0.9);
}

.drama-title {
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
