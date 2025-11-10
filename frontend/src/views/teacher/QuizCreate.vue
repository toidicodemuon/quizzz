<template>
  <div class="row g-3">
    <div class="col-lg-4">
      <div class="card h-100">
        <div class="card-header"><h5 class="mb-0">Tạo đề thi</h5></div>
        <div class="card-body">
          <form @submit.prevent="onCreate">
            <div class="mb-3">
              <label class="form-label">Tiêu đề</label>
              <input
                v-model.trim="form.title"
                type="text"
                class="form-control"
                placeholder="VD: Bài thi CNTT Cơ bản"
                required
              />
            </div>
            <div class="mb-3">
              <label class="form-label"
                >Môn học mặc định (cho câu hỏi mới)</label
              >
              <select
                v-model.number="form.subjectId"
                class="form-select"
                required
              >
                <option :value="0" disabled>-- Chọn môn --</option>
                <option v-for="s in subjects" :key="s.id" :value="s.id">
                  {{ s.name }}
                </option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label">Mô tả</label>
              <textarea
                v-model.trim="form.description"
                class="form-control"
                rows="3"
                placeholder="Mô tả ngắn..."
              ></textarea>
            </div>
            <div class="mb-3">
              <label class="form-label">Mã đề (tuỳ chọn)</label>
              <input
                v-model.trim="form.code"
                type="text"
                class="form-control"
                placeholder="VD: EXAM_IT_BASIC_001"
              />
            </div>
            <div class="mb-3">
              <label class="form-label">Trạng thái</label>
              <select v-model="form.status" class="form-select">
                <option value="DRAFT">DRAFT</option>
                <option value="PUBLISHED">PUBLISHED</option>
                <option value="ARCHIVED">ARCHIVED</option>
              </select>
            </div>

            <div class="mb-3">
              <label class="form-label">Câu hỏi đã chọn</label>
              <div class="small text-muted">{{ selectedIds.size }} câu hỏi</div>
            </div>

            <div class="d-grid gap-2">
              <button
                class="btn btn-primary"
                type="submit"
                :disabled="creating || !form.title || selectedIds.size === 0"
              >
                <span
                  v-if="creating"
                  class="spinner-border spinner-border-sm me-2"
                ></span>
                Tạo đề thi
              </button>
              <button
                class="btn btn-outline-secondary"
                type="button"
                @click="clearSelections"
                :disabled="creating"
              >
                Bỏ chọn tất cả
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div class="col-lg-8">
      <div class="card h-100">
        <div
          class="card-header d-flex align-items-center justify-content-between"
        >
          <h6 class="mb-0">Ngân hàng câu hỏi</h6>
          <div class="d-flex align-items-center gap-2">
            <input
              v-model.trim="search"
              type="search"
              class="form-control form-control-sm"
              placeholder="Tìm kiếm..."
            />
            <button
              class="btn btn-sm btn-outline-secondary"
              @click="toggleSelectPage"
            >
              {{ allPageSelected ? "Bỏ chọn trang" : "Chọn cả trang" }}
            </button>
          </div>
        </div>
        <div class="card-body p-0">
          <div class="list-group list-group-flush">
            <label
              v-for="q in filteredPage"
              :key="q.id"
              class="list-group-item d-flex align-items-start gap-2"
            >
              <input
                class="form-check-input mt-1"
                type="checkbox"
                :value="q.id"
                :checked="selectedIds.has(q.id)"
                @change="onToggle(q.id, $event)"
              />
              <div>
                <div class="fw-semibold">#{{ q.id }}</div>
                <div class="text-muted">{{ q.text }}</div>
              </div>
            </label>
          </div>

          <div
            class="d-flex align-items-center justify-content-between p-3 border-top"
          >
            <div class="text-muted small">
              Tổng: {{ total }} | Trang {{ page }} / {{ totalPages }}
            </div>
            <div class="btn-group">
              <button
                class="btn btn-sm btn-outline-secondary"
                :disabled="page <= 1 || loading"
                @click="changePage(page - 1)"
              >
                Trước
              </button>
              <button
                class="btn btn-sm btn-outline-secondary"
                :disabled="page >= totalPages || loading"
                @click="changePage(page + 1)"
              >
                Sau
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, computed } from "vue";
import api, { type Paginated } from "../../api";

type BankItem = { id: number; text: string; explanation: string | null };
type Subject = { id: number; name: string };

const form = reactive<{
  title: string;
  subjectId: number;
  description: string | null;
  code: string | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
}>({ title: "", subjectId: 0, description: null, code: null, status: "DRAFT" });
const creating = ref(false);
const subjects = ref<Subject[]>([]);

// bank state
const loading = ref(false);
const page = ref(1);
const pageSize = ref(10);
const total = ref(0);
const items = ref<BankItem[]>([]);
const search = ref("");
const selectedIds = reactive(new Set<number>());

const totalPages = computed(() =>
  Math.max(1, Math.ceil(total.value / pageSize.value))
);
const filteredPage = computed(() => {
  const q = search.value.trim().toLowerCase();
  const arr = items.value;
  if (!q) return arr;
  return arr.filter(
    (it) => it.text.toLowerCase().includes(q) || String(it.id).includes(q)
  );
});
const allPageSelected = computed(
  () =>
    filteredPage.value.length > 0 &&
    filteredPage.value.every((q) => selectedIds.has(q.id))
);

async function loadBank() {
  loading.value = true;
  try {
    const { data } = await api.get<Paginated<BankItem>>("/questions", {
      params: { page: page.value, pageSize: pageSize.value },
    });
    items.value = data.items;
    total.value = data.total;
  } finally {
    loading.value = false;
  }
}

function onToggle(id: number, ev: Event) {
  const checked = (ev.target as HTMLInputElement).checked;
  if (checked) selectedIds.add(id);
  else selectedIds.delete(id);
}
function toggleSelectPage() {
  if (allPageSelected.value)
    filteredPage.value.forEach((q) => selectedIds.delete(q.id));
  else filteredPage.value.forEach((q) => selectedIds.add(q.id));
}
function clearSelections() {
  selectedIds.clear();
}

function changePage(p: number) {
  page.value = Math.min(Math.max(1, p), totalPages.value);
  loadBank();
}

async function onCreate() {
  if (!form.title || selectedIds.size === 0) return;
  creating.value = true;
  try {
    // 1) Create exam with code/status/subjectId
    const { data: exam } = await api.post<{ id: number }>("/exams", {
      title: form.title,
      description: form.description,
      code: form.code,
      status: form.status,
      subjectId: form.subjectId > 0 ? form.subjectId : null,
    });
    // 2) Clone selected questions into this exam
    const ids = Array.from(selectedIds);
    for (const id of ids) {
      const { data: qd } = await api.get<{
        id: number;
        text: string;
        explanation: string | null;
        choices: Array<{
          id: number;
          content: string;
          isCorrect: boolean;
          order: number;
        }>;
      }>(`/questions/${id}`);
      await api.post("/questions", {
        examId: exam.id,
        text: qd.text,
        explanation: qd.explanation,
        subjectId: form.subjectId,
        choices: qd.choices.map((c) => ({
          content: c.content,
          isCorrect: c.isCorrect,
          order: c.order,
        })),
        points: 1,
      });
    }
    alert("Tạo đề thi thành công!");
    form.title = "";
    form.description = null;
    form.code = null;
    selectedIds.clear();
  } catch (e: any) {
    alert(e?.message || "Không thể tạo đề thi");
  } finally {
    creating.value = false;
  }
}

onMounted(async () => {
  try {
    const { data } = await api.get("/subjects");
    subjects.value = Array.isArray(data?.items)
      ? data.items.map((s: any) => ({ id: s.id, name: s.name }))
      : [];
  } catch (err: any) {
    console.error("Failed to load subjects:", err);
  }
  loadBank();
});
</script>
