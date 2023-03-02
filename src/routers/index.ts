import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { useLangStore } from '@/stores';
import TheSoftwarePackage from '@/views/TheSoftwarePackage.vue';
import TheApplyPackage from '@/views/add-package/TheApplyPackage.vue';
import TheDetail from '@/views/detail/TheDetail.vue';

export const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/zh/package' },
  {
    path: '/zh/package',
    name: 'package',
    alias: '/en/package',
    component: TheSoftwarePackage,
  },
  {
    path: '/zh/apply-package',
    name: 'apply-package',
    alias: '/en/apply-package',
    component: TheApplyPackage,
  },
  {
    path: '/zh/package-detail/:id',
    name: 'package-detail',
    alias: '/en/package-detail',
    component: TheDetail,
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
  const lang = to.fullPath.includes('en') ? 'en' : 'zh';
  // localStorage.setItem('lang', lang);
  langStore.lang = lang;
});
