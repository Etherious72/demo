<template>
  <header class="app-header">
    <div class="app-header__inner">
      <t-button
        v-if="showBack"
        theme="default"
        variant="text"
        shape="square"
        :icon="ChevronLeftIcon"
        class="app-header__back"
        @click="goBack"
      />
      <div class="app-header__title">
        <span class="app-header__title-main">{{ resolvedTitle }}</span>
        <span v-if="resolvedSubtitle" class="app-header__title-sub">{{ resolvedSubtitle }}</span>
      </div>
      <div class="app-header__right">
        <slot name="right" />
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ChevronLeftIcon } from 'tdesign-icons-vue-next';

const props = defineProps({
  title: { type: String, default: '吃喝玩乐随机决策' },
  subtitle: { type: String, default: '' }
});

const route = useRoute();
const router = useRouter();

const showBack = computed(() => route.name !== 'home');
const resolvedTitle = computed(() => route?.meta?.title || props.title);
const resolvedSubtitle = computed(() => route?.meta?.subtitle || props.subtitle);

function goBack() {
  router.back();
}
</script>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--color-border-light);
}

.app-header__inner {
  max-width: 680px;
  margin: 0 auto;
  padding: 12px 16px;
  display: grid;
  grid-template-columns: 40px 1fr auto;
  gap: 8px;
  align-items: center;
}

.app-header__back {
  color: var(--color-text-secondary) !important;
}

.app-header__back:hover {
  color: var(--color-primary) !important;
  background: var(--color-primary-light) !important;
}

.app-header__title {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.app-header__title-main {
  font-size: 17px;
  font-weight: 600;
  color: var(--color-text);
  letter-spacing: -0.02em;
  line-height: 1.25;
}

.app-header__title-sub {
  font-size: 12px;
  color: var(--color-text-tertiary);
}

.app-header__right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  min-width: 40px;
}
</style>
