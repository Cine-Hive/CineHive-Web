<template>
  <div class="board-list">
    <div class="board-list-title">자유 게시판</div>
    <div class="board-container">
      <div class="table-header">
        <div class="table-title" style="position: relative; left:-40%;">NO</div>
        <div class="table-title">닉네임</div>
        <div class="table-title">제목</div>
        <div class="table-title">작성일</div>
        <div class="table-title">좋아요</div>
        <div class="table-title" style="position: relative; left:40%;">조회수</div>
      </div>
      <ul>
        <li v-for="post in paginatedPosts" :key="post.id" class="post-item">
          <div class="post-info">
            <span class="post-id" style="position: relative; left:-45%;">{{ post.id }}</span>
            <span class="post-user" style="position: relative; left:-45%;">{{ post.memNickname }}</span>
            <span class="post-title" style="position: relative; left:-43%;">{{ post.brdTitle }}</span>
            <span class="post-date" style="position: relative; left:-130%;">{{ formatDate(post.brgRegDate) }}</span>
            <span class="like-count" style="position: relative; left:345%;">{{ post.likeCount }}</span>
            <span class="join-page-count" style="position: relative; left:345%;">{{ post.views }}</span>
            <span> </span>
          </div>
        </li>
      </ul>
      <button type="submit" class="btn btn-success" id="create-button" @click="goToCreatePost">글 작성</button>

      <form class="d-flex search-form" @submit.prevent="filterPosts">
        <input class="form-control search-input" type="text" v-model="searchQuery" placeholder="search..." aria-label="Search">
        <button type="submit" id="search-btn" class="btn btn-search">검색</button>
      </form>

      <div class="pagination">
        <div class="page-numbers">
          <button
              v-for="page in totalPages"
              :key="page"
              :class="{ active: currentPage === page }"
              @click="goToPage(page)"
              class="page-number-button"
          >
            {{ page }}
          </button>
        </div>
      </div>
      <span class="current-page">{{ currentPage }} / {{ totalPages }}</span>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'BoardList',
  data() {
    return {
      posts: [],
      currentPage: 1,
      postsPerPage: 10,
      selectedSort: '최신 순',
      searchQuery: '',
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.posts.length / this.postsPerPage);
    },
    paginatedPosts() {
      const start = (this.currentPage - 1) * this.postsPerPage;
      return this.posts.slice(start, start + this.postsPerPage);
    }
  },
  methods: {
    async fetchPosts() {
      try {
        const response = await axios.get('http://localhost:8081/boards');
        this.posts = response.data;
        console.log("전체 목록 조회 res",response);
      } catch (error) {
        console.error('게시글 목록 조회에 실패했습니다:', error);
      }
    },
    sortPosts(order) {
      this.selectedSort = order === 'latest' ? '최신 순' : order === 'oldest' ? '오래된 순' : '좋아요 순';
      if (order === 'latest') {
        this.posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } else if (order === 'oldest') {
        this.posts.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      } else if (order === 'likes') {
        this.posts.sort((a, b) => b.likeCount - a.likeCount);
      }
      this.currentPage = 1;
    },
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('ko-KR', options);
    },
    goToPage(page) {
      this.currentPage = page;
    },
    goToCreatePost() {
      if (this.$store.state.isLoggedIn) {
        // 로그인되어 있으면 작성 페이지로 이동
        this.$router.push({ path: '/create/board' });
      } else {
        // 로그인되어 있지 않으면 경고 메시지 표시
        alert('로그인 후 게시글을 작성할 수 있습니다.');
      }
    },
    filterPosts() {
      // 검색 필터링 로직 구현
      // 예: this.posts = this.posts.filter(post => post.title.includes(this.searchQuery));
    }
  },
  mounted() {
    this.fetchPosts(); // 컴포넌트가 마운트될 때 게시글 목록 가져오기
  }
};
</script>

<style scoped>
/* 스타일은 기존과 동일하게 유지 */
</style>


<style scoped>
.board-list {
  padding: 20px;
  width: 75%;
  margin: auto;
  border-radius: 10px;
  min-height: 1050px;
}
.board-list-title{
  color: white;
  position: relative;
  left:-45%;
  font-size: 18px;
}
h1 {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
  font-family: 'Arial', sans-serif;
}

.board-container {
  border-radius: 10px;
  padding: 20px;
  width: 100%;
  position: relative;
  top:50px;
}

.table-header {
  display: grid;
  grid-template-columns: 1fr 1fr 2fr 1fr 1fr 1fr;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 10px;
  color: #555555;
  font-size: 14px;
  font-weight: bolder;
}

.table-title {
  font-weight: bold;
  text-align: center;
}

ul {
  list-style-type: none;
  padding: 0;
}

.post-item {
  border-top: 1px solid #e0e0e0;
  margin: 15px 0;
  padding: 15px;
  transition: transform 0.2s;
  color: white;
  font-size: 13px;
  position: relative;
  top:10px;
}

.post-info {
  display: grid;
  grid-template-columns: 1fr 1fr 2fr 1fr;
  align-items: center;
}

.post-id,
.post-user,
.post-title,
.post-date {
  text-align: center;
  cursor: pointer;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
}

.current-page {
  margin: 0 15px;
  font-weight: bold;
  font-size: 16px;
}

.join-page-count{
  position: relative;
  top:-23px;
}
.page-numbers {
  display: flex;
  align-items: center;
}

.page-number-button {
  background-color: #f0f0f0;
  color: #333;
  border: 1px solid #e0e0e0;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  margin: 0 3px;
  transition: background-color 0.3s;
}

.page-number-button:hover {
  background-color: #007bff;
  color: white;
}

.page-number-button.active {
  background-color: #007bff;
  color: white;
}

#create-button {
  font-size: 12px;
  width: 80px;
  height: 33px;
  position: relative;
  float: right;
  background-color: #d95a15;
  border: #d95a15;
  color: white;
  border-radius: 3px;
}

#create-button:hover{
  cursor: pointer;
  background-color: chocolate;
}

.search-form {
  display: flex;
  justify-content: center;
  margin: 20px 0;
}

.search-input {
  width: 800px; /* 원하는 너비 조정 */
  padding: 10px;
  border-radius: 5px;
  font-size: 14px;
  transition: border-color 0.3s;
  background-color: #e0e0e0;
  border: #e0e0e0;
}

.search-input:focus {
  border-color: #007bff; /* 포커스 시 테두리 색상 변경 */
  outline: none; /* 기본 outline 제거 */
}

.btn-search {
  padding: 10px 15px;
  border: none;
  background-color: #e0e0e0;
  border: #e0e0e0;
  color: white; /* 버튼 글자 색상 */
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-search:hover {
  background-color: #0056b3; /* 버튼 호버 시 색상 변경 */
}


.like-count {
  position: relative;
  top: -23px;
}

.d-flex {
  width: 500px;
  margin: auto;
}

#search-btn {
  font-size: 13px;
  width: 90px;
  height: 40px;
  font-weight: bolder;
  position: relative;
  left:5px;
  background-color: #e0e0e0;
  border: #e0e0e0;
  color: black;
  border-radius: 5px;
  position: relative;

}

</style>
