<template>
  <aside
    :class="[
      'app-sidebar border-end bg-white',
      { 'd-none': !open, 'd-block': open },
    ]"
  >
    <nav class="list-group list-group-flush">
      <RouterLink
        v-for="item in items"
        :key="item.to"
        :to="item.to"
        class="list-group-item list-group-item-action"
        active-class="active"
      >
        {{ item.label }}
      </RouterLink>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { getRole } from "../utils/auth";
import { getMenuByRole } from "../menu";

defineOptions({ name: "AppSidebar" });

defineProps<{ open?: boolean }>();

const items = computed(() => getMenuByRole(getRole()));
</script>

<style scoped>
.app-sidebar {
  width: 240px;
}

@media (max-width: 992px) {
  .app-sidebar {
    position: fixed;
    top: 56px; /* header height approx */
    bottom: 0;
    left: 0;
    z-index: 1020;
    width: 240px;
    overflow-y: auto;
    background: #fff;
  }
}
</style>
