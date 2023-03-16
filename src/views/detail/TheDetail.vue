<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import DetailContent from './DetailContent.vue';
import DetailComment from './DetailComment.vue';
import CommentsModal from './CommentsModal.vue';
import ApplyPackageForm from '../add-package/ApplyPackageForm.vue';
import IconComments from '~icons/app/icon-comments.svg';
import {
  abandonSoftware,
  addSoftware,
  approveSoftware,
  commentSoftware,
  getSoftwareDetail,
  rejectSoftware,
} from '@/api/api-package';
import { useRoute } from 'vue-router';
import { useStoreData } from '@/shared/login';

const { t } = useI18n();
const route = useRoute();
const { guardAuthClient } = useStoreData();
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
    initData();
  });
};

const operateDropdown = ref();
const showOperate = () => {
  operateDropdown.value.handleOpen();
};
const operateOption = computed(() => [
  {
    value: 'approve',
    label: t('software.APPROVE'),
    visible: true,
  },
  {
    value: 'reject',
    label: t('software.REJECT'),
    visible: true,
  },
  {
    value: 'abandon',
    label: t('software.ABANDON'),
    visible:
      detailData.value.importer &&
      detailData.value.importer === guardAuthClient.value.username,
  },
]);
const operate = (key: 'approve' | 'reject' | 'abandon') => {
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
    abandon: () => {
      abandonSoftware(id).then(() => {
        initData();
      });
    },
  };
  eventObj[key] && eventObj[key]();
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
            {{ t('software.REPLY') }}
            <OIcon style="font-size: 20px"><IconComments></IconComments></OIcon>
          </OButton>
          <el-dropdown
            ref="operateDropdown"
            trigger="contextmenu"
            @command="operate"
          >
            <OButton type="primary" size="small" @click="showOperate">
              {{ t('software.OPERATE') }}
            </OButton>
            <template #dropdown>
              <el-dropdown-menu>
                <template v-for="item in operateOption" :key="item.value">
                  <el-dropdown-item v-if="item.visible" :command="item.value">
                    <div style="width: 80px; text-align: center">
                      {{ item.label }}
                    </div>
                  </el-dropdown-item>
                </template>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        <CommentsModal
          v-model="showTextarea"
          @submit="submitComment"
        ></CommentsModal>
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
}
.operate-option {
  width: 100px;
}
</style>
