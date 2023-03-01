<script lang="ts" setup>

</script>
<template>
  <div class="content">
    <div class="title">
      <ProfilePhoto name="asdasd"></ProfilePhoto>
      <div>
        <div class="name">asdasd</div>
        <div class="time">1天前</div>
      </div>
    </div>
    <div class="text">参考 http://git.mydoc.io/?t=179267 注册Gitee账号。</div>
  </div>
</template>

<style scoped lang="scss">
.content {
  padding: var(--o-spacing-h5);
  border-bottom: 1px solid var(--o-color-division1);
  .title {
    padding-bottom: var(--o-spacing-h5);
    display: flex;
    align-items: center;
    font-size: var(--o-font-size-h7);
    gap: var(--o-spacing-h8);
    .name {
      font-size: var(--o-font-size-text);
      line-height: var(--o-line-height-text);
      color: var(--o-color-text1);
    }
    .time {
      font-size: var(--o-font-size-tip);
      line-height: var(--o-line-height-tip);
      color: var(--o-color-text4);
    }
  }
  .text {
    font-size: var(--o-font-size-text);
  }
}
</style>
