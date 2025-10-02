<template>
  <div class="space-y-4">
    <h1 class="text-2xl font-semibold">{{ $t('teacher.submissions.title') }}</h1>
    <UiTable>
      <template #head>
        <tr>
          <th>#</th>
          <th>{{ $t('quiz.title') }}</th>
          <th>{{ $t('student.name') }}</th>
          <th>{{ $t('student.score') }}</th>
        </tr>
      </template>
      <template #body>
        <tr v-for="(s, i) in submissions" :key="i">
          <td>{{ i + 1 }}</td>
          <td>{{ s.quiz }}</td>
          <td>{{ s.student }}</td>
          <td>{{ s.score }}%</td>
        </tr>
      </template>
    </UiTable>
  </div>
</template>

<script setup lang="ts">
import UiTable from '@/components/ui/UiTable.vue';

const submissions = [
  { quiz: 'Math 101', student: 'Alice', score: 92 },
  { quiz: 'Physics 1', student: 'Bob', score: 76 },
];
</script>

