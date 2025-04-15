<template>
  <div id="app">
    <HeaderComponent v-if="!hideHeader" />
    <router-view/>
    <FooterComponent v-if="!hideFooter" />
  </div>
</template>

<script>
import HeaderComponent from './components/Header.vue';
import FooterComponent from './components/Footer.vue';

export default {
  name: 'App',
  components: {
    HeaderComponent,
    FooterComponent,
  },
  computed: {
    hideHeader() {
      return this.$route.meta.hideHeader;
    },
    hideFooter() {
      return this.$route.meta.hideFooter;
    }
  },
  created() {
    const token = localStorage.getItem('token');
    if (token) {
      this.$store.commit('SET_LOGIN', true);
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  background-color: black;
  font-family: 'Inter', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}
</style>
