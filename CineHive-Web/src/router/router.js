import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/View/HomePage.vue';
import AuthView from "@/View/user/AuthView.vue";
import SocialLoginAdditionalInfo from "@/View/user/SocialLoginAdditionalInfo.vue";
import SearchPage from "@/View/SearchPage.vue";
import MovieDetail from "@/View/movie/MovieDetail.vue";
import DramaDetail from "@/View/drama/DramaDetail.vue";
import AnimationDetail from "@/View/animation/AnimationDetail.vue";
import TopMovieDetail from "@/View/movie/TopMovieDetail.vue";
import MovieList from "@/View/movie/MovieList.vue";
import AnimationList from "@/View/animation/AnimationList.vue";
import DramaList from "@/View/drama/DramaList.vue";
import ReviewPage from '@/View/ReviewPage.vue';
import CreateBoard from "@/View/board/CreateBoard.vue";
import BoardList from "@/View/board/BoardList.vue";
import DetailBoard from "@/View/board/DetailBoard.vue";

Vue.use(Router);

const routes = [
    { path: '/', component: Home },
    { path: '/auth', component: AuthView, meta: { hideHeader: true, hideFooter: true } }, // 헤더와 푸터 숨기기
    { path: '/additional-info', component: SocialLoginAdditionalInfo, meta: {hideHeader: true} },
    { path: '/search', component: SearchPage },
    {path: '/movie/:id',
        name: 'MovieDetail',
        component: MovieDetail,
        meta: { hideFooter: true }},
    { path: '/drama/:id',  // 드라마 디테일 경로 추가
        name: 'DramaDetail',
        component: DramaDetail,
        meta: { hideFooter: true }},
    { path: '/animation/:id',  // 드라마 디테일 경로 추가
        name: 'AnimationDetail',
        component: AnimationDetail,
        meta: { hideFooter: true }},
    {path: '/topmovies/:id',
        name: 'TopMovieDetail',
        component: TopMovieDetail,
        meta: { hideFooter: true }},
    { path: '/movies/:id/reviews',
        name: 'ReviewPage',
        component: ReviewPage },
    {
        path: '/movies',
        name: 'MovieList',
        component: MovieList,
        meta: { hideFooter: true }
    },
    {
        path: '/animations',
        name: 'AnimationList',
        component: AnimationList,
        meta: { hideFooter: true }
    },
    {
        path: '/dramas',
        name: 'DramaList',
        component: DramaList,
        meta: { hideFooter: true }
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
    }
];

const router = new Router({
    mode: 'history',
    routes,
});

export default router;
