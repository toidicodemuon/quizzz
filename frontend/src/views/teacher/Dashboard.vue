<template>
  <div class="card mb-3">
    <div class="card-body">
      <h5 class="card-title mb-0">Teacher Dashboard</h5>
    </div>
  </div>
  <div class="row g-3">
    <div class="col-md-4">
      <div class="card h-100">
        <div class="card-body">Tổng số đề thi: -</div>
      </div>
    </div>
    <div class="col-md-4">
      <div class="card h-100">
        <div class="card-body">Đang xuất bản: -</div>
      </div>
    </div>
    <div class="col-md-4">
      <div class="card h-100"><div class="card-body">Bản nháp: -</div></div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: "TeacherDashboard",
});
</script>
