<template>
  <div class="space-y-4">
    <h1 class="text-2xl font-semibold">{{ $t('teacher.dashboard.title') }}</h1>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="stat bg-base-200 rounded-box">
        <div class="stat-title">{{ $t('teacher.stats.quizzes') }}</div>
        <div class="stat-value">12</div>
      </div>
      <div class="stat bg-base-200 rounded-box">
        <div class="stat-title">{{ $t('teacher.stats.submissions') }}</div>
        <div class="stat-value">347</div>
      </div>
      <div class="stat bg-base-200 rounded-box">
        <div class="stat-title">{{ $t('teacher.stats.avgScore') }}</div>
        <div class="stat-value">83%</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

