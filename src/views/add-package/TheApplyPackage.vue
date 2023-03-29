<script lang="ts" setup>
import ApplyPackageForm from './ApplyPackageForm.vue';
import ClaModal from './ClaModal.vue';
import { useI18n } from 'vue-i18n';
import { getUserAuth, showGuard } from '@/shared/login';
import { addSoftware, getVerifyCla } from '@/api/api-package';
import { useLangStore } from '@/stores';
import { useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';

const { token } = getUserAuth();
const { t } = useI18n();
const router = useRouter();
const submit = (form: any) => {
  const param = {
    ...form,
  };
  addSoftware(param).then(() => {
    router.push(`/${useLangStore().lang}/package`);
  });
};
const cancel = () => {
  router.push(`/${useLangStore().lang}/package`);
};

onMounted(() => {
  hasCla();
});
const claVisble = ref(false);
const hasCla = () => {
  if (token) {
    getVerifyCla()
      .then((res) => {
        const { signed = false } = res?.data;
        claVisble.value = !signed;
      })
      .catch(() => {
        claVisble.value = true;
      });
  }
};
</script>
<template>
  <AppContent>
    <OCard>
      <h1>{{ t('software.SOFTWARE_PACKAGE') }}</h1>
      <NotFound v-if="!token">
        <template #title>
          <p>
            {{ t('common.PLEASE') }}
            <a @click="showGuard()">{{ t('common.LOGIN') }}</a> !
          </p>
        </template>
      </NotFound>
      <ApplyPackageForm
        v-else
        :form-from-uri="true"
        @submit="submit"
        @cancel="cancel"
      ></ApplyPackageForm>
    </OCard>
    <ClaModal v-model="claVisble"></ClaModal>
  </AppContent>
</template>

<style scoped lang="scss">
h1 {
  margin-bottom: 40px;
}
</style>
