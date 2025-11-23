<template>
  <div class="dashboard">
    <div class="card border-0 shadow-sm hero mb-4">
      <div
        class="card-body d-flex flex-wrap align-items-center justify-content-between gap-3"
      >
        <div>
          <p class="text-uppercase text-muted small mb-1">Xin chào, giáo viên</p>
          <h3 class="fw-semibold mb-2">Bảng điều khiển giám sát lớp thi</h3>
          <p class="mb-0 text-muted">
            Theo dõi nhanh đề thi, phòng đang mở và hoạt động làm bài theo thời gian thực.
          </p>
        </div>
        <div class="d-flex flex-wrap gap-2">
          <router-link to="/teacher/quiz/create" class="btn btn-primary">
            <i class="bi bi-plus-circle me-1"></i> Tạo đề thi
          </router-link>
          <router-link to="/teacher/room/create" class="btn btn-outline-light text-dark">
            <i class="bi bi-door-open me-1"></i> Mở phòng thi
          </router-link>
          <router-link to="/teacher/question-bank" class="btn btn-outline-light text-dark">
            <i class="bi bi-journal-text me-1"></i> Ngân hàng câu hỏi
          </router-link>
        </div>
      </div>
    </div>

    <div class="row g-3 mb-4">
      <div v-for="card in statCards" :key="card.title" class="col-12 col-md-6 col-lg-3">
        <div class="card h-100 shadow-sm border-0">
          <div class="card-body d-flex align-items-center gap-3">
            <span :class="['stat-icon', card.bg]">
              <i :class="card.icon"></i>
            </span>
            <div>
              <p class="text-muted text-uppercase small mb-1">{{ card.title }}</p>
              <h4 class="fw-semibold mb-0">{{ card.value }}</h4>
              <small class="text-muted">{{ card.sub }}</small>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row g-3">
      <div class="col-lg-7">
        <div class="card shadow-sm border-0 h-100">
          <div class="card-body">
            <div class="d-flex align-items-center justify-content-between mb-3">
              <h6 class="mb-0">Hoạt động gần đây</h6>
              <span class="badge bg-light text-muted">Live</span>
            </div>
            <ul class="list-group list-group-flush">
              <li
                v-for="(item, idx) in recent"
                :key="idx"
                class="list-group-item px-0 d-flex align-items-center justify-content-between"
              >
                <div class="d-flex align-items-center gap-3">
                  <span class="bullet"></span>
                  <div>
                    <div class="fw-semibold">{{ item.title }}</div>
                    <small class="text-muted">{{ item.desc }}</small>
                  </div>
                </div>
                <small class="text-muted">{{ item.time }}</small>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="col-lg-5">
        <div class="card shadow-sm border-0 h-100">
          <div class="card-body">
            <div class="d-flex align-items-center justify-content-between mb-3">
              <h6 class="mb-0">Phòng thi nhanh</h6>
              <router-link to="/teacher/room/create" class="small">Xem tất cả</router-link>
            </div>
            <div class="d-flex flex-column gap-3">
              <div
                v-for="(room, idx) in quickRooms"
                :key="idx"
                class="p-3 rounded border bg-light"
              >
                <div class="d-flex align-items-center justify-content-between">
                  <div>
                    <div class="fw-semibold">Phòng #{{ room.id }}</div>
                    <small class="text-muted">{{ room.exam }}</small>
                  </div>
                  <span :class="['badge', room.live ? 'bg-success' : 'bg-secondary']">
                    {{ room.live ? "Đang mở" : "Chưa mở" }}
                  </span>
                </div>
                <div class="d-flex gap-3 mt-2 text-muted small">
                  <span><i class="bi bi-people me-1"></i>{{ room.attendees }} SV</span>
                  <span><i class="bi bi-clock-history me-1"></i>{{ room.time }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: "TeacherDashboard",
});

const statCards = [
  {
    title: "Đề thi",
    value: "12",
    sub: "4 đang mở",
    icon: "bi bi-file-earmark-text",
    bg: "bg-primary-soft",
  },
  {
    title: "Phòng thi",
    value: "6",
    sub: "2 phòng trực tuyến",
    icon: "bi bi-door-open",
    bg: "bg-success-soft",
  },
  {
    title: "Học viên đang thi",
    value: "38",
    sub: "Trong 3 phòng",
    icon: "bi bi-people",
    bg: "bg-warning-soft",
  },
  {
    title: "Bài nộp hôm nay",
    value: "54",
    sub: "Chấm tự động 100%",
    icon: "bi bi-clipboard-check",
    bg: "bg-info-soft",
  },
];

const recent = [
  {
    title: "Phòng #241 vừa mở",
    desc: "Đề: Giải tích 1 - ca sáng",
    time: "2 phút trước",
  },
  {
    title: "18 sinh viên bắt đầu làm bài",
    desc: "Phòng #238",
    time: "12 phút trước",
  },
  {
    title: "Bài thi #5521 đã nộp",
    desc: "Sinh viên: Lê Minh Khoa",
    time: "30 phút trước",
  },
  {
    title: "Thêm 10 câu hỏi mới",
    desc: "Chủ đề: OOP cơ bản",
    time: "1 giờ trước",
  },
];

const quickRooms = [
  { id: 241, exam: "Giải tích 1 - ca sáng", attendees: 23, time: "08:30 - 10:00", live: true },
  { id: 238, exam: "Lập trình C++", attendees: 12, time: "09:00 - 10:30", live: true },
  { id: 235, exam: "CSDL nâng cao", attendees: 0, time: "Chiều nay", live: false },
];
</script>

<style scoped>
.dashboard .hero {
  background: linear-gradient(120deg, #f0f5ff 0%, #f6fdf6 100%);
}
.stat-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}
.bg-primary-soft {
  background: rgba(13, 110, 253, 0.12);
  color: #0d6efd;
}
.bg-success-soft {
  background: rgba(25, 135, 84, 0.12);
  color: #198754;
}
.bg-warning-soft {
  background: rgba(255, 193, 7, 0.16);
  color: #b58100;
}
.bg-info-soft {
  background: rgba(13, 202, 240, 0.16);
  color: #0aa2c0;
}
.bullet {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0d6efd, #6610f2);
  display: inline-block;
}
.date-picker-wrap .form-control[readonly] {
  background-color: #fff;
}
</style>
