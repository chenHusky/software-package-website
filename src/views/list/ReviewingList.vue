<script lang="ts" setup>
import { querySoftwareList } from '@/api/api-package';
import { useStoreData } from '@/shared/login';
import { ref, watch } from 'vue';

const props = defineProps({
  params: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  pageSizes: {
    type: Array<number>,
    default: [10, 20, 50, 100],
  },
});
const { guardAuthClient } = useStoreData();

const total = ref(0);
const listData = ref<any>([]);
const currentPage = ref(1);
const pageSize = ref(props.pageSizes[0]);
const sizeChange = () => {
  currentPage.value = 1;
  initData();
};
const initData = () => {
  const param = {
    count_per_page: pageSize.value,
    page_num: currentPage.value,
    phase: props.params.phase,
  };
  const obj: any = {};
  if (props.params.importer === 'mine') {
    obj['importer'] = guardAuthClient.value.username;
  }
  Object.assign(param, obj);
  querySoftwareList(param).then((res) => {
    const { data } = res;
    if (data instanceof Object) {
      const { pkgs = [], total: _total = 0 } = data;
      total.value = _total;
      listData.value = pkgs || [];
    }
  });
};
watch(
  () => props.params,
  () => initData(),
  {
    immediate: true,
    deep: true,
  }
);
</script>
<template>
  <div v-if="listData.length">
    <el-scrollbar class="Escrollbar">
      <div class="list">
        <SwListItem
          v-for="item in listData"
          :key="item.id"
          :data="item"
        ></SwListItem>
      </div>
    </el-scrollbar>
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      class="pagin"
      :page-sizes="pageSizes"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      :hide-on-single-page="true"
      @size-change="sizeChange"
      @current-change="initData"
    ></el-pagination>
  </div>
  <NotFound v-else></NotFound>
</template>

<style scoped lang="scss">
.list {
  display: grid;
  row-gap: 8px;
  max-height: 600px;
}
.pagin {
  margin-top: var(--o-gap-4);
  justify-content: center;
}
</style>
