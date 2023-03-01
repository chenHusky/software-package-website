<script setup lang="ts">
import { getSigLandscape } from '@/api/api-sig';
import { GroupInfo } from '@/shared/@types/interface';
import { useLangStore } from '@/stores';
import { computed, toRefs, ref, watch, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
});
const { modelValue } = toRefs(props);
const emit = defineEmits(['update:modelValue', 'select']);

const close = () => {
  emit('update:modelValue', false);
};

function scrollClick(tab: any) {
  document.querySelector(`#${tab.props.name}`)?.scrollIntoView({
    behavior: 'smooth',
  });
}

const titleList = ref([
  {
    value: computed(() => {
      return t('sig.SIG_LANDSCAPE[0].CATEGORY_NAME');
    }),
    key: 'tech',
  },
  {
    value: computed(() => {
      return t('sig.SIG_LANDSCAPE[1].CATEGORY_NAME');
    }),
    key: 'operate',
  },
]);
const tabType = ref(titleList.value[0].key);
const landscapeInfo = ref<GroupInfo[]>([]);
const lang = computed(() => {
  return useLangStore().lang;
});
watch(
  () => lang.value,
  async (val) => {
    landscapeInfo.value = await getSigLandscape(val);
  }
);
onMounted(async () => {
  landscapeInfo.value = await getSigLandscape(lang.value);
});
const getSigValue = (val: string) => {
  emit('select', val);
};
</script>
<template>
  <ODialog v-model="modelValue" :before-close="close" :show-close="true">
    <h1 id="tech"></h1>
    <OTabs v-model="tabType" @tab-click="scrollClick">
      <OTab-pane
        v-for="item in titleList"
        :key="item.key"
        :label="item.value"
        :name="item.key"
      >
      </OTab-pane>
      <div
        v-for="(group, index) in landscapeInfo"
        :key="group.groupName"
        class="landscape-group"
      >
        <h1 :id="titleList[index].key"></h1>
        <SigLandscapeFeature
          :info="group?.features"
          @sig-click="getSigValue"
        ></SigLandscapeFeature>
      </div>
    </OTabs>
  </ODialog>
</template>
<style lang="scss">
.o-dialog {
  margin-top: 10vh;
  max-width: 1430px;
  width: 100%;
  .el-tabs__header {
    padding-top: 40px;
    position: sticky;
    top: 0;
    background-color: var(--o-color-bg2);
    z-index: 1;
  }
  .el-dialog__header {
    padding: 0;
  }
  .el-dialog__footer {
    padding: 0;
  }
  .el-dialog__headerbtn {
    top: var(--o-spacing-h2);
    right: var(--o-spacing-h2);
    font-size: var(--o-font-size-h5);
    width: fit-content;
    height: fit-content;
    z-index: 10;
    .el-dialog__close {
      color: var(--o-color-text1);
    }
  }
  .el-dialog__body {
    padding: var(--o-spacing-h2);
    padding-top: 0;
    max-height: 80vh;
    overflow-y: scroll;
    background-color: var(--o-color-bg2);
    &::-webkit-scrollbar-track {
      border-radius: 4px;
      background-color: var(--o-color-bg2);
    }

    &::-webkit-scrollbar {
      width: 6px;
      background-color: var(--o-color-bg2);
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 4px;
      background: var(--o-color-division1);
    }
  }
  .landscape-group {
    margin-top: var(--o-spacing-h2);
    overflow: hidden;
    h1 {
      &::before {
        content: '';
        display: block;
        height: 80px;
        margin-top: -80px;
        visibility: hidden;
      }
    }
  }
}
</style>
