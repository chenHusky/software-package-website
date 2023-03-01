<script lang="ts" setup>
import { computed } from 'vue';

const props = defineProps({
  name: {
    type: String,
    default: '',
  },
});

const char = computed(() => props.name.slice(0, 1));
</script>
<template>
  <el-tooltip :content="name" placement="top" effect="light">
    <div class="char">
      <span>
        {{ char }}
      </span>
    </div>
  </el-tooltip>
</template>

<style scoped lang="scss">
.char {
  background-color: var(--o-color-brand1);
  width: 2em;
  height: 2em;
  border-radius: 50%;
  text-align: center;
  line-height: 2em;
  color: var(--o-color-white);
}
</style>
