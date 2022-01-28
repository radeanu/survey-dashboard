import Vue from 'vue';
import VueRouter from 'vue-router';
import Main from '~views/main';
import Dashboard from '~views/dashboard';
import { parseJwt } from '../shared/utils';

Vue.use(VueRouter);

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/login'),
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/',
    component: Main,
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: Dashboard,
        meta: {
          requiresAuth: true
        }
      },
      // {
      //   path: 'admin',
      //   name: 'SurveyAdmin',
      //   component: () => impor../components/suspended___app-survey-admin.vuevue'),
      //   meta: {
      //     requiresAuth: true,
      //     roles: ['admin']
      //   }
      // },
      {
        path: 'charts/:surveyId',
        name: 'SurveyCharts',
        component: () => import('../components/survey-module/bi-charts'),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: ':surveyId/:rowId?',
        name: 'FormView',
        component: () => import('../components/app-survey.vue'),
        meta: {
          requiresAuth: true
        }
      }
    ]
  },
  {
    path: '*',
    component: () => import('../views/notFound'),
    meta: {
      requiresAuth: true
    }
  }
];

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes
});


router.beforeEach(async (to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!Vue.$cookies.get('token') && from.name !== 'Login') {
      return router.push({ name: 'Login' });
    }
  }

  if (to.matched.some(record => record.meta.roles)) {
    const roles = to.meta.roles
    const token = Vue.$cookies.get('token');
    const userData = parseJwt(token);

    if (!roles.includes(userData.role)) {
      if(from.name !== 'Dashboard') {
        return router.push({ name: 'Dashboard' });
      }

      return;
    }
  }

  next();
});

export default router;
