import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () =>
    import ('@/components/Login');
const Home = () =>
    import ('@/components/Home/Home')
const Welcome = () =>
    import ('@/components/Home/childComponents/Welcome')
const User = () =>
    import ('@/components/user/Users')
const Right = () =>
    import ('@/components/Power/Rights')
const Role = () =>
    import ('@/components/Power/Role')

Vue.use(VueRouter)

const routes = [{
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        component: Login
    },
    {
        path: '/home',
        component: Home,
        children: [{
                path: '/',
                redirect: 'Welcome'
            },
            {
                path: 'Welcome',
                component: Welcome
            },
            {
                path: 'users',
                component: User,
            },
            {
                path: 'rights',
                component: Right
            },
            {
                path: 'roles',
                component: Role
            },
        ]
    },
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

//路由导航，存储token
router.beforeEach((to, from, next) => {
    if (to.path === '/login') {
        return next();
    }
    const tokenStr = window.sessionStorage.getItem('token');
    if (!tokenStr) {
        return next('/login')
    } else {
        return next();
    }
})

export default router