<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-semibold">{{ $t('teacher.quizzes.title') }}</h1>
      <UiButton @click="openCreate = true">{{ $t('quiz.create') }}</UiButton>
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
          <td class="space-x-2">
            <UiButton size="sm" variant="outline">{{ $t('common.edit') }}</UiButton>
            <UiButton size="sm" variant="danger">{{ $t('common.delete') }}</UiButton>
          </td>
        </tr>
      </template>
    </UiTable>

    <UiModal v-model="openCreate" :title="$t('quiz.create')">
      <div class="space-y-2">
        <UiInput v-model="form.title" :label="$t('quiz.title')" />
        <UiInput v-model="form.timeLimitMinutes" :label="$t('quiz.timeLimit')" type="number" />
      </div>
      <template #actions>
        <UiButton variant="outline" @click="openCreate = false">{{ $t('common.cancel') }}</UiButton>
        <UiButton @click="create">{{ $t('common.save') }}</UiButton>
      </template>
    </UiModal>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useQuizStore } from '@/modules/quiz/stores/quiz';
import { storeToRefs } from 'pinia';
import UiTable from '@/components/ui/UiTable.vue';
import UiButton from '@/components/ui/UiButton.vue';
import UiModal from '@/components/ui/UiModal.vue';
import UiInput from '@/components/ui/UiInput.vue';
import * as QuizService from '@/services/quizzes';

const openCreate = ref(false);
const form = reactive({ title: '', timeLimitMinutes: 30 });

const quizStore = useQuizStore();
const { items } = storeToRefs(quizStore);

quizStore.fetch().catch(() => {});

async function create() {
  try {
    await QuizService.createQuiz({ title: form.title, timeLimitMinutes: Number(form.timeLimitMinutes), status: 'DRAFT' as any });
    openCreate.value = false;
    form.title = '';
    form.timeLimitMinutes = 30 as any;
    quizStore.fetch();
  } catch (_) {
    // eslint-disable-next-line no-alert
    alert('Create quiz is stubbed until backend is ready');
    openCreate.value = false;
  }
}
</script>

