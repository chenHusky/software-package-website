<script lang="ts" setup>
import IconUser from '~icons/app/icon-user.svg';
import IconCalendar from '~icons/app/icon-calendar.svg';

defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
});
const getCiStatus = (status: any) => {
  const ciStatus: any = {
    'ci-waiting': {
      color: '#1A9AFF',
    },
    'ci-running': {
      color: '#FEB32A',
    },
    'ci-passed': {
      color: '#6DC335',
    },
    'ci-failed': {
      color: '#F3524D',
    },
    'ci-timeout': {
      color: '#F3524D',
    },
  };
  return ciStatus[status] || '';
};
</script>

<template>
  <div>
    <div class="title">
      <h3 :title="data.pkg_name">
        <slot name="title">
          {{ data.pkg_name }}
        </slot>
      </h3>
      <div
        class="title-ci"
        :style="{ 'background-color': getCiStatus(data.ci_status).color }"
      >
        {{ data.ci_status?.toUpperCase() }}
      </div>
    </div>
    <div class="user">
      <OIcon class="icon"><IconUser></IconUser></OIcon>
      <div>{{ data.importer }}</div>
      <OIcon class="icon"><IconCalendar></IconCalendar></OIcon>
      <div>{{ data.applied_at }}</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.title {
  display: flex;
  align-items: center;
  gap: var(--o-spacing-h5);
  h3 {
    max-width: 1200px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .title-ci {
    padding: var(--o-spacing-h10) var(--o-spacing-h8);
    color: var(--o-color-text2);
    font-size: var(--o-font-size-text);
    line-height: var(--o-line-height-text);
  }
}
.user {
  margin-top: var(--o-spacing-h8);
  font-size: var(--o-font-size-tip);
  line-height: var(--o-line-height-tip);
  color: var(--o-color-neutral5);
  display: grid;
  align-items: center;
  grid-template-columns: max-content minmax(86px, max-content) repeat(
      4,
      max-content
    );
  gap: 8px;
  .icon {
    font-size: var(--o-font-size-h8);
  }
}
</style>
