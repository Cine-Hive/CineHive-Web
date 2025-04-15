<template>
  <div>
    <h1>Movies List</h1>
    <button @click="fetchMovies">Get Movies</button>
    <ul>
      <li v-for="movie in movies" :key="movie.id">
        {{ movie.title }} - {{ movie.overview }}
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      movies: [],
    };
  },
  methods: {
    fetchMovies() {
      axios
          .get('http://localhost:8080/save-movies')
          .then(response => {
            console.log(response.data);

            this.movies = response.data.results;
          })
          .catch(error => {
            console.error("There was an error fetching the movies:", error);
          });
    },
  },
};
</script>

<style scoped>

</style>
