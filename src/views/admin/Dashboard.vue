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
      <div class="card-title">Login Security</div>
    </div>
    <div class="card-body">
      <div class="d-flex flex-wrap align-items-center justify-content-between gap-4">
        <div>
          <div class="fw-semibold">Enable captcha on login</div>
          <div class="text-muted fs-7">
            Require captcha verification for all login attempts.
          </div>
        </div>
        <div class="form-check form-switch form-check-custom form-check-solid">
          <input
            class="form-check-input"
            type="checkbox"
            :checked="captchaEnabled"
            :disabled="loading"
            @change="onToggleCaptcha"
          />
        </div>
      </div>
      <div v-if="captchaEnabled && !recaptchaSiteKey" class="text-warning fs-7 mt-3">
        RECAPTCHA_SITE_KEY is missing on the API server.
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import ApiService from "@/core/services/ApiService";
import Swal from "sweetalert2/dist/sweetalert2.js";

export default defineComponent({
  name: "admin-dashboard",
  setup() {
    const captchaEnabled = ref(false);
    const recaptchaSiteKey = ref<string | null>(null);
    const loading = ref(false);

    const loadSettings = async () => {
      const { data } = await ApiService.get("settings");
      captchaEnabled.value = Boolean(data?.captchaEnabled);
      recaptchaSiteKey.value = data?.recaptchaSiteKey || null;
    };

    const onToggleCaptcha = async () => {
      if (loading.value) return;
      loading.value = true;
      try {
        const { data } = await ApiService.put("settings", {
          captchaEnabled: !captchaEnabled.value,
        });
        captchaEnabled.value = Boolean(data?.captchaEnabled);
        recaptchaSiteKey.value = data?.recaptchaSiteKey || null;
        Swal.fire({
          text: "Settings updated successfully.",
          icon: "success",
          buttonsStyling: false,
          confirmButtonText: "Ok",
          heightAuto: false,
          customClass: {
            confirmButton: "btn fw-semobold btn-light-primary",
          },
        });
      } catch (error: any) {
        Swal.fire({
          text: error?.response?.data?.message || "Failed to update settings.",
          icon: "error",
          buttonsStyling: false,
          confirmButtonText: "Ok",
          heightAuto: false,
          customClass: {
            confirmButton: "btn fw-semobold btn-light-danger",
          },
        });
      } finally {
        loading.value = false;
      }
    };

    onMounted(async () => {
      try {
        await loadSettings();
      } catch (error) {
        captchaEnabled.value = false;
      }
    });

    return {
      captchaEnabled,
      recaptchaSiteKey,
      loading,
      onToggleCaptcha,
    };
  },
});
</script>


