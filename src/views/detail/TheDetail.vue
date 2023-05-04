<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import DetailContent from './DetailContent.vue';
import DetailComment from './DetailComment.vue';
import CommentsModal from './CommentsModal.vue';
import ConfirmModal from './ConfirmModal.vue';
import FlowChart from './FlowChart.vue';
import ApplyPackageForm from '../add-package/ApplyPackageForm.vue';
import IconComments from '~icons/app/icon-comments.svg';
import {
  abandonSoftware,
  modifySoftware,
  approveSoftware,
  commentSoftware,
  getSoftwareDetail,
  rejectSoftware,
  rerunCI,
} from '@/api/api-package';
import { useRoute, useRouter } from 'vue-router';
import { useStoreData } from '@/shared/login';
import { useLangStore } from '@/stores';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const { guardAuthClient } = useStoreData();
const isModify = ref(false);

const lang = computed(() => {
  return useLangStore().lang;
});

const submit = (form: any) => {
  const param = {
    ...form,
  };
  modifySoftware(route.params.id as string, param).then(() => {
    Object.assign(detailData.value.application, form);
    isModify.value = false;
    initData();
  });
};
const cancel = () => {
  isModify.value = false;
};
const showTextarea = ref(false);

// 详情数据
const detailData = ref<any>({});
const initData = () => {
  getDetail();
};
const getDetail = () => {
  getSoftwareDetail(route.params.id as string)
    .then((res) => {
      const { data } = res;
      const _data = data || {};
      if (_data?.application) {
        _data.application.pkg_name = _data.pkg_name;
        _data.application.repo_link = _data.repo_link;
      }
      detailData.value = _data;
    })
    .catch((err) => {
      if (err?.response?.data?.code === 'software_pkg_not_found') {
        const language = lang.value === 'zh' ? 'zh' : 'en';
        router.push(`/${language}/package`);
      }
    });
};
watch(
  () => route.params.id,
  () => initData(),
  {
    immediate: true,
  }
);
let timer: NodeJS.Timer;
onMounted(() => {
  timer = setInterval(() => initData(), 30000);
});
onUnmounted(() => {
  clearInterval(timer);
});

const submitComment = (e: string) => {
  const params = {
    comment: e,
  };
  commentSoftware(route.params.id as string, params).then(() => {
    showTextarea.value = false;
    initData();
  });
};

const operateOption = computed(() => [
  {
    value: 'approve',
    label: t('software.APPROVE'),
    type: 'primary',
    tooltip: t('software.ONLY_TC_OPT'),
    disable: detailData.value.phase === 'creating_repo',
    visible:
      detailData.value.importer &&
      detailData.value.importer !== guardAuthClient.value.username &&
      detailData.value.ci_status !== 'ci-failed',
  },
  {
    value: 'reject',
    label: t('software.REJECT'),
    type: 'primary',
    tooltip: t('software.ONLY_TC_OPT'),
    disable: detailData.value.phase === 'creating_repo',
    visible:
      detailData.value.importer &&
      detailData.value.importer !== guardAuthClient.value.username,
  },
  {
    value: 'modify',
    label: t('software.MODIFY'),
    type: 'primary',
    disable: detailData.value.phase === 'creating_repo',
    visible:
      detailData.value.importer &&
      detailData.value.importer === guardAuthClient.value.username,
  },
  {
    value: 'restart',
    label: t('software.RESTART_CI'),
    type: 'primary',
    disable: detailData.value.phase === 'creating_repo',
    visible:
      detailData.value.importer &&
      detailData.value.importer === guardAuthClient.value.username,
  },
  {
    value: 'abandon',
    label: t('software.ABANDON'),
    type: '',
    disable: detailData.value.phase === 'creating_repo',
    visible:
      detailData.value.importer &&
      detailData.value.importer === guardAuthClient.value.username,
  },
]);
const operate = (
  key: 'approve' | 'reject' | 'abandon' | 'modify' | 'restart'
) => {
  const id = route.params.id as string;
  const eventObj = {
    approve: () => {
      approveSoftware(id).then(() => {
        initData();
      });
    },
    reject: () => {
      rejectSoftware(id).then(() => {
        initData();
      });
    },
    modify: () => {
      isModify.value = true;
    },
    restart: () => {
      rerunCI(id).then(() => {
        initData();
      });
    },
    abandon: () => {
      showConfirm.value = true;
    },
  };
  eventObj[key] && eventObj[key]();
};
const showConfirm = ref(false);
const submitConfirm = () => {
  const id = route.params.id as string;
  abandonSoftware(id).then(() => {
    initData();
  });
};
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
        <FlowChart :data="detailData.phase"></FlowChart>
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
        <div
          v-if="['reviewing'].includes(detailData.phase) && !isModify"
          class="btns"
        >
          <OButton type="primary" size="small" @click="showTextarea = true">
            {{ t('software.REPLY') }}
            <OIcon style="font-size: 20px"><IconComments></IconComments></OIcon>
          </OButton>
          <div class="operate">
            <template v-for="item in operateOption" :key="item.value">
              <el-tooltip
                :disabled="!item.tooltip"
                :content="item.tooltip"
                placement="top"
                effect="light"
              >
                <OButton
                  v-if="item.visible"
                  :type="item.type"
                  :disabled="item.disable"
                  size="small"
                  @click="!item.disable && operate(item.value as any)"
                >
                  {{ item.label }}
                </OButton>
              </el-tooltip>
            </template>
          </div>
        </div>
        <CommentsModal
          v-model="showTextarea"
          @submit="submitComment"
        ></CommentsModal>
        <ConfirmModal
          v-model="showConfirm"
          @submit="submitConfirm"
        ></ConfirmModal>
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
  display: flex;
  justify-content: space-between;
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
    .operate {
      display: flex;
      column-gap: var(--o-spacing-h5);
    }
  }
}
</style>
