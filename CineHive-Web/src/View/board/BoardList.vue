<template>
  <div class="board-list">

    <div class="board-container">
      <div class="table-header">
        <div class="table-title" >NO</div>
        <div class="table-title" >닉네임</div>
        <div class="table-title">제목</div>
        <div class="table-title">작성일</div>
        <div class="table-title">좋아요</div>
      </div>
      <div style="border-top: 1px solid #e0e0e0; position: relative; top:12px;"></div>
      <ul>
        <li v-for="post in paginatedPosts" :key="post.id" class="post-item">
          <div class="post-info">
            <span class="post-id" style="position: relative; left:-10%;">{{ post.id }}</span>
            <span class="post-user" style="position: relative; left:-25%;">{{ post.nickname }}</span>
            <span class="post-title" style="position: relative; left:-25%;">{{ post.title }}</span>
            <span class="post-date" style="position: relative; left:-75%;">{{ formatDate(post.createdAt) }}</span>
            <span class="like-count" style="position: relative; left:410%;">{{ post.likeCount }}</span>
          </div>
        </li>
      </ul>
      <button type="submit" class="btn btn-success" id="create-button" @click="goToCreatePost">글 작성</button>

      <form class="d-flex search-form" @submit.prevent="filterPosts">
        <input class="form-control search-input" type="text" v-model="searchQuery" placeholder="검색..." aria-label="Search">
        <button type="submit" id="search-btn" class="btn btn-search">검색
        </button>
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
export default {
  name: 'BoardList',
  data() {
    return {
      posts: [
        { id: 1, nickname: '홍길동', title: '영화 A 리뷰', createdAt: '2025-02-20', likeCount: 10 },
        { id: 2, nickname: '김철수', title: '영화 B 리뷰', createdAt: '2025-02-19', likeCount: 5 },
        // 추가적인 더미 데이터
      ],
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
    }
  }
};
</script>


<style scoped>
.board-list {
  padding: 20px;
  width: 90%;
  margin: auto;
  border-radius: 10px;
  min-height: 990px;
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
}

.table-header {
  display: grid;
  grid-template-columns: 1fr 1fr 2fr 1fr 1fr;
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
  color: #333333;
  font-size: 15px;
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
  width: 85px;
  height: 35px;
  position: relative;
  left: 45%;
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
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
  transition: border-color 0.3s;
}

.search-input:focus {
  border-color: #007bff; /* 포커스 시 테두리 색상 변경 */
  outline: none; /* 기본 outline 제거 */
}

.btn-search {
  padding: 10px 15px;
  border: none;
  background-color: #007bff; /* 버튼 배경 색상 */
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
  border: 2px solid #333333;
  color: #333333;
  background-color: white;
  border-radius: 5px;
  position: relative;
}

</style>
