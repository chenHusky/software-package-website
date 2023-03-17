<script lang="ts" setup>
import ApplyPackageForm from './ApplyPackageForm.vue';
import { useI18n } from 'vue-i18n';
import { getUserAuth, showGuard } from '@/shared/login';
import { addSoftware } from '@/api/api-package';
import { useLangStore } from '@/stores';
import { useRouter } from 'vue-router';

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
  </AppContent>
</template>

<style scoped lang="scss">
h1 {
  margin-bottom: 40px;
}
</style>
