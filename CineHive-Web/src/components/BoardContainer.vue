
<template>
  <div class="board-container">
    <div class="board-header">
      <h2>게시판</h2>
    </div>

    <div class="board-posts">

          <div class="post-actions">
          </div>
        </div>
        <hr />
      </div>
</template>


<script setup>

</script>

<style scoped>
.board-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.board-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20px;
}

.board-header h2 {
  font-size: 24px;
}

.board-posts {
  padding-top: 20px;
}

.post {
  border-bottom: 1px solid #ccc;
  padding: 15px 0;
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.post-header h3 {
  font-size: 20px;
}

.post-actions button {
  margin-left: 10px;
  padding: 5px 10px;
  cursor: pointer;
}

.post-actions button:hover {
  background-color: #f0f0f0;
}
</style>