import { createRouter, createWebHistory } from 'vue-router';
import SignUp from "../views/auth/SignUp.vue";
import SignIn from "../views/auth/SignIn.vue";
import JoinGame from "../views/home/join_game/JoinGame.vue";
import JoinGameFilter from "../views/home/join_game/JoinGameFilter.vue";
import CreateGame from "../views/home/CreateGame.vue";
import Home from "../views/home/Home.vue";
import PlayGame from "../views/home/PlayGame.vue";
import Inventory from "../views/inventory/Inventory.vue";
import ShowProfile from "../views/profile/ShowProfile.vue";
import ProfileRanking from "../views/ranking/ProfileRanking.vue";
import Ranking from "../views/ranking/Ranking.vue";
import BuyAttack from "../views/shop/BuyAttack.vue";
import CreateAttack from "../views/shop/CreateAttack.vue";
import SellAttack from "../views/shop/SellAttack.vue";
import Shop from "../views/shop/Shop.vue";
import Welcome from "../views/auth/Welcome.vue";

const routes = [
    {
        path: '/',
        name: 'welcome',
        component: Welcome
    },
    {
        path: '/signup',
        name: 'signup',
        component: SignUp
    },
    {
        path: '/signin',
        name: 'signin',
        component: SignIn
    },
    {
        path: '/joingame',
        name: 'joingame',
        component: JoinGame
    },
    {
        path: '/joingamefilter',
        name: 'joingamefilter',
        component: JoinGameFilter
    },
    {
        path: '/creategame',
        name: 'creategame',
        component: CreateGame
    },
    {
        path: '/home',
        name: 'home',
        component: Home
    },
    {
        path: '/playgame',
        name: 'playgame',
        component: PlayGame
    },
    {
        path: '/inventory',
        name: 'inventory',
        component: Inventory
    },
    {
        path: '/profile',
        name: '/profile',
        component: ShowProfile
    },
    {
        path: '/profileranking',
        name: 'profileranking',
        component: ProfileRanking
    },
    {
        path: '/ranking',
        name: 'ranking',
        component: Ranking
    },
    {
        path: '/buyattack',
        name: 'buyattack',
        component: BuyAttack
    },
    {
        path: '/createattack',
        name: 'createattack',
        component: CreateAttack
    },
    {
        path: '/sellattack',
        name: 'sellattack',
        component: SellAttack
    },
    {
        path: '/shop',
        name: 'shop',
        component: Shop
    }
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
});

export default router;