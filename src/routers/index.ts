import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { useLangStore } from '@/stores';

export const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/zh/package' },
  {
    path: '/zh/package',
    name: 'package',
    alias: '/en/package',
    component: () => import('@/views/TheSoftwarePackage.vue'),
  },
  {
    path: '/zh/apply-package',
    name: 'apply-package',
    alias: '/en/apply-package',
    component: () => import('@/views/add-package/TheApplyPackage.vue'),
  },
  {
    path: '/zh/package-detail/:id',
    name: 'package-detail',
    alias: '/en/package-detail/:id',
    component: () => import('@/views/detail/TheDetail.vue'),
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

router.beforeEach((to) => {
  // 设置语言
  const langStore = useLangStore();
  const lang = to.fullPath.startsWith('/en/') ? 'en' : 'zh';
  // localStorage.setItem('lang', lang);
  langStore.lang = lang;
});
