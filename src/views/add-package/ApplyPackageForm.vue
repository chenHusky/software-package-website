<script lang="ts" setup>
import SelectSigModal from './SelectSigModal.vue';
import SelectLicenseModal from './SelectLicenseModal.vue';
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { FormInstance, FormItemRule } from 'element-plus';
import { formValidator } from '@/shared/utils';

const props = defineProps({
  // 传入默认值
  data: {
    type: Object,
    default: null,
  },
});
const { t } = useI18n();

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
// 空值校验
const requiredRules: FormItemRule[] = [
  {
    required: true,
    message: t('输入不能为空'),
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
        :label="t('名称')"
        prop="pkg_name"
        required
      >
        <el-input
          v-model="form.pkg_name"
          :placeholder="t('请填写软件包名称')"
        ></el-input>
      </el-form-item>
      <el-form-item
        class="fill-row"
        :rules="rules"
        :label="t('描述')"
        prop="desc"
        required
      >
        <el-input
          v-model="form.desc"
          :placeholder="t('请填写软件包简介')"
          :rows="2"
          type="textarea"
          maxlength="1000"
          show-word-limit
        ></el-input>
      </el-form-item>
      <el-form-item
        class="fill-row form-gap"
        :rules="rules"
        :label="t('目的')"
        prop="reason"
        required
      >
        <el-input
          v-model="form.reason"
          :placeholder="t('请填写引入目的，比如我希望引入此包')"
          :rows="2"
          maxlength="1000"
          show-word-limit
          type="textarea"
        ></el-input>
      </el-form-item>
      <el-form-item
        :rules="rules"
        :label="t('源码地址')"
        prop="source_code"
        required
      >
        <el-input
          v-model="form.source_code"
          :placeholder="t('请填写源码地址')"
        ></el-input>
      </el-form-item>
      <el-form-item
        :rules="rules"
        :label="t('License')"
        prop="license"
        required
      >
        <div class="select-btn">
          <el-input
            v-model="form.license"
            :placeholder="t('请选择License')"
          ></el-input>
          <OButton type="primary" size="small" @click="licenseVisible = true">{{
            t('选择License')
          }}</OButton>
        </div>
      </el-form-item>
      <el-form-item :rules="rules" :label="t('SIG')" prop="sig" required>
        <div class="select-btn">
          <el-input
            v-model="form.sig"
            :placeholder="t('请选择SIG，若没有请选择 other')"
          ></el-input>
          <OButton type="primary" size="small" @click="visible = true">{{
            t('选择sig组')
          }}</OButton>
        </div>
      </el-form-item>
      <el-form-item :rules="rules" :label="t('平台')" prop="platform" required>
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
        {{ t('提交申请') }}
      </OButton>
      <OButton class="btn" size="small" @click="cancel">
        {{ t('取消') }}
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
