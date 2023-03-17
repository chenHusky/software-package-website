<script lang="ts" setup>
import SelectSigModal from './SelectSigModal.vue';
import SelectLicenseModal from './SelectLicenseModal.vue';
import { onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { FormInstance, FormItemRule } from 'element-plus';
import { formValidator } from '@/shared/utils';
import { useRoute } from 'vue-router';

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
const licenseVisible = ref(false);
const formRef = ref<FormInstance>();
const typesList = [
  {
    label: 'Gitee',
    value: 'gitee',
  },
  {
    label: 'Github',
    value: 'github',
  },
];
const form = ref({
  desc: '',
  pkg_name: '',
  platform: 'gitee',
  reason: '',
  sig: '',
  license: '',
  source_code: '',
});
watch(
  () => props.data,
  (data) => {
    if (data) {
      Object.assign(form.value, data);
    }
  },
  { immediate: true }
);
onMounted(() => {
  setDefaultForm();
});

const setDefaultForm = () => {
  const query: any = route.query || {};
  if (props.formFromUri && Object.keys(query).length) {
    const keys = [
      'desc',
      'pkg_name',
      'platform',
      'reason',
      'sig',
      'license',
      'source_code',
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

const emits = defineEmits(['submit', 'cancel']);
const submit = (formEl: FormInstance | undefined) => {
  formValidator(formEl).subscribe((data) => {
    if (data) {
      emits('submit', form.value);
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
const selectLicense = (e: string) => {
  form.value.license = e;
  licenseVisible.value = false;
  formValidator(formRef.value, 'license').subscribe();
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
      <el-form-item
        class="fill-row"
        :rules="rules"
        :label="t('software.NAME')"
        prop="pkg_name"
        required
      >
        <el-input
          v-model="form.pkg_name"
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
        class="fill-row form-gap"
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
        class="form-gap"
        :rules="rules"
        :label="t('software.SOURCE_CODE')"
        prop="source_code"
        required
      >
        <el-input
          v-model="form.source_code"
          :placeholder="t('software.ENTER_SOURCE_CODE')"
        ></el-input>
      </el-form-item>
      <el-form-item
        class="form-gap"
        :rules="rules"
        :label="t('software.SOURCE_CODE_LICENSE')"
        prop="license"
        required
      >
        <div class="select-btn">
          <el-input
            v-model="form.license"
            :placeholder="t('software.ENTER_LICENSE')"
          ></el-input>
          <OButton type="primary" size="small" @click="licenseVisible = true">{{
            t('software.SELECT')
          }}</OButton>
        </div>
      </el-form-item>
      <el-form-item :rules="rules" label="SIG" prop="sig" required>
        <div class="select-btn">
          <el-input
            v-model="form.sig"
            :placeholder="t('software.ENTER_SIG')"
          ></el-input>
          <OButton type="primary" size="small" @click="visible = true">{{
            t('software.SELECT')
          }}</OButton>
        </div>
      </el-form-item>
      <el-form-item
        :rules="rules"
        :label="t('software.PLATFORM')"
        prop="platform"
        required
      >
        <OSelect v-model="form.platform" style="width: 100%">
          <ElOption
            v-for="item in typesList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </OSelect>
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
  <SelectSigModal v-model="visible" @select="selectSig"></SelectSigModal>
  <SelectLicenseModal
    v-model="licenseVisible"
    @select="selectLicense"
  ></SelectLicenseModal>
</template>

<style scoped lang="scss">
.form {
  display: grid;
  grid-template-columns: 50% 50%;
  .fill-row {
    grid-column-start: span 2;
  }
  .form-gap {
    margin-bottom: var(--o-gap-7);
  }
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
</style>
