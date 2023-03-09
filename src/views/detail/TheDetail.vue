<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import DetailContent from './DetailContent.vue';
import DetailComment from './DetailComment.vue';
import ApplyPackageForm from '../add-package/ApplyPackageForm.vue';
import IconComments from '~icons/app/icon-comments.svg';
import { addSoftware, getSoftwareDetail } from '@/api/api-package';
import { useRoute } from 'vue-router';

const { t } = useI18n();
const route = useRoute();
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

// 详情数据
const detailData = ref<any>({});
const initData = () => {
  getDetail();
};
const getDetail = () => {
  getSoftwareDetail(route.params.id as string).then((res) => {
    const { data } = res;
    const _data = data || {};
    if (_data?.application) {
      _data.application.pkg_name = _data.pkg_name;
    }
    detailData.value = _data;
  });
};
watch(
  () => route.params.id,
  () => initData(),
  {
    immediate: true,
  }
);
</script>
<template>
  <AppContent>
    <OCard>
      <div class="card-header">
        <SwListItemContent :data="detailData">
          <template #title>
            <h1 class="title">{{ detailData.pkg_name }}</h1>
          </template>
        </SwListItemContent>
      </div>
      <div class="content-padding">
        <DetailContent v-if="!isModify" :data="detailData"></DetailContent>
        <ApplyPackageForm
          v-else
          :data="detailData?.application"
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
          <!-- <OButton
            v-if="!isModify"
            type="primary"
            size="small"
            @click="isModify = true"
          >
            {{ t('修改') }}
          </OButton> -->
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
      <div v-if="detailData?.comments?.length">
        <DetailComment
          v-for="comment in detailData?.comments"
          :key="comment.id"
          :data="comment"
        ></DetailComment>
      </div>
    </OCard>
  </AppContent>
</template>

<style scoped lang="scss">
.card-header {
  margin-bottom: var(--o-spacing-h4);
  padding-bottom: var(--o-spacing-h4);
  border-bottom: 1px solid var(--o-color-division1);
  .title {
    line-height: var(--o-line_height-display3);
  }
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
