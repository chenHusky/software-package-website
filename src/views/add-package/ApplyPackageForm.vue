<script lang="ts" setup>
// import SelectSigModal from './SelectSigModal.vue';
import SelectRepoModal from './SelectRepoModal.vue';
import IconTips from '~icons/app/icon-tips.svg';
import IconAgree from '~icons/app/icon-reload-checked.svg';
import IconDisagree from '~icons/app/icon-reload-unchecked.svg';
import { onMounted, ref, watch, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { FormInstance, FormItemRule } from 'element-plus';
import { formValidator } from '@/shared/utils';
import { useRoute } from 'vue-router';
import { cloneDeep } from 'lodash-es';
import { useLangStore } from '@/stores';
import { queryPersonalInfo } from '@/api/api-login';
import { checkCommitters } from '@/api/api-package';
import { refreshInfo } from '@/shared/login';

const props = defineProps({
  // 传入默认值
  data: {
    type: Object,
    default: null,
  },
  // 默认值从uri获取
  formFromUri: {
    type: Boolean,
    default: false,
  },
});
const { t } = useI18n();
const route = useRoute();

const visible = ref(false);
const formRef = ref<FormInstance>();
const typesList = computed(() => {
  return [
    {
      label: `https://gitee.com/src-openeuler/${form.value.pkg_name}`,
      value: 'gitee',
    },
    {
      label: `https://github.com/src-openeuler/${form.value.pkg_name}`,
      value: 'github',
    },
  ];
});
const form = ref({
  desc: '',
  pkg_name: '',
  repo_link: '',
  reason: '',
  sig: 'ecopkg',
  src_rpm_url: '',
  spec_url: '',
  upstream: '',
  committers: '',
});

// 重新下载勾选按钮
const isReloadUrl = ref({
  src_rpm_url: false,
  spec_url: false,
});
watch(
  () => props.data,
  (data) => {
    if (data) {
      const {
        desc,
        pkg_name,
        repo_link,
        reason,
        sig,
        srpm: { src: src_rpm_url },
        spec: { src: spec_url },
        upstream,
        committers,
        importer,
      } = data;
      const _committers = committers.filter(
        (item: string) => item !== importer
      );
      Object.assign(form.value, {
        desc,
        pkg_name,
        repo_link: getLinkValue(repo_link),
        reason,
        sig,
        src_rpm_url,
        spec_url,
        upstream,
        committers: _committers.join(','),
      });
    }
  },
  { immediate: true }
);

const getLinkValue = (label: string) => {
  if (label.startsWith('https://gitee.com/')) {
    return 'gitee';
  }
  return 'github';
};

onMounted(() => {
  setDefaultForm();
});

const setDefaultForm = () => {
  const query: any = route.query || {};
  if (props.formFromUri && Object.keys(query).length) {
    const keys = [
      'desc',
      'pkg_name',
      'repo_link',
      'reason',
      'src_rpm_url',
      'spec_url',
      'upstream',
    ];
    const params = keys.reduce((pre: any, next: any) => {
      if (query[next]) {
        pre[next] = query[next];
      }
      return pre;
    }, {});
    Object.assign(form.value, params);
  }
};
// 空值校验
const requiredRules: FormItemRule[] = [
  {
    required: true,
    message: t('software.NOT_EMPTY'),
    trigger: 'blur',
  },
];
const rules = ref(requiredRules);

const urlRules = ref<FormItemRule[]>([
  ...requiredRules,
  {
    type: 'url',
    message: t('software.ENTER_URL'),
    trigger: 'blur',
  },
]);
const getLinkLabel = () => {
  const findLink = typesList.value.find(
    (item) => item.value === form.value.repo_link
  );
  return findLink?.label;
};
const validatorCommitter = (rule: any, value: any): void | Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!value) {
      resolve();
      return;
    }
    if (!form.value.repo_link) {
      reject(t('software.COMMITTER_TIP_SELECT_REPO'));
      return;
    }
    const committers = value.split(',');
    if (committers.length > 2) {
      reject(t('software.COMMITTER_TIP_MAX'));
      return;
    }

    const param: any = {
      repo_link: getLinkLabel(),
      committers,
    };
    checkCommitters(param)
      .then((res) => {
        refreshInfo();
        if (res?.data?.invalid_committers === null) {
          resolve();
        } else {
          let str = '';
          committers.forEach((item: string) => {
            if (res.data.invalid_committers.includes(item)) {
              str += `${str && ','}${item}`;
            }
          });
          reject(t('software.COMMITTER_TIP_NOT', [str]));
        }
      })
      .catch((err: any) => {
        reject(err?.response?.data?.msg || err.message);
      });
  });
};
const committersRules = ref<FormItemRule[]>([
  {
    asyncValidator: validatorCommitter,
    trigger: 'none',
  },
]);

/**
 *  解决异步校验时，blur与按钮手动触发校验冲突，优先按钮触发
 * @param formEl 表单对象
 * @param field 需要校验的表单项key
 */
const asyncBlur = (formEl: FormInstance | undefined, field: string) => {
  setTimeout(() => {
    formEl?.validateField(field);
  }, 200);
};

const emits = defineEmits(['submit', 'cancel']);
const submit = (formEl: FormInstance | undefined) => {
  formValidator(formEl).subscribe((data) => {
    if (data) {
      const response: any = cloneDeep(form.value);
      if (Boolean(props.data)) {
        // 修改界面
        response.pkg_name = undefined;
        if (!isReloadUrl.value.src_rpm_url) {
          response.src_rpm_url = undefined;
        }
        if (!isReloadUrl.value.spec_url) {
          response.spec_url = undefined;
        }
      }
      emits(
        'submit',
        Object.assign(response, {
          committers: response.committers.split(','),
          repo_link: getLinkLabel(),
        })
      );
    }
  });
};
const cancel = () => {
  emits('cancel');
};

const selectSig = (e: string) => {
  form.value.sig = e;
  visible.value = false;
  formValidator(formRef.value, 'sig').subscribe();
};
const goSigCenter = () => {
  const uri = `https://www.openeuler.org/${useLangStore().lang}/sig/sig-list/`;
  window.open(uri, '_black');
};

// 选择link时判断是否有账号
const selectRepoVisible = ref(false);
const selectRepo = () => {
  queryPersonalInfo().then((res) => {
    if (
      res.data?.identities?.some(
        (item: any) => item.identity === form.value.repo_link
      )
    ) {
      return;
    } else {
      selectRepoVisible.value = true;
    }
  });
};
</script>
<template>
  <div>
    <el-form
      ref="formRef"
      class="form"
      label-position="right"
      label-width="auto"
      :inline="true"
      :model="form"
    >
      <el-form-item class="fill-row" :rules="rules" prop="pkg_name" required>
        <template #label>
          <div class="platform-label">
            <span>{{ t('software.NAME') }}</span>
            <el-tooltip placement="top" effect="light">
              <template #content>
                <span style="font-size: 14px">
                  {{ t('software.NAME_TIPS') }}
                </span>
              </template>
              <OIcon style="font-size: 18px">
                <IconTips></IconTips>
              </OIcon>
            </el-tooltip>
          </div>
        </template>
        <el-input
          v-model="form.pkg_name"
          :disabled="Boolean(props.data)"
          :placeholder="t('software.ENTER_NAME')"
        ></el-input>
      </el-form-item>
      <el-form-item
        class="fill-row"
        :rules="rules"
        :label="t('software.DESC')"
        prop="desc"
        required
      >
        <el-input
          v-model="form.desc"
          :placeholder="t('software.ENTER_DESC')"
          :rows="2"
          type="textarea"
          maxlength="1000"
          show-word-limit
        ></el-input>
      </el-form-item>
      <el-form-item
        class="fill-row"
        :rules="rules"
        :label="t('software.REASON')"
        prop="reason"
        required
      >
        <el-input
          v-model="form.reason"
          :placeholder="t('software.ENTER_REASON')"
          :rows="2"
          maxlength="1000"
          show-word-limit
          type="textarea"
        ></el-input>
      </el-form-item>
      <el-form-item
        class="fill-row form-gap"
        :rules="urlRules"
        :label="t('software.UPSTREAM_URL')"
        prop="upstream"
        required
      >
        <div class="select-btn">
          <el-input
            v-model="form.upstream"
            :placeholder="t('software.ENTER_UPSTREAM_URL')"
          ></el-input>
        </div>
      </el-form-item>
      <div class="fill-row mid-block">
        <el-form-item
          class="fill-row"
          :rules="urlRules"
          :label="t('software.SOURCE_CODE')"
          prop="spec_url"
          required
        >
          <div class="input-url">
            <el-input
              v-model="form.spec_url"
              :disabled="Boolean(props.data)"
              :placeholder="t('software.ENTER_SOURCE_CODE')"
            ></el-input>
            <div v-if="Boolean(props.data)" class="reload-url">
              {{ t('software.RELOAD_SPEC') }}
              <OIcon @click="isReloadUrl.spec_url = !isReloadUrl.spec_url">
                <IconAgree v-if="isReloadUrl.spec_url"></IconAgree>
                <IconDisagree v-else></IconDisagree>
              </OIcon>
            </div>
          </div>
        </el-form-item>
        <el-form-item
          class="fill-row"
          :rules="urlRules"
          :label="t('software.SOURCE_CODE_LICENSE')"
          prop="src_rpm_url"
          required
        >
          <div class="input-url">
            <el-input
              v-model="form.src_rpm_url"
              :disabled="Boolean(props.data)"
              :placeholder="t('software.ENTER_LICENSE')"
            ></el-input>
            <div v-if="Boolean(props.data)" class="reload-url">
              {{ t('software.RELOAD_SRPM') }}
              <OIcon
                @click="isReloadUrl.src_rpm_url = !isReloadUrl.src_rpm_url"
              >
                <IconAgree v-if="isReloadUrl.src_rpm_url"></IconAgree>
                <IconDisagree v-else></IconDisagree>
              </OIcon>
            </div>
          </div>
        </el-form-item>
      </div>
      <el-form-item :rules="rules" prop="sig" required>
        <template #label>
          <div class="platform-label">
            <span>SIG</span>
            <el-tooltip placement="top" effect="light">
              <template #content>
                <span style="font-size: 14px">
                  {{ t('software.SIG_TIPS') }}
                  <a @click="goSigCenter">{{ t('software.SIG_CENTER') }}</a>
                </span>
              </template>
              <OIcon style="font-size: 18px">
                <IconTips></IconTips>
              </OIcon>
            </el-tooltip>
          </div>
        </template>
        <div class="select-btn">
          <el-input
            v-model="form.sig"
            disabled
            :placeholder="t('software.ENTER_SIG')"
          ></el-input>
          <!-- <OButton type="primary" size="small" @click="visible = true">{{
            t('software.SELECT')
          }}</OButton> -->
        </div>
      </el-form-item>
      <el-form-item
        :rules="rules"
        prop="repo_link"
        :label="t('software.REPO_LINK')"
        required
      >
        <OSelect
          v-model="form.repo_link"
          style="width: 100%"
          @change="selectRepo()"
        >
          <ElOption
            v-for="item in typesList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </OSelect>
      </el-form-item>
      <el-form-item
        class="fill-row"
        :rules="committersRules"
        label="Committers"
        prop="committers"
      >
        <el-input
          v-model="form.committers"
          :placeholder="t('software.ENTER_COMMITTERS', [form.repo_link])"
          @blur="asyncBlur(formRef, 'committers')"
        ></el-input>
      </el-form-item>
    </el-form>
    <footer>
      <OButton class="btn" type="primary" size="small" @click="submit(formRef)">
        {{ t('software.SUBMIT') }}
      </OButton>
      <OButton class="btn" size="small" @click="cancel">
        {{ t('software.CANCEL') }}
      </OButton>
    </footer>
  </div>
  <!-- <SelectSigModal v-model="visible" @select="selectSig"></SelectSigModal> -->
  <SelectRepoModal
    v-model="selectRepoVisible"
    :type="form.repo_link"
    @close="form.repo_link = ''"
  ></SelectRepoModal>
</template>

<style scoped lang="scss">
.form {
  display: grid;
  grid-template-columns: 50% 50%;
  .fill-row {
    grid-column-start: span 2;
  }
  .form-gap {
    margin-bottom: var(--o-gap-5);
  }
}
.mid-block {
  display: grid;
  background-color: var(--o-color-bg3);
  margin-bottom: var(--o-gap-5);
  padding-top: 18px;
}
.select-btn {
  display: grid;
  grid-template-columns: 1fr auto;
  width: 100%;
}
footer {
  padding-top: var(--o-gap-7);
  display: flex;
  justify-content: center;
  gap: var(--o-spacing-h4);
  .btn {
    width: 120px;
    display: flex;
    justify-content: center;
  }
}
.platform-label {
  display: flex;
  align-items: center;
  column-gap: 4px;
}
.input-url {
  width: 100%;
  display: grid;
  grid-template-columns: auto max-content;
  .reload-url {
    display: flex;
    align-items: center;
    margin-left: 24px;
    column-gap: 8px;
    .o-icon {
      font-size: 20px;
      cursor: pointer;
    }
    &::before {
      content: '*';
      color: var(--el-color-danger);
      margin-right: 4px;
    }
  }
}
</style>
