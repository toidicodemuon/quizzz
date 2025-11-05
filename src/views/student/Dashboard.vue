<template>
  <div class="row g-5 g-xl-10 mb-5 mb-xl-10">
    <div class="col-xl-4 col-md-6">
      <div class="card card-flush h-xl-100">
        <div class="card-body d-flex align-items-center py-5">
          <div class="flex-fill">
            <div class="fs-7 text-muted">Tổng bài nộp</div>
            <div class="fs-2hx fw-bold">{{ metrics.totalSubmissions }}</div>
          </div>
          <KTIcon icon-name="file-up" icon-class="fs-2x text-primary" />
        </div>
      </div>
    </div>
    <div class="col-xl-4 col-md-6">
      <div class="card card-flush h-xl-100">
        <div class="card-body d-flex align-items-center py-5">
          <div class="flex-fill">
            <div class="fs-7 text-muted">Điểm trung bình</div>
            <div class="fs-2hx fw-bold">{{ avgScore }}</div>
          </div>
          <KTIcon icon-name="chart" icon-class="fs-2x text-success" />
        </div>
      </div>
    </div>
    <div class="col-xl-4 col-md-6">
      <div class="card card-flush h-xl-100">
        <div class="card-body d-flex align-items-center py-5">
          <div class="flex-fill">
            <div class="fs-7 text-muted">Đề thi đang mở</div>
            <div class="fs-2hx fw-bold">{{ metrics.publishedQuizzes }}</div>
          </div>
          <KTIcon icon-name="element-plus" icon-class="fs-2x text-info" />
        </div>
      </div>
    </div>
  </div>

  <div class="row g-5 g-xl-10" v-if="recent.length">
    <div class="col-xxl-12">
      <div class="card">
        <div class="card-header">
          <div class="card-title">Bài nộp gần đây</div>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-row-dashed align-middle mb-0">
              <thead>
                <tr class="text-muted fw-semibold text-uppercase">
                  <th class="min-w-100px">Mã</th>
                  <th class="min-w-150px">Quiz</th>
                  <th class="min-w-100px">Điểm</th>
                  <th class="min-w-160px">Thời gian</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="s in recent" :key="s.id">
                  <td>#{{ s.id }}</td>
                  <td>{{ s.quizId }}</td>
                  <td class="fw-bold">{{ s.score.toFixed(0) }}</td>
                  <td>{{ new Date(s.startTime).toLocaleString() }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, computed } from "vue";
import ApiService from "@/core/services/ApiService";

export default defineComponent({
  name: "student-dashboard",
  setup() {
    const metrics = reactive({
      totalSubmissions: 0,
      publishedQuizzes: 0,
    });
    const recent = ref<Array<any>>([]);

    const load = async () => {
      try {
        const [subs, quizzes] = await Promise.all([
          ApiService.query("submissions", { params: { pageSize: 100 } }),
          ApiService.query("quizzes", { params: { status: "PUBLISHED", pageSize: 1 } }),
        ]);
        metrics.totalSubmissions = Number(subs.data?.total || 0);
        metrics.publishedQuizzes = Number(quizzes.data?.total || 0);
        recent.value = Array.isArray(subs.data?.items) ? subs.data.items.slice(0, 5) : [];
      } catch (e) {
        // ignore
      }
    };

    onMounted(() => load());

    const avgScore = computed(() => {
      if (!recent.value.length) return "-";
      const sum = recent.value.reduce((acc, s) => acc + Number(s.score || 0), 0);
      return Math.round((sum / recent.value.length));
    });

    return { metrics, recent, avgScore };
  },
});
</script>

