<script setup lang="ts">
import notFoundImg from '@/assets/404.png';
import { useLangStore } from '@/stores';
const { lang } = useLangStore();
</script>

<template>
  <div class="nofound">
    <img class="nofound-img" :src="notFoundImg" alt="404" />
    <p class="nofound-text">
      <slot name="title">
        {{ lang === 'zh' ? '暂无数据' : 'No data available.' }}
      </slot>
    </p>
  </div>
</template>

<style lang="scss" scoped>
.nofound {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-size: var(--o-font-size-h6);
  color: var(--o-color-text1);
  .nofound-text {
    margin-top: var(--o-spacing-h5);
    font-size: var(--o-font-size-h7);
  }
  .nofound-img {
    height: 300px;
  }
  @media screen and (max-width: 768px) {
    padding-top: var(--o-spacing-h2);
    font-size: var(--o-font-size-text);
    .nofound-img {
      max-height: 232px;
    }
    .nofound-text {
      margin-top: var(--o-spacing-h6);
      font-size: var(--o-font-size-tip);
    }
  }
}
</style>
