<script setup lang="ts">
import IconAgree from '~icons/app/icon-agree.svg';
import IconAgreeGrey from '~icons/app/icon-agree-grey.svg';
import IconDisagree from '~icons/app/icon-disagree.svg';
import IconDisagreeGrey from '~icons/app/icon-disagree-grey.svg';
import { ref, toRefs } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { getReviewList, postReview } from '@/api/api-package';
import { useStoreData } from '@/shared/login';

const props = defineProps({
  list: {
    type: Array,
    default: () => [],
  },
  reviewers: {
    type: Array,
    default: () => [],
  },
  phase: {
    type: String,
    default: '',
  },
  importer: {
    type: String,
    default: '',
  },
});
const { list, reviewers, phase, importer } = toRefs(props);
const route = useRoute();
const { guardAuthClient } = useStoreData();
const { t } = useI18n();

const commentInputRefs = ref<any[]>([]);
const showReview = ref(false);
const reviewlist = ref([]);
const applyReview = () => {
  getReviewList(route.params.id as string).then((res) => {
    showReview.value = true;
    reviewlist.value = res.data;
  });
};

const clickAgreeBtn = (data: any, key: 'agree' | 'disagree') => {
  if (!data.row.can_review) {
    return;
  }
  if (!data.row.reviewed) {
    data.row.reviewed = true;
  } else if (data.row.pass === (key === 'agree')) {
    data.row.reviewed = false;
  }
  data.row.pass = key === 'agree';
  if (data.row.reviewed && !data.row.pass) {
    commentInputRefs.value[data.$index]?.focus();
  }
};

const emit = defineEmits(['submit']);

const submit = () => {
  let findError = false;
  const reviews = reviewlist.value.reduce((pre: any, next: any, index) => {
    if (next.can_review && next.reviewed) {
      const { comment = '', id = '', pass } = next;
      pre.push({
        comment,
        id,
        pass,
      });
      if (!findError && !pass && !comment) {
        // 选择不通过必须给评论
        findError = true;
        commentInputRefs.value[index]?.focus();
      }
    }
    return pre;
  }, []);
  if (findError) {
    return;
  }
  postReview(route.params.id as string, { reviews }).then(() => {
    showReview.value = false;
    emit('submit');
  });
};
</script>
<template>
  <div class="list-title">
    <div>
      <div>
        {{ t('software.REVIEWER') }}
        {{ reviewers?.length ? reviewers?.join(',') : t('software.NONE') }}
      </div>
      <div class="list-conditions">
        {{ t('software.REVIEWER_CONDITION') }}
      </div>
    </div>
    <div>
      <OButton
        v-if="
          phase === 'reviewing' &&
          guardAuthClient?.username &&
          guardAuthClient?.username !== importer &&
          !showReview
        "
        type="line"
        size="mini"
        @click="applyReview"
      >
        {{ t('software.REVIEW_APPLY') }}
      </OButton>
    </div>
  </div>
  <el-table :data="showReview ? reviewlist : list" class="list">
    <el-table-column :label="t('software.REVIEW_LIST_NUM')" width="80">
      <template #default="scope">
        <span>{{ scope.$index + 1 }}</span>
      </template>
    </el-table-column>
    <el-table-column
      :label="t('software.REVIEW_LIST_NAME')"
      width="180"
      prop="name"
    >
    </el-table-column>
    <el-table-column :label="t('software.REVIEW_LIST_DESC')" prop="desc">
    </el-table-column>
    <el-table-column label="Owner" width="180" prop="owner"> </el-table-column>
    <el-table-column
      v-if="!showReview"
      :label="t('software.REVIEW_LIST_RES')"
      width="180"
    >
      <template #default="scope">
        <div>
          <el-tooltip
            :disabled="scope.row.agree < 1"
            placement="top"
            effect="light"
          >
            <template #content>
              <div class="agree-tips">
                <template v-for="item in scope.row.reviews" :key="item.account">
                  <template v-if="item.pass">
                    <span>{{ item.account + ':' }}</span>
                    <span>{{ item.comment }}</span>
                  </template>
                </template>
              </div>
            </template>
            <a style="margin-right: 24px">{{
              t('software.REVIEW_LIST_AGREE') + scope.row.agree
            }}</a>
          </el-tooltip>
          <el-tooltip
            :disabled="scope.row.disagree < 1"
            placement="top"
            effect="light"
          >
            <template #content>
              <div class="agree-tips">
                <template v-for="item in scope.row.reviews" :key="item.account">
                  <template v-if="!item.pass">
                    <span>{{ item.account + ':' }}</span>
                    <span>{{ item.comment }}</span>
                  </template>
                </template>
              </div>
            </template>
            <a>{{ t('software.REVIEW_LIST_DISAGREE') + scope.row.disagree }}</a>
          </el-tooltip>
        </div>
      </template>
    </el-table-column>
    <el-table-column
      v-if="!showReview"
      :label="t('software.REVIEW_LIST_PASS')"
      width="80"
    >
      <template #default="scope">
        <OIcon>
          <IconAgree v-if="scope.row.has_result && scope.row.pass"></IconAgree>
          <IconDisagree
            v-else-if="scope.row.has_result && !scope.row.pass"
          ></IconDisagree>
        </OIcon>
      </template>
    </el-table-column>
    <el-table-column
      v-if="showReview"
      :label="t('software.REVIEW_LIST_PASS')"
      width="80"
    >
      <template #default="scope">
        <div class="agreeBtn">
          <OIcon
            :style="{
              cursor: scope.row.can_review ? 'pointer' : 'not-allowed',
            }"
            @click="clickAgreeBtn(scope, 'agree')"
          >
            <IconAgree
              v-if="
                scope.row.can_review && scope.row.reviewed && scope.row.pass
              "
            ></IconAgree>
            <IconAgreeGrey v-else></IconAgreeGrey>
          </OIcon>
          <OIcon
            :style="{
              cursor: scope.row.can_review ? 'pointer' : 'not-allowed',
            }"
            @click="clickAgreeBtn(scope, 'disagree')"
          >
            <IconDisagree
              v-if="
                scope.row.can_review && scope.row.reviewed && !scope.row.pass
              "
            ></IconDisagree>
            <IconDisagreeGrey v-else></IconDisagreeGrey>
          </OIcon>
        </div>
      </template>
    </el-table-column>
    <el-table-column
      v-if="showReview"
      :label="t('software.REVIEW_LIST_EVALUATE')"
      width="330"
    >
      <template #default="scope">
        <el-input
          :ref="(el) => (commentInputRefs[scope.$index] = el)"
          v-model="scope.row.comment"
          :rows="2"
          :autosize="{
            minRows: 1,
            maxRows: 4,
          }"
          :disabled="!scope.row.can_review"
          type="textarea"
          show-word-limit
          :maxlength="200"
          :class="
            scope.row.reviewed &&
            !scope.row.pass &&
            !scope.row.comment &&
            'error-input'
          "
          :placeholder="
            scope.row.reviewed && !scope.row.pass
              ? t('software.COMMENT_TIP')
              : ''
          "
        />
      </template>
    </el-table-column>
  </el-table>
  <div v-if="showReview" class="confirmBtn">
    <OButton type="primary" size="small" @click="submit">
      {{ t('software.CONFIRM') }}
    </OButton>
  </div>
  <hr style="margin-top: 32px" />
</template>
<style lang="scss" scoped>
.list-title {
  padding-top: 40px;
  padding-bottom: 40px;
  display: flex;
  justify-content: space-between;
  .list-conditions {
    margin-top: 40px;
  }
}
hr {
  margin-top: 24px;
}
.o-icon {
  font-size: 24px;
}
.agree-tips {
  font-size: 14px;
  display: grid;
  grid-template-columns: max-content max-content;
  column-gap: 8px;
  span {
    max-width: 300px;
    white-space: pre-wrap;
  }
}
.agreeBtn {
  display: flex;
  align-items: center;
  column-gap: 10px;
}
.confirmBtn {
  display: flex;
  justify-content: right;
  margin-top: 24px;
}
.error-input {
  :deep(.el-textarea__inner:not(:focus)) {
    box-shadow: 0 0 0 1px var(--o-color-error1) inset;
  }
}
.list {
  width: 100%;
  :deep(.cell) {
    word-break: break-word;
  }
}
</style>
