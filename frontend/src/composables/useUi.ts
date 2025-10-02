import { ref } from 'vue';

const SIDEBAR_KEY = 'ui.sidebar.open';
const stored = localStorage.getItem(SIDEBAR_KEY);
const sidebarOpen = ref(stored ? stored === '1' : true);

export function useUi() {
  function toggleSidebar() {
    sidebarOpen.value = !sidebarOpen.value;
    localStorage.setItem(SIDEBAR_KEY, sidebarOpen.value ? '1' : '0');
  }
  function setSidebar(value: boolean) {
    sidebarOpen.value = value;
    localStorage.setItem(SIDEBAR_KEY, value ? '1' : '0');
  }
  return { sidebarOpen, toggleSidebar, setSidebar };
}

