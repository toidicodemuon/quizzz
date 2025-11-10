<template>
  <div class="card">
    <div class="card-header d-flex align-items-center justify-content-between">
      <h5 class="mb-0">Đề thi</h5>
      <div class="d-flex align-items-center gap-2 flex-wrap">
        <button class="btn btn-success" @click="openAdd()">
          <i class="bi bi-plus-circle me-1"></i>
          <span class="d-none d-sm-inline">Tạo đề thi</span>
        </button>
        <button
          class="btn btn-outline-primary"
          :disabled="selectedIds.size !== 1"
          @click="openEditBySelection()"
        >
          <i class="bi bi-pencil-square me-1"></i>
          <span class="d-none d-sm-inline">Sửa</span>
        </button>
        <button
          class="btn btn-outline-danger"
          :disabled="selectedIds.size === 0"
          @click="bulkDelete()"
        >
          <i class="bi bi-trash me-1"></i>
          <span class="d-none d-sm-inline">Xóa</span>
        </button>
        <button class="btn btn-outline-primary" @click="openBank()">
          <i class="bi bi-journal-text me-1"></i>
          <span class="d-none d-sm-inline">Ngân hàng câu hỏi</span>
        </button>
      </div>
    </div>
    <div class="card-body">
      <div class="row g-3 align-items-center mb-3">
        <div class="col-12 col-md-4">
          <input
            v-model.trim="search"
            type="search"
            class="form-control"
            placeholder="Tìm đề thi..."
          />
        </div>
        <div class="col-6 col-md-3">
          <div class="input-group">
            <span class="input-group-text">Môn</span>
            <select
              class="form-select"
              v-model.number="subjectId"
              @change="reload()"
            >
              <option :value="0">Tất cả</option>
              <option v-for="s in subjects" :key="s.id" :value="s.id">
                {{ s.name }}
              </option>
            </select>
          </div>
        </div>
        <div class="col-6 col-md-3 text-muted small">Tổng: {{ total }}</div>
      </div>

      <div class="table-responsive">
        <table class="table align-middle">
          <thead>
            <tr class="text-uppercase text-muted small">
              <th style="width: 36px">
                <input
                  class="form-check-input"
                  type="checkbox"
                  :checked="allPageSelected"
                  @change="toggleSelectAll($event)"
                />
              </th>
              <th class="d-none d-sm-table-cell">ID</th>
              <th>Tiêu đề</th>
              <th class="d-none d-sm-table-cell">Mã đề</th>
              <th>Trạng thái</th>
              <th class="d-none d-lg-table-cell">Ngày tạo</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="e in filteredItems" :key="e.id">
              <td>
                <input
                  class="form-check-input"
                  type="checkbox"
                  :checked="selectedIds.has(e.id)"
                  @change="onToggle(e.id, $event)"
                />
              </td>
              <td class="fw-semibold d-none d-sm-table-cell">#{{ e.id }}</td>
              <td>
                <div class="fw-semibold">{{ e.title }}</div>
                <div class="text-muted small" v-if="e.description">
                  {{ e.description }}
                </div>
              </td>
              <td class="d-none d-sm-table-cell">
                <code>{{ e.code || "—" }}</code>
              </td>
              <td>
                <span class="badge bg-secondary">{{ e.status }}</span>
              </td>
              <td class="d-none d-lg-table-cell">
                {{ formatDate(e.createdAt) }}
              </td>
              <td class="text-end">
                <div class="btn-group btn-group-sm">
                  <button
                    class="btn btn-outline-secondary"
                    @click="openView(e)"
                  >
                    <i class="bi bi-eye me-1"></i>
                    <span class="d-none d-sm-inline">Xem</span>
                  </button>
                  <button class="btn btn-outline-primary" @click="openEdit(e)">
                    <i class="bi bi-pencil-square me-1"></i>
                    <span class="d-none d-sm-inline">Sửa</span>
                  </button>
                  <button class="btn btn-outline-danger" @click="delOne(e)">
                    <i class="bi bi-trash me-1"></i>
                    <span class="d-none d-sm-inline">Xóa</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="mt-2">
        <Pagination
          :page="page"
          :page-size="pageSize"
          :total="total"
          :page-size-options="pageSizeOptions"
          :disabled="loading"
          @update:page="(p:number)=> changePage(p)"
          @update:page-size="(sz:number)=>{ pageSize = sz; onPageSizeChange(); }"
        />
      </div>
    </div>
  </div>

  <!-- Question picker (reuse bank) for selected exam -->
  <div class="card mt-3" v-if="selectedIds.size === 1">
    <div class="card-header d-flex align-items-center justify-content-between">
      <h6 class="mb-0">Câu hỏi cho đề thi #{{ selectedOneId }}</h6>
      <div class="text-muted small">Thêm/Gỡ câu hỏi từ ngân hàng</div>
    </div>
    <div class="card-body">
      <div class="row g-3">
        <div class="col-12 col-lg-6">
          <div class="mb-2 d-flex justify-content-between align-items-center">
            <strong>Câu hỏi trong đề</strong>
            <button
              class="btn btn-sm btn-outline-danger"
              :disabled="selectedExamQuestionIds.size === 0 || loading"
              @click="removeSelectedFromExam()"
            >
              <i class="bi bi-trash me-1"></i> Gỡ khỏi đề
            </button>
          </div>
          <div class="table-responsive border rounded">
            <table class="table align-middle mb-0">
              <thead>
                <tr class="text-uppercase text-muted small">
                  <th style="width: 36px">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      :checked="allExamQuestionsSelected"
                      @change="toggleSelectAllExamQuestions($event)"
                    />
                  </th>
                  <th class="d-none d-sm-table-cell">ID</th>
                  <th>Nội dung</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="q in examQuestions" :key="q.id">
                  <td>
                    <input
                      class="form-check-input"
                      type="checkbox"
                      :checked="selectedExamQuestionIds.has(q.id)"
                      @change="onToggleExamQuestion(q.id, $event)"
                    />
                  </td>
                  <td class="d-none d-sm-table-cell fw-semibold">
                    #{{ q.id }}
                  </td>
                  <td>
                    <div class="fw-semibold">{{ q.text }}</div>
                    <div class="text-muted small" v-if="q.explanation">
                      {{ q.explanation }}
                    </div>
                  </td>
                </tr>
                <tr v-if="examQuestions.length === 0">
                  <td colspan="3" class="text-center text-muted">
                    Chưa có câu hỏi
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="col-12 col-lg-6">
          <div class="row g-2 align-items-center mb-2">
            <div class="col-12 col-md-6">
              <strong>Ngân hàng câu hỏi</strong>
            </div>
            <div class="col-6 col-md-3">
              <div class="input-group input-group-sm">
                <span class="input-group-text">Môn</span>
                <select
                  class="form-select"
                  v-model.number="bankSubjectId"
                  @change="loadBankQuestions()"
                >
                  <option :value="0">Tất cả</option>
                  <option v-for="s in subjects" :key="s.id" :value="s.id">
                    {{ s.name }}
                  </option>
                </select>
              </div>
            </div>
            <div class="col-6 col-md-3">
              <input
                v-model.trim="bankSearch"
                class="form-control form-control-sm"
                placeholder="Tìm câu hỏi..."
                @input="filterBank()"
              />
            </div>
          </div>
          <div class="table-responsive border rounded">
            <table class="table align-middle mb-0">
              <thead>
                <tr class="text-uppercase text-muted small">
                  <th style="width: 36px">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      :checked="allBankSelected"
                      @change="toggleSelectAllBank($event)"
                    />
                  </th>
                  <th class="d-none d-sm-table-cell">ID</th>
                  <th>Nội dung</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="q in filteredBankQuestions" :key="q.id">
                  <td>
                    <input
                      class="form-check-input"
                      type="checkbox"
                      :checked="selectedBankIds.has(q.id)"
                      @change="onToggleBank(q.id, $event)"
                    />
                  </td>
                  <td class="d-none d-sm-table-cell fw-semibold">
                    #{{ q.id }}
                  </td>
                  <td>
                    <div class="fw-semibold">{{ q.text }}</div>
                    <div class="text-muted small" v-if="q.explanation">
                      {{ q.explanation }}
                    </div>
                  </td>
                </tr>
                <tr v-if="filteredBankQuestions.length === 0">
                  <td colspan="3" class="text-center text-muted">
                    Không có câu hỏi
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="mt-2 d-flex align-items-center justify-content-between">
            <div class="input-group input-group-sm" style="max-width: 260px">
              <span class="input-group-text">Điểm mặc định</span>
              <input
                type="number"
                min="0"
                step="0.5"
                class="form-control"
                v-model.number="defaultAddPoints"
              />
            </div>
            <button
              class="btn btn-sm btn-primary"
              :disabled="selectedBankIds.size === 0 || loading"
              @click="addSelectedToExam()"
            >
              <i class="bi bi-plus-lg me-1"></i> Thêm vào đề
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Create/Edit Modal -->
  <div
    class="modal fade show"
    v-if="showModal"
    style="display: block"
    aria-modal="true"
    role="dialog"
  >
    <div
      class="modal-dialog modal-xl modal-dialog-scrollable modal-fullscreen-md-down"
    >
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            <template v-if="modalStep === 'info'">
              {{ isEdit ? "Sửa đề thi" : "Tạo đề thi" }}
            </template>
            <template v-else> Chọn câu hỏi cho đề #{{ form.id }} </template>
          </h5>
          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <form v-if="modalStep === 'info'" @submit.prevent>
            <div class="row g-3">
              <div class="col-12">
                <label class="form-label">Tiêu đề</label>
                <input
                  v-model.trim="form.title"
                  type="text"
                  class="form-control"
                  required
                />
              </div>
              <div class="col-12 col-md-6">
                <label class="form-label">Mã đề</label>
                <input
                  v-model.trim="form.code"
                  type="text"
                  class="form-control"
                />
              </div>
              <div class="col-12 col-md-6">
                <label class="form-label">Trạng thái</label>
                <select v-model="form.status" class="form-select">
                  <option value="DRAFT">DRAFT</option>
                  <option value="PUBLISHED">PUBLISHED</option>
                  <option value="ARCHIVED">ARCHIVED</option>
                </select>
              </div>
              <div class="col-12 col-md-6">
                <label class="form-label">Loại đề thi</label>
                <select v-model="form.examType" class="form-select">
                  <option value="PRACTICE">PRACTICE</option>
                  <option value="MIDTERM">MIDTERM</option>
                  <option value="FINAL">FINAL</option>
                  <option value="MOCK">MOCK</option>
                  <option value="MOS_DRILL">MOS_DRILL</option>
                  <option value="PLACEMENT">PLACEMENT</option>
                </select>
              </div>
              <div class="col-12 col-md-6">
                <label class="form-label">Tổng điểm</label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  v-model.number="form.totalPoints"
                  class="form-control"
                />
              </div>
              <div class="col-12 col-md-6">
                <label class="form-label">Điểm đậu (%)</label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  max="100"
                  v-model.number="form.passMarkPercent"
                  class="form-control"
                />
              </div>
              <div class="col-12 col-md-6">
                <label class="form-label">Chấm điểm</label>
                <select v-model="form.scoringMode" class="form-select">
                  <option value="STANDARD">STANDARD</option>
                  <option value="PARTIAL_CREDIT">PARTIAL_CREDIT</option>
                  <option value="NEGATIVE_MARKING">NEGATIVE_MARKING</option>
                </select>
              </div>
              <div class="col-12 col-md-6">
                <label class="form-label">Hiển thị phản hồi</label>
                <select v-model="form.feedbackMode" class="form-select">
                  <option value="NONE">NONE</option>
                  <option value="AFTER_SUBMIT">AFTER_SUBMIT</option>
                  <option value="DETAILED">DETAILED</option>
                </select>
              </div>
              <div class="col-12 col-md-6">
                <label class="form-label">Môn học (tuỳ chọn)</label>
                <select v-model.number="form.subjectId" class="form-select">
                  <option :value="0">— Không chọn —</option>
                  <option v-for="s in subjects" :key="s.id" :value="s.id">
                    {{ s.name }}
                  </option>
                </select>
              </div>
              <div class="col-12">
                <div class="row row-cols-1 row-cols-md-3 g-2">
                  <div class="col">
                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        id="chk1"
                        v-model="form.showScoreImmediately"
                      />
                      <label class="form-check-label" for="chk1"
                        >Hiện điểm ngay</label
                      >
                    </div>
                  </div>
                  <div class="col">
                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        id="chk2"
                        v-model="form.showCorrectAnswers"
                      />
                      <label class="form-check-label" for="chk2"
                        >Hiện đáp án đúng</label
                      >
                    </div>
                  </div>
                  <div class="col">
                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        id="chk3"
                        v-model="form.showExplanation"
                      />
                      <label class="form-check-label" for="chk3"
                        >Hiện giải thích</label
                      >
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-12 col-md-6">
                <label class="form-label">Thời gian xem lại (phút)</label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  v-model.number="form.reviewWindowMin"
                  class="form-control"
                />
              </div>
              <div class="col-12">
                <label class="form-label">Mô tả</label>
                <textarea
                  v-model.trim="form.description"
                  rows="3"
                  class="form-control"
                ></textarea>
              </div>
            </div>
          </form>
          <div v-else>
            <div class="row g-3">
              <div class="col-12 col-lg-6">
                <div
                  class="mb-2 d-flex justify-content-between align-items-center"
                >
                  <strong>Câu hỏi trong đề</strong>
                  <button
                    class="btn btn-sm btn-outline-danger"
                    :disabled="selectedExamQuestionIds.size === 0 || loading"
                    @click="removeSelectedFromExam()"
                  >
                    <i class="bi bi-trash me-1"></i> Gỡ khỏi đề
                  </button>
                </div>
                <div class="table-responsive border rounded">
                  <table class="table align-middle mb-0">
                    <thead>
                      <tr class="text-uppercase text-muted small">
                        <th style="width: 36px">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            :checked="allExamQuestionsSelected"
                            @change="toggleSelectAllExamQuestions($event)"
                          />
                        </th>
                        <th class="d-none d-sm-table-cell">ID</th>
                        <th>Nội dung</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="q in examQuestions" :key="q.id">
                        <td>
                          <input
                            class="form-check-input"
                            type="checkbox"
                            :checked="selectedExamQuestionIds.has(q.id)"
                            @change="onToggleExamQuestion(q.id, $event)"
                          />
                        </td>
                        <td class="d-none d-sm-table-cell fw-semibold">
                          #{{ q.id }}
                        </td>
                        <td>
                          <div class="fw-semibold">{{ q.text }}</div>
                          <div class="text-muted small" v-if="q.explanation">
                            {{ q.explanation }}
                          </div>
                        </td>
                      </tr>
                      <tr v-if="examQuestions.length === 0">
                        <td colspan="3" class="text-center text-muted">
                          Chưa có câu hỏi
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div class="col-12 col-lg-6">
                <div class="row g-2 align-items-center mb-2">
                  <div class="col-12 col-md-6">
                    <strong>Ngân hàng câu hỏi</strong>
                  </div>
                  <div class="col-6 col-md-3">
                    <div class="input-group input-group-sm">
                      <span class="input-group-text">Môn</span>
                      <select
                        class="form-select"
                        v-model.number="bankSubjectId"
                        @change="loadBankQuestions()"
                      >
                        <option :value="0">Tất cả</option>
                        <option v-for="s in subjects" :key="s.id" :value="s.id">
                          {{ s.name }}
                        </option>
                      </select>
                    </div>
                  </div>
                  <div class="col-6 col-md-3">
                    <input
                      v-model.trim="bankSearch"
                      class="form-control form-control-sm"
                      placeholder="Tìm câu hỏi..."
                      @input="filterBank()"
                    />
                  </div>
                </div>
                <div class="table-responsive border rounded">
                  <table class="table align-middle mb-0">
                    <thead>
                      <tr class="text-uppercase text-muted small">
                        <th style="width: 36px">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            :checked="allBankSelected"
                            @change="toggleSelectAllBank($event)"
                          />
                        </th>
                        <th class="d-none d-sm-table-cell">ID</th>
                        <th>Nội dung</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="q in filteredBankQuestions" :key="q.id">
                        <td>
                          <input
                            class="form-check-input"
                            type="checkbox"
                            :checked="selectedBankIds.has(q.id)"
                            @change="onToggleBank(q.id, $event)"
                          />
                        </td>
                        <td class="d-none d-sm-table-cell fw-semibold">
                          #{{ q.id }}
                        </td>
                        <td>
                          <div class="fw-semibold">{{ q.text }}</div>
                          <div class="text-muted small" v-if="q.explanation">
                            {{ q.explanation }}
                          </div>
                        </td>
                      </tr>
                      <tr v-if="filteredBankQuestions.length === 0">
                        <td colspan="3" class="text-center text-muted">
                          Không có câu hỏi
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div
                  class="mt-2 d-flex align-items-center justify-content-between"
                >
                  <div
                    class="input-group input-group-sm"
                    style="max-width: 260px"
                  >
                    <span class="input-group-text">Điểm mặc định</span>
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      class="form-control"
                      v-model.number="defaultAddPoints"
                    />
                  </div>
                  <button
                    class="btn btn-sm btn-primary"
                    :disabled="selectedBankIds.size === 0 || loading"
                    @click="addSelectedToExam()"
                  >
                    <i class="bi bi-plus-lg me-1"></i> Thêm vào đề
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <template v-if="modalStep === 'info'">
            <button class="btn btn-light" @click="closeModal">Đóng</button>
            <button
              class="btn btn-outline-primary"
              :disabled="saving || !form.title.trim()"
              @click="gotoQuestionStep"
            >
              <span
                v-if="saving"
                class="spinner-border spinner-border-sm me-2"
              ></span>
              Lưu & chọn câu hỏi
            </button>
            <button
              class="btn btn-primary"
              :disabled="saving || !form.title.trim()"
              @click="submitModal"
            >
              <span
                v-if="saving"
                class="spinner-border spinner-border-sm me-2"
              ></span>
              Lưu
            </button>
          </template>
          <template v-else>
            <button class="btn btn-light" @click="modalStep = 'info'">
              Quay lại
            </button>
            <button class="btn btn-primary" @click="closeModal">Xong</button>
          </template>
        </div>
      </div>
    </div>
  </div>
  <div class="modal-backdrop fade show" v-if="showModal"></div>

  <!-- View Exam Modal -->
  <div
    class="modal fade show"
    v-if="showView"
    style="display: block"
    aria-modal="true"
    role="dialog"
  >
    <div
      class="modal-dialog modal-xl modal-dialog-scrollable modal-fullscreen-md-down"
    >
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Xem đề thi #{{ viewExam?.id }}</h5>
          <button type="button" class="btn-close" @click="closeView"></button>
        </div>
        <div class="modal-body">
          <div v-if="!viewExam" class="text-center text-muted">Đang tải...</div>
          <div v-else>
            <div class="mb-3">
              <div class="row g-2">
                <div class="col-12 col-md-8">
                  <div class="fw-bold">{{ viewExam.title }}</div>
                  <div class="text-muted" v-if="viewExam.description">
                    {{ viewExam.description }}
                  </div>
                </div>
                <div class="col-12 col-md-4">
                  <div>
                    Mã đề: <code>{{ viewExam.code || "—" }}</code>
                  </div>
                  <div>
                    Trạng thái:
                    <span class="badge bg-secondary">{{
                      viewExam.status
                    }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="row g-2 mb-3 small text-muted">
              <div class="col-6 col-md-3">
                Loại đề: {{ viewExam.examType || "PRACTICE" }}
              </div>
              <div class="col-6 col-md-3">
                Tổng điểm: {{ viewExam.totalPoints ?? "—" }}
              </div>
              <div class="col-6 col-md-3">
                Điểm đậu: {{ viewExam.passMarkPercent ?? "—" }}%
              </div>
              <div class="col-6 col-md-3">
                Chấm điểm: {{ viewExam.scoringMode || "STANDARD" }}
              </div>
              <div class="col-6 col-md-3">
                Feedback: {{ viewExam.feedbackMode || "DETAILED" }}
              </div>
              <div class="col-6 col-md-3">
                Hiện điểm ngay:
                {{ viewExam.showScoreImmediately ? "Có" : "Không" }}
              </div>
              <div class="col-6 col-md-3">
                Hiện đáp án: {{ viewExam.showCorrectAnswers ? "Có" : "Không" }}
              </div>
              <div class="col-6 col-md-3">
                Hiện giải thích: {{ viewExam.showExplanation ? "Có" : "Không" }}
              </div>
              <div class="col-6 col-md-3">
                Xem lại (phút): {{ viewExam.reviewWindowMin ?? "—" }}
              </div>
            </div>

            <div class="table-responsive border rounded">
              <table class="table align-middle mb-0">
                <thead>
                  <tr class="text-uppercase text-muted small">
                    <th class="d-none d-sm-table-cell">ID</th>
                    <th>Nội dung</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="q in viewQuestions" :key="q.id">
                    <td class="d-none d-sm-table-cell fw-semibold">
                      #{{ q.id }}
                    </td>
                    <td>
                      <div class="fw-semibold">{{ q.text }}</div>
                      <div class="text-muted small" v-if="q.explanation">
                        {{ q.explanation }}
                      </div>
                    </td>
                  </tr>
                  <tr v-if="viewQuestions.length === 0">
                    <td colspan="2" class="text-center text-muted">
                      Chưa có câu hỏi
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-light" @click="closeView">Đóng</button>
        </div>
      </div>
    </div>
  </div>
  <div class="modal-backdrop fade show" v-if="showView"></div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from "vue";
import Pagination from "../../components/common/Pagination.vue";
import api, { type Paginated } from "../../api";
import { getUser } from "../../utils/auth";

type Subject = { id: number; name: string };
type ExamRow = {
  id: number;
  title: string;
  description: string | null;
  code: string | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  createdAt: string;
};

const loading = ref(false);
const items = ref<ExamRow[]>([]);
const total = ref(0);
const page = ref(1);
const pageSize = ref(10);
const pageSizeOptions = [10, 20, 30, 40, 50];
const search = ref("");
const subjects = ref<Subject[]>([]);
const subjectId = ref(0);

// selection for bulk actions
const selectedIds = reactive(new Set<number>());
const allPageSelected = computed(
  () =>
    filteredItems.value.length > 0 &&
    filteredItems.value.every((it) => selectedIds.has(it.id))
);
function onToggle(id: number, ev: Event) {
  const c = (ev.target as HTMLInputElement).checked;
  if (c) selectedIds.add(id);
  else selectedIds.delete(id);
}
function toggleSelectAll(ev: Event) {
  const c = (ev.target as HTMLInputElement).checked;
  filteredItems.value.forEach((it) =>
    c ? selectedIds.add(it.id) : selectedIds.delete(it.id)
  );
}
const selectedOneId = computed(() =>
  selectedIds.size === 1 ? Array.from(selectedIds)[0] : 0
);

const totalPages = computed(() =>
  Math.max(1, Math.ceil(total.value / pageSize.value))
);
const filteredItems = computed(() => {
  const q = search.value.trim().toLowerCase();
  if (!q) return items.value;
  return items.value.filter(
    (it) =>
      it.title.toLowerCase().includes(q) ||
      String(it.id).includes(q) ||
      (it.code || "").toLowerCase().includes(q)
  );
});

function formatDate(d: string) {
  try {
    return new Date(d).toLocaleString();
  } catch {
    return d;
  }
}


async function load() {
  loading.value = true;
  try {
    const user = getUser();
    const params: any = { page: page.value, pageSize: pageSize.value };
    if (user?.id) params.authorId = Number(user.id);
    if (subjectId.value > 0) params.subjectId = subjectId.value;
    const { data } = await api.get<Paginated<ExamRow>>("/exams", { params });
    items.value = data.items as any;
    total.value = data.total;
  } finally {
    loading.value = false;
  }
}
async function bulkDelete() {
  if (selectedIds.size === 0) return;
  if (!confirm(`Xóa ${selectedIds.size} đề thi đã chọn?`)) return;
  for (const id of Array.from(selectedIds)) {
    try {
      await api.delete(`/exams/${id}`);
    } catch {
      // ignore
    }
  }
  selectedIds.clear();
  load();
}
function changePage(p: number) {
  page.value = Math.min(Math.max(1, p), totalPages.value);
  load();
}
function onPageSizeChange() {
  page.value = 1;
  load();
}
function reload() {
  page.value = 1;
  load();
}
function openEditBySelection() {
  const id = selectedOneId.value;
  const row = items.value.find((it) => it.id === id);
  if (row) openEdit(row);
}

// create/edit modal
const showModal = ref(false);
const isEdit = ref(false);
const saving = ref(false);
const modalStep = ref<"info" | "questions">("info");
const form = reactive<{
  id?: number;
  title: string;
  description: string | null;
  code: string | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  subjectId: number;
  // extended fields
  examType:
    | "PRACTICE"
    | "MIDTERM"
    | "FINAL"
    | "MOCK"
    | "MOS_DRILL"
    | "PLACEMENT";
  totalPoints: number | null;
  passMarkPercent: number | null;
  scoringMode: "STANDARD" | "PARTIAL_CREDIT" | "NEGATIVE_MARKING";
  feedbackMode: "NONE" | "AFTER_SUBMIT" | "DETAILED";
  showScoreImmediately: boolean;
  showCorrectAnswers: boolean;
  showExplanation: boolean;
  reviewWindowMin: number | null;
}>({
  title: "",
  description: null,
  code: null,
  status: "DRAFT",
  subjectId: 0,
  examType: "PRACTICE",
  totalPoints: null,
  passMarkPercent: null,
  scoringMode: "STANDARD",
  feedbackMode: "DETAILED",
  showScoreImmediately: true,
  showCorrectAnswers: false,
  showExplanation: false,
  reviewWindowMin: null,
});
function openAdd() {
  isEdit.value = false;
  modalStep.value = "info";
  form.title = "";
  form.description = null;
  form.code = null;
  form.status = "DRAFT";
  form.subjectId = 0;
  form.examType = "PRACTICE";
  form.totalPoints = null;
  form.passMarkPercent = null;
  form.scoringMode = "STANDARD";
  form.feedbackMode = "DETAILED";
  form.showScoreImmediately = true;
  form.showCorrectAnswers = false;
  form.showExplanation = false;
  form.reviewWindowMin = null;
  showModal.value = true;
}
function openEdit(e: ExamRow) {
  isEdit.value = true;
  modalStep.value = "info";
  (async () => {
    try {
      const { data } = await api.get(`/exams/${e.id}`);
      (form as any).id = data.id;
      form.title = data.title;
      form.description = data.description ?? null;
      form.code = data.code ?? null;
      form.status = data.status;
      form.subjectId = data.subjectId ?? 0;
      form.examType = data.examType || "PRACTICE";
      form.totalPoints =
        typeof data.totalPoints === "number"
          ? data.totalPoints
          : typeof data.totalPoints === "string"
          ? Number(data.totalPoints)
          : null;
      form.passMarkPercent = data.passMarkPercent ?? null;
      form.scoringMode = data.scoringMode || "STANDARD";
      form.feedbackMode = data.feedbackMode || "DETAILED";
      form.showScoreImmediately = !!data.showScoreImmediately;
      form.showCorrectAnswers = !!data.showCorrectAnswers;
      form.showExplanation = !!data.showExplanation;
      form.reviewWindowMin = data.reviewWindowMin ?? null;
      showModal.value = true;
    } catch (err: any) {
      alert(err?.message || "Không thể tải dữ liệu đề thi");
    }
  })();
}
function closeModal() {
  showModal.value = false;
}
async function gotoQuestionStep() {
  try {
    saving.value = true;
    // Ensure exam exists (create if needed)
    if (!form.id) {
      const { data } = await api.post(`/exams`, {
        title: form.title,
        description: form.description,
        code: form.code,
        status: form.status,
        subjectId: form.subjectId || null,
        examType: form.examType,
        totalPoints: form.totalPoints,
        passMarkPercent: form.passMarkPercent,
        scoringMode: form.scoringMode,
        feedbackMode: form.feedbackMode,
        showScoreImmediately: form.showScoreImmediately,
        showCorrectAnswers: form.showCorrectAnswers,
        showExplanation: form.showExplanation,
        reviewWindowMin: form.reviewWindowMin,
      });
      (form as any).id = data.id;
      isEdit.value = true;
    } else {
      await api.put(`/exams/${form.id}`, {
        title: form.title,
        description: form.description,
        code: form.code,
        status: form.status,
        subjectId: form.subjectId || null,
        examType: form.examType,
        totalPoints: form.totalPoints,
        passMarkPercent: form.passMarkPercent,
        scoringMode: form.scoringMode,
        feedbackMode: form.feedbackMode,
        showScoreImmediately: form.showScoreImmediately,
        showCorrectAnswers: form.showCorrectAnswers,
        showExplanation: form.showExplanation,
        reviewWindowMin: form.reviewWindowMin,
      });
    }
    modalStep.value = "questions";
    await Promise.all([loadExamQuestions(), loadBankQuestions()]);
    // refresh list outside
    load();
  } catch (e: any) {
    alert(e?.message || "Không thể lưu đề thi");
  } finally {
    saving.value = false;
  }
}
async function submitModal() {
  saving.value = true;
  try {
    if (isEdit.value && form.id) {
      await api.put(`/exams/${form.id}`, {
        title: form.title,
        description: form.description,
        code: form.code,
        status: form.status,
        subjectId: form.subjectId || null,
        examType: form.examType,
        totalPoints: form.totalPoints,
        passMarkPercent: form.passMarkPercent,
        scoringMode: form.scoringMode,
        feedbackMode: form.feedbackMode,
        showScoreImmediately: form.showScoreImmediately,
        showCorrectAnswers: form.showCorrectAnswers,
        showExplanation: form.showExplanation,
        reviewWindowMin: form.reviewWindowMin,
      });
    } else {
      await api.post("/exams", {
        title: form.title,
        description: form.description,
        code: form.code,
        status: form.status,
        subjectId: form.subjectId || null,
        examType: form.examType,
        totalPoints: form.totalPoints,
        passMarkPercent: form.passMarkPercent,
        scoringMode: form.scoringMode,
        feedbackMode: form.feedbackMode,
        showScoreImmediately: form.showScoreImmediately,
        showCorrectAnswers: form.showCorrectAnswers,
        showExplanation: form.showExplanation,
        reviewWindowMin: form.reviewWindowMin,
      });
    }
    closeModal();
    load();
  } catch (e: any) {
    alert(e?.message || "Không thể lưu");
  } finally {
    saving.value = false;
  }
}

async function delOne(e: ExamRow) {
  if (!confirm(`Xóa đề thi "${e.title}"?`)) return;
  try {
    await api.delete(`/exams/${e.id}`);
    load();
  } catch (err: any) {
    alert(err?.message || "Không thể xóa");
  }
}

function openBank() {
  window.location.hash = "#/teacher/question-bank";
}

// === Question picker logic ===
type QuestionLite = { id: number; text: string; explanation: string | null };
const examQuestions = ref<QuestionLite[]>([]);
const selectedExamQuestionIds = reactive(new Set<number>());
const allExamQuestionsSelected = computed(
  () =>
    examQuestions.value.length > 0 &&
    examQuestions.value.every((q) => selectedExamQuestionIds.has(q.id))
);
function onToggleExamQuestion(id: number, ev: Event) {
  const c = (ev.target as HTMLInputElement).checked;
  if (c) selectedExamQuestionIds.add(id);
  else selectedExamQuestionIds.delete(id);
}
function toggleSelectAllExamQuestions(ev: Event) {
  const c = (ev.target as HTMLInputElement).checked;
  examQuestions.value.forEach((q) =>
    c ? selectedExamQuestionIds.add(q.id) : selectedExamQuestionIds.delete(q.id)
  );
}
async function loadExamQuestions() {
  const id = activeExamId.value;
  if (!id) return;
  const { data } = await api.get<Paginated<QuestionLite>>("/questions", {
    params: { examId: id, pageSize: 100 },
  });
  examQuestions.value = data.items || [];
  selectedExamQuestionIds.clear();
}
async function removeSelectedFromExam() {
  const id = activeExamId.value;
  if (!id || selectedExamQuestionIds.size === 0) return;
  if (!confirm(`Gỡ ${selectedExamQuestionIds.size} câu hỏi khỏi đề #${id}?`))
    return;
  for (const qid of Array.from(selectedExamQuestionIds)) {
    try {
      await api.delete(`/exams/${id}/questions/${qid}`);
    } catch {}
  }
  await loadExamQuestions();
}

// bank list
const bankSubjectId = ref(0);
const bankAll = ref<QuestionLite[]>([]);
const bankSearch = ref("");
const selectedBankIds = reactive(new Set<number>());
const filteredBankQuestions = computed(() => {
  const q = bankSearch.value.trim().toLowerCase();
  if (!q) return bankAll.value;
  return bankAll.value.filter(
    (it) => it.text.toLowerCase().includes(q) || String(it.id).includes(q)
  );
});
const allBankSelected = computed(
  () =>
    filteredBankQuestions.value.length > 0 &&
    filteredBankQuestions.value.every((q) => selectedBankIds.has(q.id))
);
function onToggleBank(id: number, ev: Event) {
  const c = (ev.target as HTMLInputElement).checked;
  if (c) selectedBankIds.add(id);
  else selectedBankIds.delete(id);
}
function toggleSelectAllBank(ev: Event) {
  const c = (ev.target as HTMLInputElement).checked;
  filteredBankQuestions.value.forEach((q) =>
    c ? selectedBankIds.add(q.id) : selectedBankIds.delete(q.id)
  );
}
function filterBank() {
  // computed handles filtering
}
async function loadBankQuestions() {
  const params: any = { pageSize: 100 };
  if (bankSubjectId.value > 0) params.subjectId = bankSubjectId.value;
  const { data } = await api.get<Paginated<QuestionLite>>("/questions", {
    params,
  });
  bankAll.value = data.items || [];
  selectedBankIds.clear();
}
const defaultAddPoints = ref(1);
async function addSelectedToExam() {
  const id = activeExamId.value;
  if (!id || selectedBankIds.size === 0) return;
  const questionIds = Array.from(selectedBankIds);
  await api.post(`/exams/${id}/questions`, {
    questionIds,
    points: defaultAddPoints.value,
  });
  selectedBankIds.clear();
  await loadExamQuestions();
}

onMounted(async () => {
  try {
    const { data } = await api.get("/subjects");
    subjects.value = Array.isArray(data?.items)
      ? data.items.map((s: any) => ({ id: s.id, name: s.name }))
      : [];
  } catch {}
  load();
  // watch selection to load exam questions when selecting from list
  watch(
    () => selectedOneId.value,
    async (val) => {
      if (val && modalStep.value !== "questions") {
        await Promise.all([loadExamQuestions(), loadBankQuestions()]);
      } else if (!val && modalStep.value !== "questions") {
        examQuestions.value = [];
        bankAll.value = [];
      }
    }
  );
});

// active exam id for question picker: modal step takes precedence
const activeExamId = computed(() =>
  modalStep.value === "questions" && form.id ? form.id : selectedOneId.value
);

// === View modal ===
const showView = ref(false);
const viewExam = ref<any | null>(null);
const viewQuestions = ref<QuestionLite[]>([]);
async function openView(e: ExamRow) {
  showView.value = true;
  viewExam.value = null;
  viewQuestions.value = [];
  try {
    const [{ data: exam }, { data: qres }] = await Promise.all([
      api.get(`/exams/${e.id}`),
      api.get<Paginated<QuestionLite>>(`/questions`, {
        params: { examId: e.id, pageSize: 100 },
      }),
    ]);
    viewExam.value = exam;
    viewQuestions.value = qres.items || [];
  } catch (err: any) {
    alert(err?.message || "Không thể tải đề thi");
  }
}
function closeView() {
  showView.value = false;
}
</script>

<style scoped>
@media (max-width: 575.98px) {
  .table td,
  .table th {
    padding: 0.5rem;
  }
}
.pagination {
  gap: 0.25rem;
}
</style>
