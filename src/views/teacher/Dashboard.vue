<template>
  <div class="row g-5 g-xl-10 mb-5 mb-xl-10">
    <div class="col-xl-3 col-md-6">
      <div class="card card-flush h-xl-100">
        <div class="card-body d-flex align-items-center py-5">
          <div class="flex-fill">
            <div class="fs-7 text-muted">Tổng số đề thi</div>
            <div class="fs-2hx fw-bold">{{ metrics.totalQuizzes }}</div>
          </div>
          <KTIcon icon-name="element-11" icon-class="fs-2x text-primary" />
        </div>
      </div>
    </div>
    <div class="col-xl-3 col-md-6">
      <div class="card card-flush h-xl-100">
        <div class="card-body d-flex align-items-center py-5">
          <div class="flex-fill">
            <div class="fs-7 text-muted">Đang xuất bản</div>
            <div class="fs-2hx fw-bold">{{ metrics.publishedQuizzes }}</div>
          </div>
          <KTIcon icon-name="check" icon-class="fs-2x text-success" />
        </div>
      </div>
    </div>
    <div class="col-xl-3 col-md-6">
      <div class="card card-flush h-xl-100">
        <div class="card-body d-flex align-items-center py-5">
          <div class="flex-fill">
            <div class="fs-7 text-muted">Bản nháp</div>
            <div class="fs-2hx fw-bold">{{ metrics.draftQuizzes }}</div>
          </div>
          <KTIcon icon-name="file" icon-class="fs-2x text-warning" />
        </div>
      </div>
    </div>
    <div class="col-xl-3 col-md-6">
      <div class="card card-flush h-xl-100">
        <div class="card-body d-flex align-items-center py-5">
          <div class="flex-fill">
            <div class="fs-7 text-muted">Tổng bài nộp</div>
            <div class="fs-2hx fw-bold">{{ metrics.totalSubmissions }}</div>
          </div>
          <KTIcon icon-name="people" icon-class="fs-2x text-info" />
        </div>
      </div>
    </div>
  </div>

  <div class="row g-5 g-xl-10" v-if="latestSubmissions.length">
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
                  <th class="min-w-125px">Học viên</th>
                  <th class="min-w-100px">Điểm</th>
                  <th class="min-w-160px">Thời gian</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="s in latestSubmissions" :key="s.id">
                  <td>#{{ s.id }}</td>
                  <td>{{ s.quizId }}</td>
                  <td>{{ s.studentId }}</td>
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
import { defineComponent, onMounted, reactive, ref } from "vue";
import ApiService from "@/core/services/ApiService";
import { useAuthStore } from "@/stores/auth";

export default defineComponent({
  name: "teacher-dashboard",
  setup() {
    const auth = useAuthStore();
    const metrics = reactive({
      totalQuizzes: 0,
      publishedQuizzes: 0,
      draftQuizzes: 0,
      totalSubmissions: 0,
    });
    const latestSubmissions = ref<Array<any>>([]);

    const load = async () => {
      const teacherId = auth.user?.id;
      if (!teacherId) return;
      const common = { params: { teacherId, pageSize: 1 } } as const;
      try {
        const [all, pub, draft, subs] = await Promise.all([
          ApiService.query("quizzes", common),
          ApiService.query("quizzes", { params: { teacherId, status: "PUBLISHED", pageSize: 1 } }),
          ApiService.query("quizzes", { params: { teacherId, status: "DRAFT", pageSize: 1 } }),
          ApiService.query("submissions", { params: { pageSize: 5 } }),
        ]);
        metrics.totalQuizzes = Number(all.data?.total || 0);
        metrics.publishedQuizzes = Number(pub.data?.total || 0);
        metrics.draftQuizzes = Number(draft.data?.total || 0);
        metrics.totalSubmissions = Number(subs.data?.total || 0);
        latestSubmissions.value = Array.isArray(subs.data?.items) ? subs.data.items : [];
      } catch (e) {
        // ignore for now
      }
    };

    onMounted(() => {
      load();
    });

    return { metrics, latestSubmissions };
  },
});
</script>

