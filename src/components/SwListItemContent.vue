<script lang="ts" setup>
import IconUser from '~icons/app/icon-user.svg';
import IconCalendar from '~icons/app/icon-calendar.svg';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
});

const { t } = useI18n();
</script>

<template>
  <div>
    <div class="title">
      <slot name="title">
        <h3>表头表头表头表头表头表头表头表头</h3>
      </slot>

      <SwTag> </SwTag>
    </div>
    <div class="user">
      <OIcon class="icon"><IconUser></IconUser></OIcon>
      <div>maintainer</div>
      <OIcon class="icon"><IconCalendar></IconCalendar></OIcon>
      <div>2020-04-23</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.title {
  display: flex;
  align-items: center;
  gap: var(--o-spacing-h5);
  h3 {
    font-size: var(--o-font-size-h7);
    line-height: var(--o-line-height-tip);
  }
  .tag {
    padding: var(--o-spacing-h10) var(--o-spacing-h8);
    color: var(--o-color-text2);
    font-size: var(--o-font-size-tip);
    line-height: var(--o-line-height-tip);
  }
}
.user {
  margin-top: var(--o-spacing-h8);
  font-size: var(--o-font-size-tip);
  line-height: var(--o-line-height-tip);
  color: var(--o-color-neutral5);
  display: grid;
  align-items: center;
  grid-template-columns: max-content 86px max-content max-content;
  gap: 8px;
  .icon {
    font-size: var(--o-font-size-h8);
  }
}
</style>
