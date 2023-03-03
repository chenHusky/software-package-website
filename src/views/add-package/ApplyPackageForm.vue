<script lang="ts" setup>
import SelectSigModal from './SelectSigModal.vue';
import { reactive, ref, watch } from 'vue';
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
      <el-form-item :rules="rules" :label="t('名称')" prop="pkg_name" required>
        <el-input
          v-model="form.pkg_name"
          :placeholder="t('请填写软件包名称')"
        ></el-input>
      </el-form-item>
      <el-form-item :rules="rules" :label="t('描述')" prop="desc" required>
        <el-input
          v-model="form.desc"
          :placeholder="t('请填写软件包简介')"
        ></el-input>
      </el-form-item>
      <el-form-item :label="t('目的')" prop="reason">
        <el-input
          v-model="form.reason"
          :placeholder="t('请填写引入目的，比如缺失某个依赖的软件包')"
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
          :placeholder="t('请填写源码地址，多个地址请用 ; 隔开')"
        ></el-input>
      </el-form-item>
      <el-form-item :rules="rules" :label="t('SIG')" prop="sig" required>
        <div class="select-btn">
          <el-input v-model="form.sig" :placeholder="t('请选择SIG')"></el-input>
          <OButton type="primary" size="small" @click="visible = true">{{
            t('选择sig组')
          }}</OButton>
        </div>
      </el-form-item>
      <el-form-item
        :rules="rules"
        :label="t('License')"
        prop="license"
        required
      >
        <el-input
          v-model="form.license"
          :placeholder="t('请选择License')"
        ></el-input>
      </el-form-item>
      <el-form-item :rules="rules" :label="t('平台')" prop="platform" required>
        <OSelect v-model="form.platform">
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
