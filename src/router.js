import { createRouter, createWebHashHistory } from 'vue-router';
import Dashboard from './components/Dashboard.vue';
//import LoginPage from './pages/LoginPage.vue';

const routes = [
    {
        path: '/',
        name: 'dashboard',
        component: Dashboard,
       // name: 'LoginPage',
        //component: LoginPage,
        // component:() => import('./pages/LoginPage.vue'),
    },
    {
        path:'/gunsonuayrinti',
        name: 'gunsonuayrinti',
        component:() => import('./components/GunSonuAyrinti.vue'),
        props:true ,
    },
    {
        path:'/gunsonulistele',
        name:'gunsonulistele',
        component:() => import('./pages/GunSonuListele.vue')
    },
    {
        path:'/gunsonutarihlistele',
        name:'gunsonuTarihlistele',
        component:() => import('./pages/GunSonuListeTarih')
    },
    {
        path: '/table',
        name: 'table',
        component: () => import('./components/TableDemo.vue'),
    },
    {
        path: '/chart',
        name: 'chart',
        component: () => import('./components/ChartDemo.vue'),
    },
    {
        path: '/display',
        name: 'display',
        component: () => import('./utilities/DisplayDemo.vue'),
    },
    {
        path: '/flexbox',
        name: 'flexbox',
        component: () => import('./utilities/FlexBoxDemo.vue'),
    },
    {
        path: '/text',
        name: 'text',
        component: () => import('./utilities/TextDemo.vue'),
    },
    {
        path: '/icons',
        name: 'icons',
        component: () => import('./utilities/Icons.vue'),
    },
    {
        path: '/grid',
        name: 'grid',
        component: () => import('./utilities/GridDemo.vue'),
    },
    {
        path: '/spacing',
        name: 'spacing',
        component: () => import('./utilities/SpacingDemo.vue'),
    },
    {
        path: '/elevation',
        name: 'elevation',
        component: () => import('./utilities/ElevationDemo.vue'),
    },
    {
        path: '/typography',
        name: 'typography',
        component: () => import('./utilities/Typography.vue'),
    },
    {
        path: '/crud',
        name: 'crud',
        component: () => import('./pages/CrudDemo.vue'),
    },
    {
        path: '/calendar',
        name: 'calendar',
        component: () => import('./pages/CalendarDemo.vue'),
    },
    {
        path: '/timeline',
        name: 'timeline',
        component: () => import('./pages/TimelineDemo.vue'),
    },
    {
        path: '/empty',
        name: 'empty',
        component: () => import('./components/EmptyPage.vue'),
    },
    // {
    //     path: '/documentation',
    //     name: 'documentation',
    //     component: () => import('./components/Documentation.vue'),
    // },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router;
