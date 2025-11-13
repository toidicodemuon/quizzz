<template>
  <aside :class="['app-sidebar', { 'd-none': !open, collapsed }]">
    <div class="sidebar-inner h-100 d-flex flex-column">
      <div
        class="sidebar-header d-none d-lg-flex align-items-center justify-content-between p-2 my-2 border-bottom border-1 border-light"
      >
        <a
          class="brand d-flex align-items-center text-white text-decoration-none"
          href="#/"
        >
          <i class="bi bi-mortarboard-fill me-2"></i>
          <span class="brand-text fw-semibold">{{ appName }}</span>
        </a>
      </div>

      <nav class="menu flex-grow-1">
        <ul class="nav flex-column">
          <template v-for="(item, idx) in items" :key="idx">
            <li v-if="!item.children" class="nav-item">
              <div
                class="nav-link d-flex align-items-center justify-content-between"
              >
                <RouterLink
                  :to="item.to || '#'"
                  class="flex-grow-1 d-flex align-items-center text-reset text-decoration-none"
                >
                  <i v-if="item.icon" :class="['bi me-2', item.icon]"></i>
                  <span class="label">{{ item.label }}</span>
                </RouterLink>
                <a
                  v-if="item.newTab && item.to"
                  :href="toHref(item.to!)"
                  target="_blank"
                  rel="noopener"
                  class="btn btn-sm btn-outline-light ms-2 open-tab position-relative border-0"
                  title="Mở tab mới"
                  @click.stop
                >
                  <i class="bi bi-box-arrow-up-right"></i>
                </a>
              </div>
            </li>
            <li v-else class="nav-item">
              <button
                class="nav-link d-flex align-items-center w-100 text-start"
                @click="toggleGroup(idx)"
              >
                <i v-if="item.icon" :class="['bi me-2', item.icon]"></i>
                <span class="flex-grow-1 label">{{ item.label }}</span>
                <i
                  class="bi"
                  :class="
                    openGroups.has(idx) ? 'bi-chevron-up' : 'bi-chevron-down'
                  "
                ></i>
              </button>
              <ul class="nav flex-column submenu" v-show="openGroups.has(idx)">
                <li v-for="(sub, j) in item.children" :key="j" class="nav-item">
                  <div
                    class="nav-link d-flex align-items-center justify-content-between"
                  >
                    <RouterLink
                      :to="sub.to || '#'"
                      class="flex-grow-1 d-flex align-items-center text-reset text-decoration-none"
                    >
                      <i v-if="sub.icon" :class="['bi me-2', sub.icon]"></i>
                      <span class="label">{{ sub.label }}</span>
                    </RouterLink>
                    <a
                      v-if="sub.newTab && sub.to"
                      :href="toHref(sub.to!)"
                      target="_blank"
                      rel="noopener"
                      class="btn btn-sm btn-outline-light ms-2 open-tab position-relative"
                      title="Mở tab mới"
                      @click.stop
                    >
                      <i class="bi bi-box-arrow-up-right"></i>
                    </a>
                  </div>
                </li>
              </ul>
            </li>
          </template>
        </ul>
      </nav>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed, reactive } from "vue";
import { getRole } from "../utils/auth";
import { getMenuByRole } from "../menu";

type MenuItem = {
  label: string;
  to?: string;
  icon?: string;
  newTab?: boolean;
  children?: MenuItem[];
};

defineOptions({ name: "AppSidebar" });

const props = withDefaults(
  defineProps<{ open?: boolean; collapsed?: boolean }>(),
  { open: true, collapsed: false }
);
const items = computed<MenuItem[]>(() => getMenuByRole(getRole()));
const openGroups = reactive(new Set<number>());
function toggleGroup(index: number) {
  if (openGroups.has(index)) openGroups.delete(index);
  else openGroups.add(index);
}

function toHref(to: string) {
  return "#" + to.replace(/^#?\/?/, "/");
}

const appName = import.meta.env.VITE_APP_NAME || "THAT";
const collapsed = computed(() => !!props.collapsed);
</script>

<style scoped>
.app-sidebar {
  width: 260px;
}
.sidebar-inner {
  background: linear-gradient(180deg, #0e7bbd, #042744);
  color: #eaf2f6;
}
.brand i {
  font-size: 1.25rem;
}
.brand-text {
  transition: opacity 0.2s ease;
}
.menu .nav-link {
  color: #eaf2f6;
  padding: 0.75rem 1rem;
  border-radius: 0;
}
.menu .open-tab {
  padding: 0.15rem 0.35rem;
  z-index: 2;
}
.menu .nav-link:hover,
.menu .nav-link.router-link-active {
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
}
.submenu .nav-link {
  padding-left: 2.5rem;
  font-size: 0.95rem;
}

/* Collapsed mode: hide completely on desktop */
@media (min-width: 992px) {
  .app-sidebar.collapsed {
    display: none !important;
  }
}

@media (max-width: 992px) {
  .app-sidebar {
    position: fixed;
    top: 0; /* cover header */
    bottom: 0;
    left: 0;
    z-index: 1040; /* above header */
    width: 80vw; /* mobile drawer width */
    max-width: 320px;
    overflow-y: auto;
  }
}
</style>
