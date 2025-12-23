<template>
  <div class="row g-5 g-xl-10 mb-5 mb-xl-10">
    <div class="col-xl-4 col-md-6">
      <div class="card card-flush h-xl-100">
        <div class="card-body d-flex align-items-center py-5">
          <div class="flex-fill">
            <div class="fs-7 text-muted">Tổng số người dùng</div>
            <div class="fs-2hx fw-bold">-</div>
          </div>
          <KTIcon icon-name="people" icon-class="fs-2x text-primary" />
        </div>
      </div>
    </div>
    <div class="col-xl-4 col-md-6">
      <div class="card card-flush h-xl-100">
        <div class="card-body d-flex align-items-center py-5">
          <div class="flex-fill">
            <div class="fs-7 text-muted">Giáo viên</div>
            <div class="fs-2hx fw-bold">-</div>
          </div>
          <KTIcon icon-name="badge" icon-class="fs-2x text-success" />
        </div>
      </div>
    </div>
    <div class="col-xl-4 col-md-6">
      <div class="card card-flush h-xl-100">
        <div class="card-body d-flex align-items-center py-5">
          <div class="flex-fill">
            <div class="fs-7 text-muted">Học sinh</div>
            <div class="fs-2hx fw-bold">-</div>
          </div>
          <KTIcon icon-name="people" icon-class="fs-2x text-info" />
        </div>
      </div>
    </div>
  </div>
  <div class="card">
    <div class="card-header">
      <div class="card-title">Admin Dashboard</div>
    </div>
    <div class="card-body">
      <p class="mb-0">Trang tổng quan quản trị (placeholder).</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "admin-dashboard",
});
</script>

