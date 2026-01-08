<template>
  <div class="card">
    <div class="card-header d-flex align-items-center justify-content-between">
      <h5 class="mb-0">Audit Logs</h5>
      <div class="btn-group btn-group-sm">
        <button
          class="btn"
          :class="activeTab === 'audit' ? 'btn-primary' : 'btn-outline-secondary'"
          type="button"
          @click="activeTab = 'audit'"
        >
          Audit Logs
        </button>
        <button
          class="btn"
          :class="activeTab === 'sessions' ? 'btn-primary' : 'btn-outline-secondary'"
          type="button"
          @click="activeTab = 'sessions'"
        >
          Sessions
        </button>
      </div>
    </div>
    <div class="card-body">
      <div v-show="activeTab === 'audit'">
        <div class="row g-2 align-items-end mb-3">
          <div class="col-12 col-md-4">
            <label class="form-label small text-muted">Search</label>
            <input
              type="search"
              class="form-control form-control-sm"
              v-model.trim="auditFilters.search"
              placeholder="Email, name, or code"
              @keyup.enter="applyAuditFilters()"
            />
          </div>
          <div class="col-12 col-md-3">
            <label class="form-label small text-muted">Action</label>
            <select
              class="form-select form-select-sm"
              v-model="auditFilters.action"
              @change="applyAuditFilters()"
            >
              <option value="">All</option>
              <option v-for="action in auditActions" :key="action" :value="action">
                {{ action }}
              </option>
            </select>
          </div>
          <div class="col-6 col-md-2">
            <label class="form-label small text-muted">From</label>
            <input
              type="date"
              class="form-control form-control-sm"
              v-model="auditFilters.from"
              @change="applyAuditFilters()"
            />
          </div>
          <div class="col-6 col-md-2">
            <label class="form-label small text-muted">To</label>
            <input
              type="date"
              class="form-control form-control-sm"
              v-model="auditFilters.to"
              @change="applyAuditFilters()"
            />
          </div>
          <div class="col-12 col-md-1 d-flex justify-content-end">
            <button
              class="btn btn-outline-secondary btn-sm"
              type="button"
              :disabled="auditLoading"
              @click="fetchAuditLogs()"
            >
              <i class="bi bi-arrow-repeat" :class="{ spin: auditLoading }"></i>
            </button>
          </div>
        </div>

        <DataTable
          :columns="auditColumns"
          :items="auditItems"
          :loading="auditLoading"
          row-key="id"
          :empty-text="auditLoading ? 'Loading...' : 'No audit logs'"
        >
          <template #cell-createdAt="{ value }">
            {{ formatDate(value) }}
          </template>
          <template #cell-action="{ value }">
            <span class="badge" :class="actionBadge(value)">{{ value }}</span>
          </template>
          <template #cell-user="{ row }">
            <div class="fw-semibold">{{ formatUser(row.user) }}</div>
            <div class="text-muted small" v-if="row.user">
              {{ row.user.email || row.user.userCode || "" }}
            </div>
          </template>
          <template #cell-userAgent="{ value }">
            <span class="text-muted small">{{ value || "-" }}</span>
          </template>
          <template #cell-meta="{ value }">
            <code
              class="small"
              :title="formatMeta(value)"
            >{{ truncate(formatMeta(value), 120) || "-" }}</code>
          </template>
        </DataTable>

        <div class="mt-3">
          <Pagination
            v-model:page="auditPage"
            v-model:page-size="auditPageSize"
            :total="auditTotal"
            :disabled="auditLoading"
            :page-size-options="[10, 20, 30, 40, 50]"
          />
        </div>
      </div>

      <div v-show="activeTab === 'sessions'">
        <div class="row g-2 align-items-end mb-3">
          <div class="col-12 col-md-5">
            <label class="form-label small text-muted">Search</label>
            <input
              type="search"
              class="form-control form-control-sm"
              v-model.trim="sessionFilters.search"
              placeholder="Email, name, or code"
              @keyup.enter="applySessionFilters()"
            />
          </div>
          <div class="col-12 col-md-3">
            <label class="form-label small text-muted">Status</label>
            <select
              class="form-select form-select-sm"
              v-model="sessionFilters.status"
              @change="applySessionFilters()"
            >
              <option value="">All</option>
              <option value="active">Active</option>
              <option value="revoked">Revoked</option>
              <option value="logged_out">Logged out</option>
            </select>
          </div>
          <div class="col-12 col-md-4 d-flex justify-content-end">
            <button
              class="btn btn-outline-secondary btn-sm"
              type="button"
              :disabled="sessionLoading"
              @click="fetchSessions()"
            >
              <i class="bi bi-arrow-repeat" :class="{ spin: sessionLoading }"></i>
            </button>
          </div>
        </div>

        <DataTable
          :columns="sessionColumns"
          :items="sessionItems"
          :loading="sessionLoading"
          row-key="id"
          :empty-text="sessionLoading ? 'Loading...' : 'No sessions'"
        >
          <template #cell-user="{ row }">
            <div class="fw-semibold">{{ formatUser(row.user) }}</div>
            <div class="text-muted small" v-if="row.user">
              {{ row.user.email || row.user.userCode || "" }}
            </div>
          </template>
          <template #cell-status="{ row }">
            <span class="badge" :class="sessionBadge(row)">
              {{ sessionLabel(row) }}
            </span>
          </template>
          <template #cell-lastSeenAt="{ value }">
            {{ formatDate(value) }}
          </template>
          <template #cell-endedAt="{ row }">
            {{ formatDate(row.revokedAt || row.logoutAt) }}
          </template>
          <template #cell-userAgent="{ value }">
            <span class="text-muted small">{{ value || "-" }}</span>
          </template>
        </DataTable>

        <div class="mt-3">
          <Pagination
            v-model:page="sessionPage"
            v-model:page-size="sessionPageSize"
            :total="sessionTotal"
            :disabled="sessionLoading"
            :page-size-options="[10, 20, 30, 40, 50]"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch } from "vue";
import api, { type Paginated } from "../../api";
import DataTable from "../../components/common/DataTable.vue";
import Pagination from "../../components/common/Pagination.vue";

defineOptions({ name: "AdminLogs" });

type AuditUser = {
  id: number;
  email: string | null;
  fullName: string | null;
  userCode: string | null;
  role: string;
};

type AuditLogItem = {
  id: number;
  userId: number | null;
  action: string;
  ip: string | null;
  userAgent: string | null;
  meta: any;
  createdAt: string | Date;
  user: AuditUser | null;
};

type SessionItem = {
  id: number;
  userId: number;
  ip: string | null;
  userAgent: string | null;
  createdAt: string | Date;
  lastSeenAt: string | Date;
  logoutAt: string | Date | null;
  revokedAt: string | Date | null;
  user: AuditUser | null;
};

const activeTab = ref<"audit" | "sessions">("audit");

const auditActions = [
  "LOGIN_SUCCESS",
  "LOGIN_FAILURE",
  "REFRESH_SUCCESS",
  "REFRESH_FAILED",
  "REFRESH_EXPIRED",
  "REFRESH_REUSE",
  "LOGOUT",
  "TOKEN_REVOKE_ALL",
];

const auditFilters = reactive({
  search: "",
  action: "",
  from: "",
  to: "",
});
const auditLoading = ref(false);
const auditItems = ref<AuditLogItem[]>([]);
const auditTotal = ref(0);
const auditPage = ref(1);
const auditPageSize = ref(20);

const auditColumns = [
  { key: "createdAt", title: "Time" },
  { key: "action", title: "Action" },
  { key: "user", title: "User" },
  { key: "ip", title: "IP" },
  { key: "userAgent", title: "Agent" },
  { key: "meta", title: "Meta" },
];

const sessionFilters = reactive({
  search: "",
  status: "",
});
const sessionLoading = ref(false);
const sessionItems = ref<SessionItem[]>([]);
const sessionTotal = ref(0);
const sessionPage = ref(1);
const sessionPageSize = ref(20);

const sessionColumns = [
  { key: "user", title: "User" },
  { key: "status", title: "Status", thClass: "text-center", tdClass: "text-center" },
  { key: "lastSeenAt", title: "Last Seen" },
  { key: "endedAt", title: "Ended" },
  { key: "ip", title: "IP" },
  { key: "userAgent", title: "Agent" },
];

async function fetchAuditLogs() {
  auditLoading.value = true;
  try {
    const params: any = { page: auditPage.value, pageSize: auditPageSize.value };
    if (auditFilters.search) params.search = auditFilters.search;
    if (auditFilters.action) params.action = auditFilters.action;
    if (auditFilters.from) params.from = auditFilters.from;
    if (auditFilters.to) params.to = auditFilters.to;
    const res = await api.get<Paginated<AuditLogItem>>("/admin/audit-logs", {
      params,
    });
    auditItems.value = res.data?.items || [];
    auditTotal.value = res.data?.total || 0;
  } catch (e) {
    console.error(e);
    alert("Failed to load audit logs.");
  } finally {
    auditLoading.value = false;
  }
}

async function fetchSessions() {
  sessionLoading.value = true;
  try {
    const params: any = { page: sessionPage.value, pageSize: sessionPageSize.value };
    if (sessionFilters.search) params.search = sessionFilters.search;
    if (sessionFilters.status) params.status = sessionFilters.status;
    const res = await api.get<Paginated<SessionItem>>("/admin/sessions", {
      params,
    });
    sessionItems.value = res.data?.items || [];
    sessionTotal.value = res.data?.total || 0;
  } catch (e) {
    console.error(e);
    alert("Failed to load sessions.");
  } finally {
    sessionLoading.value = false;
  }
}

function applyAuditFilters() {
  auditPage.value = 1;
  fetchAuditLogs();
}

function applySessionFilters() {
  sessionPage.value = 1;
  fetchSessions();
}

watch([auditPage, auditPageSize], () => fetchAuditLogs());
watch([sessionPage, sessionPageSize], () => fetchSessions());

onMounted(() => {
  fetchAuditLogs();
  fetchSessions();
});

function formatDate(v?: string | Date | null): string {
  if (!v) return "-";
  try {
    const d = new Date(v);
    if (Number.isNaN(d.getTime())) return "-";
    return d.toLocaleString();
  } catch {
    return "-";
  }
}

function formatUser(user: AuditUser | null): string {
  if (!user) return "System";
  return user.fullName || user.userCode || user.email || `#${user.id}`;
}

function formatMeta(meta: any): string {
  if (!meta) return "";
  try {
    return JSON.stringify(meta);
  } catch {
    return String(meta);
  }
}

function truncate(value: string, max: number): string {
  if (!value) return "";
  return value.length > max ? value.slice(0, max) + "..." : value;
}

function actionBadge(action: string): string {
  const upper = String(action || "").toUpperCase();
  if (upper.includes("SUCCESS")) return "bg-success";
  if (upper.includes("FAIL") || upper.includes("EXPIRED") || upper.includes("REUSE")) return "bg-danger";
  if (upper.includes("LOGOUT") || upper.includes("REVOKE")) return "bg-warning text-dark";
  return "bg-secondary";
}

const ONLINE_WINDOW_MS = 2 * 60 * 1000;

function sessionLabel(row: SessionItem): string {
  if (row.revokedAt) return "Revoked";
  if (row.logoutAt) return "Logged out";
  const last = new Date(row.lastSeenAt);
  if (!Number.isNaN(last.getTime()) && Date.now() - last.getTime() <= ONLINE_WINDOW_MS) {
    return "Online";
  }
  return "Idle";
}

function sessionBadge(row: SessionItem): string {
  const label = sessionLabel(row);
  if (label === "Online") return "bg-success";
  if (label === "Idle") return "bg-secondary";
  if (label === "Logged out") return "bg-warning text-dark";
  return "bg-danger";
}
</script>

<style scoped>
.spin {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
