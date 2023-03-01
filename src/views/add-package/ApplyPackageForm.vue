<script lang="ts" setup>
import SelectSigModal from './SelectSigModal.vue';
import { reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { FormInstance, FormItemRule } from 'element-plus';
import { formValidator } from '@/shared/utils';

const { t } = useI18n();

const visible = ref(false);
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
const form = reactive({
  package_desc: '',
  package_name: '',
  package_platform: 'gitee',
  package_reason: '',
  package_sig: '',
  source_code_license: '',
  source_code_url: '',
});
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
      emits('submit', form);
    }
  });
};
const cancel = () => {
  emits('cancel');
};

const selectSig = (e: string) => {
  form.package_sig = e;
  visible.value = false;
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
        :rules="rules"
        :label="t('名称')"
        prop="package_name"
        required
      >
        <OInput
          v-model="form.package_name"
          :placeholder="t('请填写软件包名称')"
        ></OInput>
      </el-form-item>
      <el-form-item
        :rules="rules"
        :label="t('描述')"
        prop="package_desc"
        required
      >
        <OInput
          v-model="form.package_desc"
          :placeholder="t('请填写软件包简介')"
        ></OInput>
      </el-form-item>
      <el-form-item :label="t('目的')" prop="package_reason">
        <OInput
          v-model="form.package_reason"
          :placeholder="t('请填写引入目的，比如缺失某个依赖的软件包')"
        ></OInput>
      </el-form-item>
      <el-form-item
        :rules="rules"
        :label="t('源码地址')"
        prop="source_code_url"
        required
      >
        <OInput
          v-model="form.source_code_url"
          :placeholder="t('请填写源码地址，多个地址请用 ; 隔开')"
        ></OInput>
      </el-form-item>
      <el-form-item
        :rules="rules"
        :label="t('SIG')"
        prop="package_sig"
        required
      >
        <div class="select-btn">
          <OInput
            v-model="form.package_sig"
            :placeholder="t('请选择SIG')"
          ></OInput>
          <OButton type="primary" size="small" @click="visible = true">{{
            t('选择sig组')
          }}</OButton>
        </div>
      </el-form-item>
      <el-form-item
        :rules="rules"
        :label="t('License')"
        prop="source_code_license"
        required
      >
        <OInput
          v-model="form.source_code_license"
          :placeholder="t('请选择License')"
        ></OInput>
      </el-form-item>
      <el-form-item
        :rules="rules"
        :label="t('平台')"
        prop="package_platform"
        required
      >
        <OSelect v-model="form.package_platform">
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
</template>

<style scoped lang="scss">
.form {
  display: grid;
  grid-template-columns: 50% 50%;
}
.select-btn {
  display: grid;
  grid-template-columns: 1fr auto;
  width: 100%;
}
footer {
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
