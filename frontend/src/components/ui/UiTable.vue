<template>
  <div class="overflow-x-auto">
    <table class="table w-full">
      <thead>
        <slot name="head" />
      </thead>
      <tbody>
        <slot name="body" />
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts"></script>

