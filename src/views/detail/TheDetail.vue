<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import DetailContent from './DetailContent.vue';
import DetailComment from './DetailComment.vue';
import DetailOperationLog from './DetailOperationLog.vue';
import ConfirmModal from './ConfirmModal.vue';
import CheckList from './CheckList.vue';
import FlowChart from './FlowChart.vue';
import {
  abandonSoftware,
  commentSoftware,
  getSoftwareDetail,
  getComments,
  rerunCI,
} from '@/api/api-package';
import { queryPersonalInfo } from '@/api/api-login';
import { queryTCSigs } from '@/api/api-sig';
import { useRoute, useRouter } from 'vue-router';
import { useStoreData } from '@/shared/login';
import { useLangStore } from '@/stores';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const { guardAuthClient } = useStoreData();

const lang = computed(() => {
  return useLangStore().lang;
});

// 展示关闭按钮
const isTCMember = ref(false);
const findTC = async () => {
  if (!guardAuthClient.value.username) {
    // 未登录不展示
    isTCMember.value = false;
    return;
  }

  // TC具有关闭功能
  const res = await queryPersonalInfo();
  const user = res?.data?.identities?.find(
    (item: any) => item.identity === 'gitee'
  );
  if (!user?.user_name) {
    // 没有gitee账号
    isTCMember.value = false;
    return;
  }
  const allTC = await queryTCSigs();

  const isTC = allTC?.data?.some((item: any) => {
    return item.user === user?.user_name;
  });

  isTCMember.value = isTC;
};

// 详情数据
const detailData = ref<any>({});
const commentsData = ref<any>([]);
const initData = () => {
  getDetail();
  getDetailComments();
};
const getDetail = () => {
  getSoftwareDetail(route.params.id as string)
    .then((res) => {
      const { data } = res;
      const _data = data || {};
      detailData.value = _data;
    })
    .catch((err) => {
      if (err?.response?.data?.code === 'software_pkg_not_found') {
        const language = lang.value === 'zh' ? 'zh' : 'en';
        router.push(`/${language}/package`);
      }
    });
};
const getDetailComments = () => {
  getComments(route.params.id as string).then((res) => {
    const { data } = res;
    const _data = data || [];
    commentsData.value = _data;
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
  findTC();
  timer = setInterval(() => initData(), 30000);
});
onUnmounted(() => {
  clearInterval(timer);
});

const commentData = ref('');
const submitComment = () => {
  if (commentData.value) {
    const params = {
      comment: commentData.value,
    };
    commentSoftware(route.params.id as string, params).then(() => {
      commentData.value = '';
      getDetailComments();
    });
  }
};

const operateOption = computed(() => [
  {
    value: 'rerunci',
    label: t('software.RESTART_CI'),
    type: 'line',
    visible:
      detailData.value.importer &&
      detailData.value.importer === guardAuthClient.value.username,
  },
  {
    value: 'update',
    label: t('software.MODIFY'),
    type: 'line',
    visible:
      detailData.value.importer &&
      detailData.value.importer === guardAuthClient.value.username,
  },
]);
const operate = (key: 'update' | 'rerunci') => {
  const id = route.params.id as string;
  const eventObj = {
    update: () => {
      router.push(`/${lang.value}/modify-package/${route.params.id}`);
    },
    rerunci: () => {
      rerunCI(id).then(() => {
        getDetail();
      });
    },
  };
  eventObj[key] && eventObj[key]();
};
const showConfirm = ref(false);
const submitConfirm = () => {
  const id = route.params.id as string;
  const params = {
    comment: commentData.value,
  };
  abandonSoftware(id, params).then(() => {
    commentData.value = '';
    getDetail();
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
      <div class="pkg-detail">
        <DetailContent :data="detailData"></DetailContent>
        <div class="reply">
          <div v-if="['reviewing'].includes(detailData.phase)" class="btns">
            <template v-for="item in operateOption" :key="item.value">
              <OButton
                v-if="item.visible"
                :type="item.type"
                size="mini"
                @click="operate(item.value as any)"
              >
                {{ item.label }}
              </OButton>
            </template>
          </div>
        </div>
      </div>
      <hr />
      <CheckList
        v-if="detailData?.reviews?.items?.length"
        :list="detailData?.reviews?.items"
        :reviewers="detailData?.reviews?.reviewers"
        :phase="detailData.phase"
        :importer="detailData.importer"
        @submit="getDetail"
      ></CheckList>
      <div v-if="detailData?.logs?.length">
        <DetailOperationLog :data="detailData?.logs"></DetailOperationLog>
      </div>
      <div v-if="commentsData?.length">
        <DetailComment
          v-for="comment in commentsData"
          :key="comment.id"
          :data="comment"
        ></DetailComment>
      </div>
      <div
        v-if="['reviewing'].includes(detailData.phase)"
        style="margin-top: 32px"
      >
        <h3 style="margin-bottom: 16px">{{ t('software.REPLY') }}</h3>
        <el-input
          v-model="commentData"
          :rows="4"
          type="textarea"
          show-word-limit
          :maxlength="2000"
        />
        <div class="close">
          <OButton
            v-if="
              (detailData.importer &&
                detailData.importer === guardAuthClient.username) ||
              isTCMember
            "
            type="error"
            size="mini"
            @click="showConfirm = true"
          >
            {{ t('software.CLOSE_PACKAGE') }}
          </OButton>
          <OButton type="line" size="mini" @click="submitComment">
            {{ t('software.REPLY') }}
          </OButton>
        </div>
      </div>
    </OCard>
    <ConfirmModal v-model="showConfirm" @submit="submitConfirm"></ConfirmModal>
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
.pkg-detail {
  display: grid;
  grid-template-columns: auto max-content;
  padding-bottom: 40px;
  .btns {
    display: flex;
    justify-content: right;
    column-gap: 24px;
  }
}
.close {
  padding-top: var(--o-spacing-h3);
  padding-bottom: var(--o-spacing-h5);
  display: flex;
  justify-content: right;
  column-gap: var(--o-spacing-h5);
}
</style>
