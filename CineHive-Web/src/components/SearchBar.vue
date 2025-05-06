<template>
  <div  class="search-bar">
    <input
        type="text"
        v-model="searchQuery"
        placeholder="search..."
        @keyup.enter="searchMovies"
    />
    <button @click="searchMovies">검색</button>
    <div v-if="loading" class="loading-overlay">
      <span>로딩 중...</span>
    </div>
  </div>

</template>
<script>
// axios는 직접 안 쓰니까 지워도 됨
// import axios from "axios";

import {mapActions} from "vuex";
// 전에 수정했던 searchResults 가져오는 함수 임포트!
import { fetchSearchResults } from '@/api/search'; // @/api/search 경로는 네 프로젝트 구조에 맞게 확인해줘!

export default {
  name: 'SearchBar',
  data() {
    return {
      searchQuery: "",
      loading: false,
    };
  },
  methods: {
    // updateSearchResults 액션은 그대로 씀.
    // 다만 넘겨주는 데이터 형태를 바꿔서 호출할 거임!
    ...mapActions(['updateSearchResults']),

    async searchMovies() {
      if (!this.searchQuery.trim()) {
        alert("검색어를 입력하세요!");
        return;
      }

      this.loading = true;

      try {
        // fetchSearchResults 함수 호출해서 전체 검색 결과 (하나의 배열 형태) 가져옴
        const rawResults = await fetchSearchResults(this.searchQuery);

        // 여기서 가져온 rawResults (하나의 배열)를 영화, 드라마, 애니메이션으로 분류!
        const classifiedResults = {
          movies: [],
          dramas: [], // 서버 응답에서 'tv'로 올 수도 있으니 'dramas'로 매핑할 예정
          animations: []
        };

        rawResults.forEach(item => {
          if (item.mediaType === 'movie') {
            classifiedResults.movies.push(item);
          } else if (item.mediaType === 'tv') { // 서버에서 TV 프로그램을 'tv'로 보낼 가능성 높음.
            classifiedResults.dramas.push(item); // 그걸 드라마로 분류
          } else if (item.mediaType === 'animation') {
            classifiedResults.animations.push(item);
          }
          // 그 외 다른 mediaType은 일단 무시
        });

        console.log("분류된 검색 결과:", classifiedResults); // 분류된 데이터 확인용 로그

        // 분류된 데이터를 Vuex 액션에 넘겨서 스토어 업데이트!
        // SearchView.vue가 예상하는 형식({ movies: [...], dramas: [...], animations: [...] })으로 넘겨줌
        this.updateSearchResults(classifiedResults);


        // 라우터 이동 로직은 그대로 유지
        const newRoute = `/search?q=${encodeURIComponent(this.searchQuery)}`;
        if (this.$route.fullPath !== newRoute) {
          this.$router.push(newRoute);
        }

      } catch (error) {
        console.error("검색 중 오류가 발생했습니다:", error);
        // 에러 났을 때 로딩 멈추는 것도 추가해주면 좋음
        this.loading = false; // 에러 발생 시 로딩 상태 해제
      } finally {
        // 성공/실패 여부와 상관없이 로딩 상태 해제 (try 블록 안에서도 해제했지만, finally에 두면 더 확실!)
        // this.loading = false; // 이미 try/catch 블록 안에 있으니 여기선 필요 없을 수도. 상황 봐서 추가/제거
      }
    }
  },
};
</script>
<style scoped>
.search-bar {
  flex: 1;
  text-align: left;
  margin: 0 20px;
  position: relative;
  top:-65px;
  left:100px;
  display: flex;
  justify-content: flex-start;
}

.search-bar input {
  width: 100%;
  max-width: 550px;
  padding: 10px;
  border: none;
  border-radius: 5px;
  background-color: #1a1a1a;
  color: white;
  outline: none;
  transition: border-color 0.3s;
  font-size: 14px;
}
@media (max-width: 768px) {
  .search-bar {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }

  .search-bar input {
    max-width: 100%;
    padding: 8px;
    font-size: 13px;
  }

  .search-bar button {
    max-width: 100%;
    padding: 8px 0;
    font-size: 14px;
  }
}
@media (max-width: 480px) {
  .search-bar {
    flex-direction: column;
    gap: 8px;
  }

  .search-bar input {
    max-width: 100%;
    padding: 8px;
    font-size: 12px;
  }

  .search-bar button {
    max-width: 100%;
    padding: 8px 0;
    font-size: 12px;
  }
}


@media (max-width: 768px) {
  .search-bar input {
    max-width: 100%;
    padding: 8px;
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .search-bar input {
    max-width: 100%;
    padding: 8px;
    font-size: 12px;
  }
}

.search-bar input::placeholder {
  color: #ccc;
}

.search-bar input:focus {
  border-color: #F50000;
}.search-bar button {
   background-color: #393636;
   color: white;
   border: none;
   padding: 10px 18px;
   border-radius: 5px;
   cursor: pointer;
   font-size: 13px;
   margin-left: 10px;
   transition: background-color 0.3s ease;
   position: relative;
   top: 1px;
 }

.search-bar button:hover {
  background-color: #555555;
}

.search-bar button:active {
  background-color: #990000;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  font-size: 20px;
}
</style>