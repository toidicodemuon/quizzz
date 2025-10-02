<template>
  <div class="space-y-4">
    <h1 class="text-2xl font-semibold">{{ $t('admin.quizzes.title') }}</h1>
    <div class="flex items-center gap-2">
      <UiButton @click="fetch">{{ $t('common.refresh') }}</UiButton>
    </div>
    <UiTable>
      <template #head>
        <tr>
          <th>#</th>
          <th>{{ $t('quiz.title') }}</th>
          <th>{{ $t('quiz.status') }}</th>
          <th>{{ $t('quiz.timeLimit') }}</th>
          <th></th>
        </tr>
      </template>
      <template #body>
        <tr v-for="(q, i) in items" :key="q.id">
          <td>{{ i + 1 }}</td>
          <td>{{ q.title }}</td>
          <td><span class="badge badge-outline">{{ q.status }}</span></td>
          <td>{{ q.timeLimitMinutes }}m</td>
          <td>
            <UiButton size="sm" variant="outline">{{ $t('quiz.approvePublish') }}</UiButton>
          </td>
        </tr>
      </template>
    </UiTable>
  </div>
</template>

<script setup lang="ts">
import UiTable from '@/components/ui/UiTable.vue';
import UiButton from '@/components/ui/UiButton.vue';
import { useQuizStore } from '@/modules/quiz/stores/quiz';
import { storeToRefs } from 'pinia';

const quizStore = useQuizStore();
const { items } = storeToRefs(quizStore);

function fetch() {
  quizStore.fetch().catch(() => {
    // ignore for placeholder
  });
}

fetch();
</script>

