<script lang="ts" setup>
import ApplyPackageForm from './ApplyPackageForm.vue';
import { useI18n } from 'vue-i18n';
import { modifySoftware, getSoftwareDetail } from '@/api/api-package';
import { useLangStore } from '@/stores';
import { useRouter, useRoute } from 'vue-router';
import { onMounted, ref } from 'vue';

const { t } = useI18n();
const router = useRouter();
const route = useRoute();

// 详情数据
const detailData = ref<any>(null);
const getDetail = () => {
  getSoftwareDetail(route.params.id as string)
    .then((res) => {
      const { data } = res;
      const _data = data || {};
      detailData.value = _data;
    })
    .catch((err) => {
      if (err?.response?.data?.code === 'software_pkg_not_found') {
        const language = useLangStore().lang === 'zh' ? 'zh' : 'en';
        router.push(`/${language}/package`);
      }
    });
};

const submit = (form: any) => {
  const param = {
    ...form,
  };
  modifySoftware(route.params.id as string, param).then(() => {
    cancel();
  });
};
const cancel = () => {
  router.push(`/${useLangStore().lang}/package-detail/${route.params.id}`);
};

onMounted(() => {
  getDetail();
});
</script>
<template>
  <AppContent>
    <OCard>
      <h1>{{ t('software.MODIFY_PACKAGE') }}</h1>
      <ApplyPackageForm
        :data="detailData"
        @submit="submit"
        @cancel="cancel"
      ></ApplyPackageForm>
    </OCard>
  </AppContent>
</template>

<style scoped lang="scss">
h1 {
  margin-bottom: 40px;
}
</style>
