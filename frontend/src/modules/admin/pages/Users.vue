<template>
  <div class="space-y-4">
    <h1 class="text-2xl font-semibold">{{ $t('admin.users.title') }}</h1>
    <div class="flex items-center gap-2">
      <UiInput v-model="search" :label="$t('common.search')" placeholder="john" />
      <UiButton @click="fetch">{{ $t('common.search') }}</UiButton>
    </div>
    <UiTable>
      <template #head>
        <tr>
          <th>#</th>
          <th>{{ $t('user.username') }}</th>
          <th>{{ $t('user.role') }}</th>
          <th>{{ $t('user.active') }}</th>
          <th></th>
        </tr>
      </template>
      <template #body>
        <tr v-for="(u, i) in users" :key="u.id">
          <td>{{ i + 1 + (page - 1) * pageSize }}</td>
          <td>{{ u.username }}</td>
          <td>
            <span class="badge badge-outline">{{ u.role }}</span>
          </td>
          <td>
            <input type="checkbox" class="toggle" :checked="u.isActive" @change="toggleActive(u)" />
          </td>
          <td>
            <div class="dropdown dropdown-end">
              <div tabindex="0" role="button" class="btn btn-sm">{{ $t('common.actions') }}</div>
              <ul class="dropdown-content menu bg-base-100 rounded-box z-[1] w-40 p-2 shadow">
                <li><a @click.prevent="setRole(u, 'TEACHER')">{{ $t('roles.teacher') }}</a></li>
                <li><a @click.prevent="setRole(u, 'STUDENT')">{{ $t('roles.student') }}</a></li>
                <li><a @click.prevent="setRole(u, 'ADMIN')">{{ $t('roles.admin') }}</a></li>
              </ul>
            </div>
          </td>
        </tr>
      </template>
    </UiTable>
    <UiPagination :page="page" :page-size="pageSize" :total="total" @update:page="onPage" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import UiInput from '@/components/ui/UiInput.vue';
import UiButton from '@/components/ui/UiButton.vue';
import UiTable from '@/components/ui/UiTable.vue';
import UiPagination from '@/components/ui/UiPagination.vue';
import { listUsers, toggleUserActive, updateUserRole } from '@/services/users';
import type { User, Role } from '@/types';

const users = ref<User[]>([]);
const search = ref('');
const page = ref(1);
const pageSize = 10;
const total = ref(0);

async function fetch() {
  try {
    const res = await listUsers({ page: page.value, pageSize, search: search.value });
    users.value = res.items;
    total.value = res.total;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('listUsers failed (backend missing). Showing placeholder.');
    users.value = [
      { id: 1, username: 'admin', role: 'ADMIN', isActive: true },
      { id: 2, username: 'teacher1', role: 'TEACHER', isActive: true },
      { id: 3, username: 'student1', role: 'STUDENT', isActive: false },
    ];
    total.value = users.value.length;
  }
}

async function toggleActive(u: User) {
  try {
    u.isActive = !u.isActive;
    await toggleUserActive(u.id, !!u.isActive);
  } catch (_) {
    // ignore for placeholder
  }
}

async function setRole(u: User, role: Role) {
  try {
    u.role = role;
    await updateUserRole(u.id, role);
  } catch (_) {
    // ignore for placeholder
  }
}

onMounted(fetch);

function onPage(p: number) {
  page.value = p;
  fetch();
}
</script>
