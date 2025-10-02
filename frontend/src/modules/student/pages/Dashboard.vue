<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-semibold">{{ $t('student.dashboard.title') }}</h1>
    <div>
      <h2 class="text-lg font-medium mb-2">{{ $t('student.availableQuizzes') }}</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div v-for="q in available" :key="q.id" class="card bg-base-200">
          <div class="card-body">
            <div class="font-semibold">{{ q.title }}</div>
            <div class="text-sm opacity-70">{{ q.timeLimitMinutes }} {{ $t('quiz.minutes') }}</div>
            <div class="card-actions justify-end">
              <RouterLink class="btn btn-primary btn-sm" :to="{ name: 'student-take-quiz', params: { id: q.id } }">{{ $t('student.takeQuiz') }}</RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div>
      <h2 class="text-lg font-medium mb-2">{{ $t('student.completedQuizzes') }}</h2>
      <UiTable>
        <template #head>
          <tr>
            <th>#</th>
            <th>{{ $t('quiz.title') }}</th>
            <th>{{ $t('student.score') }}</th>
            <th></th>
          </tr>
        </template>
        <template #body>
          <tr v-for="(q, i) in completed" :key="q.id">
            <td>{{ i + 1 }}</td>
            <td>{{ q.title }}</td>
            <td>{{ q.score }}%</td>
            <td>
              <RouterLink class="btn btn-outline btn-xs" :to="{ name: 'student-results', params: { id: q.id } }">{{ $t('student.viewResults') }}</RouterLink>
            </td>
          </tr>
        </template>
      </UiTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import UiTable from '@/components/ui/UiTable.vue';

const available = [
  { id: 101, title: 'Intro to Algebra', timeLimitMinutes: 30 },
  { id: 102, title: 'Basic Chemistry', timeLimitMinutes: 25 },
];

const completed = [
  { id: 90, title: 'Physics 1', score: 86 },
  { id: 91, title: 'World History', score: 72 },
];
</script>

