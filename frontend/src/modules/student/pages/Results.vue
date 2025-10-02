<template>
  <div class="space-y-4">
    <h1 class="text-2xl font-semibold">{{ $t('student.results.title') }}</h1>
    <div class="alert alert-info">{{ $t('student.results.score') }}: 85%</div>
    <div class="space-y-3">
      <div class="card bg-base-200" v-for="i in 2" :key="i">
        <div class="card-body">
          <div class="font-medium">Q{{ i }}. Example question text?</div>
          <div class="text-sm">{{ $t('student.results.explanation') }}: Lorem ipsum dolor sit amet...</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

