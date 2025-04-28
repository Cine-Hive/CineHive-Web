<template>
  <div class="drama-list">

    <div class="dramas-section">
      <div class="search-guide">
        더 많은 드라마를 검색해 보실 수 있습니다.
      </div>

      <div class="search-bar">
        <input
            v-model="searchQuery"
            @keyup.enter="searchDramas"
            placeholder="드라마 제목을 입력하세요"
            class="search-input"
        />
        <button @click="searchDramas" class="search-button">검색</button>
      </div>

      <div v-if="dramas.length > 0" class="drama-grid">
        <div v-for="drama in dramas" :key="drama.id" class="drama-item">
          <div class="drama-card">
            <img
                v-if="drama.posterPath"
                :src="'https://image.tmdb.org/t/p/w300' + drama.posterPath"
                :alt="drama.name"
                class="drama-poster"
            />
            <p class="drama-title">{{ drama.name }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="drama-section-container">
      <div class="home-drama-title"><span style="color:red;">CINEHIVE</span>의 오늘의 드라마</div>
      <div class="drama-tabs">
        <button v-for="(dramas, category) in dramaCategories" :key="category"
                :class="{ active: selectedCategory === category }"
                @click="selectCategory(category)">
          {{ categoryNames[category] }}
        </button>
      </div>

      <div class="drama-content" v-if="selectedCategory">
        <div class="top-slider">
          <div class="drama-card" v-for="drama in dramaCategories[selectedCategory]" :key="drama.id"
               @click="goToDramaDetail(drama.id, selectedCategory)">
            <img :src="'https://image.tmdb.org/t/p/w300' + drama.posterPath" alt="drama poster" />
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { fetchDramas } from '@/api/tv/tvList';
import { fetchPopularTvSeries, fetchTopRatedTvSeries, fetchOnTheAirTvSeries, fetchAiringTodayTvSeries } from '@/api/tv/tv';

export default {
  name: 'DramaList',
  data() {
    return {
      mostPopularDrama: null,
      mostTopRatedDrama: null,
      mostOnAirDrama: null,
      mostAiringTodayDrama: null,
      dramaCategories: {
        popular: [],
        topRated: [],
        onAir: [],
        airingToday: []
      },
      selectedCategory: 'popular',
      categoryNames: {
        popular: '인기 드라마',
        topRated: '역대 평점 드라마',
        onAir: '방영 중인 드라마',
        airingToday: '오늘 방영 드라마'
      },
      searchQuery: '',
      dramas: [],
      page: 1,
    };
  },
  mounted() {
    this.loadDramas();
  },
  methods: {
    async loadDramas() {
      try {
        const popular = await fetchPopularTvSeries();
        const topRated = await fetchTopRatedTvSeries();
        const onAir = await fetchOnTheAirTvSeries();
        const airingToday = await fetchAiringTodayTvSeries();

        this.dramaCategories.popular = popular;
        this.dramaCategories.topRated = topRated;
        this.dramaCategories.onAir = onAir;
        this.dramaCategories.airingToday = airingToday;

        this.mostPopularDrama = popular[0] || null;
        this.mostTopRatedDrama = topRated[0] || null;
        this.mostOnAirDrama = onAir[0] || null;
        this.mostAiringTodayDrama = airingToday[0] || null;

      } catch (error) {
        console.error('드라마 데이터를 가져오는 중 오류가 발생했습니다:', error);
      }
    },
    selectCategory(category) {
      this.selectedCategory = category;
    },
    goToDramaDetail(dramaId, category) {
      const routeName = category === 'topRated' ? 'TopDramaDetail' : 'DramaDetail';
      this.$router.push({ name: routeName, params: { id: dramaId } });
    },
    async searchDramas() {
      if (!this.searchQuery.trim()) {
        alert('검색어를 입력해주세요.');
        return;
      }
      try {
        const data = await fetchDramas(this.searchQuery, this.page);
        this.dramas = data.results || [];
      } catch (error) {
        console.error('드라마 검색 중 오류 발생:', error);
      }
    },
  },
};
</script>

<style scoped>
.drama-list {
  padding: 40px 20px;
  background-color: black;
  min-height: 100vh;
  color: #ffffff;
  font-family: 'Noto Sans KR', sans-serif;
  overflow-x: hidden;
}

.dramas-section {
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
  left: -20px;
}

.search-button:hover {
  background: linear-gradient(135deg, #ff4b2b, #ff416c);
}


.drama-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 20px;
  justify-items: center;
  padding: 10px;
}

.drama-card {
  background-color: #1c1c1c;
  border-radius: 15px;
  padding: 15px;
  width: 160px;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.drama-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.3);
}

.drama-poster {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 15px;
}

.drama-title {
  font-size: 16px;
  font-weight: bold;
  color: #fff;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.drama-section-container {
  margin-top: 40px;
  background-color: black;
  padding: 20px;
  border-radius: 10px;
  color: white;
  width: 95%;
  margin: auto;
}
.drama-content {
  text-align: center;
}

.home-drama-title {
  text-align: left;
  font-size: 1.5rem;
  font-weight: bold;
  color: #dddddd;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
  margin-bottom: 24px;
}

.drama-title {
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

.drama-card {
  flex: 0 0 auto;
  width: 180px;
  cursor: pointer;
  transition: transform 0.3s ease-in-out;
}

.drama-card img {
  width: 100%;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(255, 255, 255, 0.2);
}

.drama-card:hover {
  transform: scale(1.1);
}

.drama-poster img {
  width: 200px;
  height: 300px;
  cursor: pointer;
  transition: transform 0.3s;
}

.drama-poster img:hover {
  transform: scale(1.1);
}

.drama-modal-content button {
  margin-top: 20px;
  padding: 10px;
  background-color: #1a1a1a;
  border: none;
  color: white;
  cursor: pointer;
  border-radius: 5px;
}

.drama-modal-content button:hover {
  background-color: #555;
}

.drama-tabs {
  display: flex;
  overflow-x: auto;
  white-space: nowrap;
  padding: 10px 0;
  border-bottom: 2px solid #444;
  scrollbar-width: none;
}

.drama-tabs::-webkit-scrollbar {
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
.drama-tabs button {
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
.drama-tabs button.active {
  color: white;
  font-weight: bold;
}

.ott-tabs button.active::after,
.drama-tabs button.active::after {
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
