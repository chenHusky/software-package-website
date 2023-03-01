<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import DetailContent from './DetailContent.vue';
import DetailComment from './DetailComment.vue';
import ApplyPackageForm from '../add-package/ApplyPackageForm.vue';
import IconComments from '~icons/app/icon-comments.svg';
import { addSoftware } from '@/api/api-package';

const { t } = useI18n();
const isModify = ref(false);

const submit = (form: any) => {
  const param = {
    ...form,
  };
  addSoftware(param).then(() => {
    isModify.value = false;
  });
};
const cancel = () => {
  isModify.value = false;
};

const textarea = ref('');
const showTextarea = ref(false);
</script>
<template>
  <AppContent>
    <OCard>
      <div class="card-header">
        <SwListItemContent>
          <template #title>
            <h1>asdasdasdasdad</h1>
          </template>
        </SwListItemContent>
      </div>
      <div class="content-padding">
        <DetailContent v-if="!isModify"></DetailContent>
        <ApplyPackageForm
          v-else
          @submit="submit"
          @cancel="cancel"
        ></ApplyPackageForm>
      </div>
      <div class="content-padding reply">
        <div class="btns">
          <OButton type="primary" size="small" @click="showTextarea = true">
            {{ t('回复') }}
            <OIcon style="font-size: 20px"><IconComments></IconComments></OIcon>
          </OButton>
          <OButton
            v-if="!isModify"
            type="primary"
            size="small"
            @click="isModify = true"
          >
            {{ t('修改') }}
          </OButton>
        </div>
        <div v-if="showTextarea" class="textarea">
          <el-input v-model="textarea" :rows="4" type="textarea" />
          <div class="textarea-btns">
            <OButton type="primary" size="small" @click="showTextarea = false">
              {{ t('确认') }}
            </OButton>
            <OButton @click="showTextarea = false">
              {{ t('取消') }}
            </OButton>
          </div>
        </div>
      </div>
      <DetailComment></DetailComment>
    </OCard>
  </AppContent>
</template>

<style scoped lang="scss">
.card-header {
  margin-bottom: var(--o-spacing-h4);
  padding-bottom: var(--o-spacing-h4);
  border-bottom: 1px solid var(--o-color-division1);
}
.content-padding {
  padding-left: var(--o-spacing-h5);
  padding-right: var(--o-spacing-h5);
}
.reply {
  padding-top: var(--o-spacing-h2);
  padding-bottom: var(--o-spacing-h5);
  border-bottom: 1px solid var(--o-color-division1);
  .btns {
    display: flex;
    justify-content: space-between;
  }
  .textarea {
    padding-top: var(--o-spacing-h5);
    .textarea-btns {
      display: flex;
      justify-content: center;
      gap: var(--o-spacing-h5);
      padding-top: var(--o-spacing-h5);
    }
  }
}
</style>
