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
import MyPage from "@/View/user/MyPage.vue";
import UserBookmarks from "@/View/user/UserBookmarks.vue";
import UserReplies from "@/View/user/UserReplies.vue";
import UserBoards from '@/View/user/UserBoards.vue'
import UserComments from '@/View/user/UserComments.vue';
import UserNameChange from "@/View/user/UserNameChange.vue";
import UserSexChange from "@/View/user/UserSexChange.vue";


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
    },
    {
        path: '/MyPage',
        name: MyPage,
        component: MyPage,
    },
    {
        path: '/mypage/bookmarks',
        name: UserBookmarks,
        component: UserBookmarks,
    },
    {
        path: '/mypage/replies',
        name: UserReplies,
        component: UserReplies,
    },
    {
        path: '/mypage/boards',
        name: UserBoards,
        component: UserBoards,
    },{
        path: '/mypage/comments',
        name: UserComments,
        component: UserComments,
    },{
        path: '/mypage/liked-boards',
        name: 'UserLikedBoards',
        component: () => import('@/View/user/UserBoardList.vue'),
        props: {
            title: '좋아요 누른 게시글',
            apiUrl: '/myPage/boardlikes',
            emptyMessage: '좋아요한 게시글이 없습니다.'
        }
    },
    {
        path: '/mypage/disliked-boards',
        name: 'UserDislikedBoards',
        component: () => import('@/View/user/UserBoardList.vue'),
        props: {
            title: '싫어요 누른 게시글',
            apiUrl: '/myPage/boarddislikes',
            emptyMessage: '싫어요한 게시글이 없습니다.'
        }
    },
    {
        path: '/mypage/bookmarked-boards',
        name: 'UserBookmarkedBoards',
        component: () => import('@/View/user/UserBookmarkedBoards.vue')
    },
    {
        path: '/mypage/password-change',
        name: 'UserPwChange',
        component: () => import('@/View/user/UserPwChange.vue')
    },
    {   path: '/mypage/name-change',
        name: 'UserNameChange',
        component: UserNameChange
    },
    {   path: '/mypage/sex-change',
        name: 'UserSexChange',
        component: UserSexChange
    },{
        path: '/mypage/liked-replies',
        name: 'UserLikedReplies',
        component: () => import('@/View/user/UserLikedReplies.vue')
    },
    {
        path: '/mypage/disliked-replies',
        name: 'UserDislikedReplies',
        component: () => import('@/View/user/UserDislikedReplies.vue')
    },
    {
        path: '/mypage/delete-account',
        name: 'UserDeleteAccount',
        component: () => import('@/View/user/UserDeleteAccount.vue')
    },


];

const router = new Router({
    mode: 'history',
    routes,
});

export default router;