<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-semibold">{{ $t('student.takeQuiz') }}</h1>
      <div class="badge badge-lg">⏱ {{ minutes }}:{{ seconds.toString().padStart(2, '0') }}</div>
    </div>
    <div class="card bg-base-100 shadow">
      <div class="card-body">
        <div class="font-medium">{{ question.questionText }}</div>
        <div class="mt-2 space-y-2">
          <label v-for="a in question.answers" :key="a.id" class="label cursor-pointer justify-start gap-2">
            <input type="radio" class="radio" name="answer" :value="a.id" v-model="selected" />
            <span>{{ a.answerText }}</span>
          </label>
        </div>
        <div class="card-actions justify-end mt-4">
          <UiButton @click="submit">{{ $t('common.submit') }}</UiButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed } from 'vue';
import UiButton from '@/components/ui/UiButton.vue';

const selected = ref<number | null>(null);
const remaining = ref(60 * 10); // 10 minutes demo
let timer: number | undefined;

const minutes = computed(() => Math.floor(remaining.value / 60));
const seconds = computed(() => remaining.value % 60);

const question = {
  id: 1,
  questionText: 'What is 2 + 2?',
  answers: [
    { id: 1, answerText: '3' },
    { id: 2, answerText: '4' },
    { id: 3, answerText: '5' },
  ],
};

function tick() {
  if (remaining.value > 0) remaining.value -= 1;
}

function submit() {
  // eslint-disable-next-line no-alert
  alert(`Submitted with answer ID: ${selected.value}`);
}

onMounted(() => {
  timer = window.setInterval(tick, 1000);
});

onUnmounted(() => {
  if (timer) window.clearInterval(timer);
});
</script>
