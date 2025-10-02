<template>
  <dialog :open="modelValue" class="modal">
    <div class="modal-box">
      <h3 v-if="title" class="font-bold text-lg mb-4">{{ title }}</h3>
      <slot />
      <div class="modal-action">
        <slot name="actions">
          <button class="btn" @click="$emit('update:modelValue', false)">Close</button>
        </slot>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop" @click.prevent="$emit('update:modelValue', false)">
      <button>close</button>
    </form>
  </dialog>
</template>

<script setup lang="ts">
defineProps<{ modelValue: boolean; title?: string }>();
defineEmits<{ (e: 'update:modelValue', value: boolean): void }>();
</script>

