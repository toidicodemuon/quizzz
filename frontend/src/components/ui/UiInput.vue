<template>
  <label class="form-control w-full">
    <span v-if="label" class="label"><span class="label-text">{{ label }}</span></span>
    <input
      :type="type"
      class="input input-bordered w-full"
      :placeholder="placeholder"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <span v-if="hint || error" class="label">
      <span class="label-text-alt text-gray-500" v-if="hint">{{ hint }}</span>
      <span class="label-text-alt text-error" v-if="error">{{ error }}</span>
    </span>
  </label>
</template>

<script setup lang="ts">
defineProps<{
  modelValue?: string | number;
  label?: string;
  type?: string;
  placeholder?: string;
  hint?: string;
  error?: string;
}>();

defineEmits<{ (e: 'update:modelValue', value: string | number): void }>();
</script>

