<template>
  <div class="app-root">
    <t-layout>
      <t-header class="app-layout-header">
        <AppHeader />
      </t-header>
      <t-content class="app-layout-content">
        <router-view />
      </t-content>
    </t-layout>
  </div>
</template>

<script setup>
import AppHeader from './components/AppHeader.vue';
</script>

<style scoped>
.app-root {
  min-height: 100vh;
  background: var(--color-bg);
}

.app-root :deep(.t-layout) {
  min-height: 100vh;
  background: transparent;
}

.app-layout-header {
  padding: 0;
  height: auto;
  background: transparent;
}

.app-layout-content {
  padding: 0;
  background: transparent;
}
</style>
