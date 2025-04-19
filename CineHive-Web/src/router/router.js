import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/View/HomeView.vue';
import AuthView from "@/View/user/AuthView.vue";
import SocialLoginAdditionalInfo from "@/View/user/SocialLoginAdditionalInfoView.vue";
import SearchPage from "@/View/SearchView.vue";
import MovieDetail from "@/View/movie/MovieDetailView.vue";
import DramaDetail from "@/View/drama/DramaDetailView.vue";
import AnimationDetail from "@/View/animation/AnimationDetailView.vue";
import TopMovieDetail from "@/View/movie/TopMovieDetailView.vue";
import MovieList from "@/View/movie/MovieListView.vue";
import AnimationList from "@/View/animation/AnimationListView.vue";
import DramaList from "@/View/drama/DramaListView.vue";
import ReviewPage from '@/View/ReviewView.vue';
import CreateBoard from "@/View/board/CreateBoardView.vue";
import BoardList from "@/View/board/BoardListView.vue";
import DetailBoard from "@/View/board/DetailBoardView.vue";
import EditBoard from "@/View/board/EditBoardView.vue";

Vue.use(Router);

const routes = [
    {
        path: '/',
        component: Home
    },
    {
        path: '/auth',
        component: AuthView,
        meta: {hideHeader: true,
            hideFooter: true}},
    {
        path: '/additional-info',
        component: SocialLoginAdditionalInfo,
        meta: {hideHeader: true}
    },
    {
        path: '/search',
        component: SearchPage
    },
    {
        path: '/movie/:id',
        name: 'MovieDetail',
        component: MovieDetail,
        meta: {hideFooter: true}
    },
    {
        path: '/drama/:id',
        name: 'DramaDetail',
        component: DramaDetail,
        meta: {hideFooter: true}
    },
    {
        path: '/animation/:id',
        name: 'AnimationDetail',
        component: AnimationDetail,
        meta: {hideFooter: true}
    },
    {
        path: '/topmovies/:id',
        name: 'TopMovieDetail',
        component: TopMovieDetail,
        meta: {hideFooter: true}
    },
    {
        path: '/movies/:id/reviews',
        name: 'ReviewPage',
        component: ReviewPage
    },
    {
        path: '/movies',
        name: 'MovieList',
        component: MovieList,
        meta: {hideFooter: true}
    },
    {
        path: '/animations',
        name: 'AnimationList',
        component: AnimationList,
        meta: {hideFooter: true}
    },
    {
        path: '/dramas',
        name: 'DramaList',
        component: DramaList,
        meta: {hideFooter: true}
    },
    {
        path: '/create/board',
        name: 'CreateBoard',
        component: CreateBoard,
        meta: {hideFooter: true}
    },
    {
        path: '/boards',
        name: 'BoardList',
        component: BoardList,
        meta: {hideFooter: true}
    },
    {
        path: '/boards/detail/:id',
        name: DetailBoard,
        component: DetailBoard,
        meta: {hideFooter: true}
    },
    {
        path: '/boards/:id',
        name: EditBoard,
        component: EditBoard,
        meta: {hideFooter: true}
    }
];

const router = new Router({
    mode: 'history',
    routes,
});

export default router;