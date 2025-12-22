<template>
  <!--begin::Wrapper-->
  <div class="w-lg-500px p-10">
    <!--begin::Form-->
    <VForm
      class="form w-100"
      id="kt_login_signin_form"
      @submit="onSubmitLogin"
      :validation-schema="login"
      :initial-values="{ username: 'teacher1', password: '123456' }"
    >
      <!--begin::Heading-->
      <div class="text-center mb-10">
        <!--begin::Title-->
        <h1 class="text-dark mb-3">Đăng nhập</h1>
        <!--end::Title-->

        <!--begin::Link-->
        <div class="text-gray-400 fw-semobold fs-4">
          Người mới?

          <router-link to="/sign-up" class="link-primary fw-bold">
            Tạo tài khoản
          </router-link>
        </div>
        <!--end::Link-->
      </div>
      <!--begin::Heading-->

      <!-- <div class="mb-10 bg-light-info p-8 rounded">
        <div class="text-info">
          Use account <strong>admin@demo.com</strong> and password
          <strong>demo</strong> to continue.
        </div>
      </div> -->

      <!--begin::Input group-->
      <div class="fv-row mb-10">
        <!--begin::Label-->
        <label class="form-label fs-6 fw-bold text-dark">Username</label>
        <!--end::Label-->

        <!--begin::Input-->
        <Field
          tabindex="1"
          class="form-control form-control-lg form-control-solid"
          type="text"
          name="username"
          autocomplete="off"
        />
        <!--end::Input-->
        <div class="fv-plugins-message-container">
          <div class="fv-help-block">
            <ErrorMessage name="username" />
          </div>
        </div>
      </div>
      <!--end::Input group-->

      <!--begin::Input group-->
      <div class="fv-row mb-10">
        <!--begin::Wrapper-->
        <div class="d-flex flex-stack mb-2">
          <!--begin::Label-->
          <label class="form-label fw-bold text-dark fs-6 mb-0">Password</label>
          <!--end::Label-->

          <!--begin::Link-->
          <router-link to="/password-reset" class="link-primary fs-6 fw-bold">
            Quên password ?
          </router-link>
          <!--end::Link-->
        </div>
        <!--end::Wrapper-->

        <!--begin::Input-->
        <Field
          tabindex="2"
          class="form-control form-control-lg form-control-solid"
          type="password"
          name="password"
          autocomplete="off"
        />
        <!--end::Input-->
        <div class="fv-plugins-message-container">
          <div class="fv-help-block">
            <ErrorMessage name="password" />
          </div>
        </div>
      </div>
      <!--end::Input group-->

      <div class="mb-10" v-if="captchaEnabled">
        <div v-if="recaptchaSiteKey" class="recaptcha">
          <div class="g-recaptcha" :data-sitekey="recaptchaSiteKey"></div>
        </div>
        <div v-else class="text-danger fs-7">
          Captcha is enabled but site key is missing.
        </div>
      </div>

      <!--begin::Actions-->
      <div class="text-center">
        <!--begin::Submit button-->
        <button
          tabindex="3"
          type="submit"
          ref="submitButton"
          id="kt_sign_in_submit"
          class="btn btn-lg btn-primary w-100 mb-5"
        >
          <span class="indicator-label"> Đăng nhập </span>

          <span class="indicator-progress">
            Vui lòng chờ...
            <span
              class="spinner-border spinner-border-sm align-middle ms-2"
            ></span>
          </span>
        </button>
        <!--end::Submit button-->

        <!--begin::Separator-->
        <!-- <div class="text-center text-muted text-uppercase fw-bold mb-5">or</div> -->
        <!--end::Separator-->

        <!--begin::Google link-->
        <!-- <a
          href="#"
          class="btn btn-flex flex-center btn-light btn-lg w-100 mb-5"
        >
          <img
            alt="Logo"
            :src="getAssetPath('media/svg/brand-logos/google-icon.svg')"
            class="h-20px me-3"
          />
          Continue with Google
        </a> -->
        <!--end::Google link-->

        <!--begin::Google link-->
        <!-- <a
          href="#"
          class="btn btn-flex flex-center btn-light btn-lg w-100 mb-5"
        >
          <img
            alt="Logo"
            :src="getAssetPath('media/svg/brand-logos/facebook-4.svg')"
            class="h-20px me-3"
          />
          Continue with Facebook
        </a> -->
        <!--end::Google link-->

        <!--begin::Google link-->
        <!-- <a href="#" class="btn btn-flex flex-center btn-light btn-lg w-100">
          <img
            alt="Logo"
            :src="getAssetPath('media/svg/brand-logos/apple-black.svg')"
            class="h-20px me-3"
          />
          Continue with Apple
        </a> -->
        <!--end::Google link-->
      </div>
      <!--end::Actions-->
    </VForm>
    <!--end::Form-->
  </div>
  <!--end::Wrapper-->
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent, ref, onMounted } from "vue";
import { ErrorMessage, Field, Form as VForm } from "vee-validate";
import { useAuthStore, type LoginPayload } from "@/stores/auth";
import { useRouter } from "vue-router";
import Swal from "sweetalert2/dist/sweetalert2.js";
import * as Yup from "yup";
import ApiService from "@/core/services/ApiService";

export default defineComponent({
  name: "sign-in",
  components: {
    Field,
    VForm,
    ErrorMessage,
  },
  setup() {
    const store = useAuthStore();
    const router = useRouter();

    const submitButton = ref<HTMLButtonElement | null>(null);
    const captchaEnabled = ref(false);
    const recaptchaSiteKey = ref<string | null>(null);

    //Create form validation object
    const login = Yup.object().shape({
      username: Yup.string().required().label("Username"),
      password: Yup.string().min(4).required().label("Password"),
    });

    const loadRecaptchaScript = () =>
      new Promise<void>((resolve) => {
        if ((window as any).grecaptcha) return resolve();
        const existing = document.querySelector(
          'script[data-recaptcha="true"]'
        );
        if (existing) {
          existing.addEventListener("load", () => resolve());
          return;
        }
        const script = document.createElement("script");
        script.src = "https://www.google.com/recaptcha/api.js";
        script.async = true;
        script.defer = true;
        script.setAttribute("data-recaptcha", "true");
        script.onload = () => resolve();
        document.head.appendChild(script);
      });

    const getCaptchaToken = () => {
      const grecaptcha = (window as any).grecaptcha;
      return typeof grecaptcha?.getResponse === "function"
        ? grecaptcha.getResponse()
        : "";
    };

    const resetCaptcha = () => {
      const grecaptcha = (window as any).grecaptcha;
      if (typeof grecaptcha?.reset === "function") {
        grecaptcha.reset();
      }
    };

    onMounted(async () => {
      try {
        const { data } = await ApiService.get("settings", "public");
        captchaEnabled.value = Boolean(data?.captchaEnabled);
        recaptchaSiteKey.value = data?.recaptchaSiteKey || null;
        if (captchaEnabled.value && recaptchaSiteKey.value) {
          await loadRecaptchaScript();
        }
      } catch (error) {
        captchaEnabled.value = false;
      }
    });

    //Form submit function
    const onSubmitLogin = async (values: any) => {
      values = values as LoginPayload;
      // Clear existing errors
      store.logout();

      if (submitButton.value) {
        // eslint-disable-next-line
        submitButton.value!.disabled = true;
        // Activate indicator
        submitButton.value.setAttribute("data-kt-indicator", "on");
      }

      if (captchaEnabled.value) {
        if (!recaptchaSiteKey.value) {
          Swal.fire({
            text: "Captcha is enabled but not configured.",
            icon: "error",
            buttonsStyling: false,
            confirmButtonText: "Ok",
            heightAuto: false,
            customClass: {
              confirmButton: "btn fw-semobold btn-light-danger",
            },
          });
          submitButton.value?.removeAttribute("data-kt-indicator");
          submitButton.value!.disabled = false;
          return;
        }
        const token = getCaptchaToken();
        if (!token) {
          Swal.fire({
            text: "Please complete the captcha.",
            icon: "error",
            buttonsStyling: false,
            confirmButtonText: "Ok",
            heightAuto: false,
            customClass: {
              confirmButton: "btn fw-semobold btn-light-danger",
            },
          });
          submitButton.value?.removeAttribute("data-kt-indicator");
          submitButton.value!.disabled = false;
          return;
        }
        values.captchaToken = token;
      }

      // Send login request
      await store.login(values);
      const error = Object.values(store.errors);

      if (error.length === 0) {
        Swal.fire({
          text: "Đăng nhập thành công!",
          icon: "success",
          buttonsStyling: false,
          confirmButtonText: "Ok, got it!",
          heightAuto: false,
          customClass: {
            confirmButton: "btn fw-semobold btn-light-primary",
          },
        }).then(() => {
          // Go to page after successfully login
          const role = String(store.user?.role || "").toUpperCase();
          if (role === "TEACHER") {
            router.push({ name: "teacher-dashboard" });
          } else if (role === "STUDENT") {
            router.push({ name: "student-dashboard" });
          } else if (role === "ADMIN") {
            router.push({ name: "admin-dashboard" });
          } else {
            router.push({ name: "dashboard" });
          }
        });
      } else {
        Swal.fire({
          text: error[0] as string,
          icon: "error",
          buttonsStyling: false,
          confirmButtonText: "Try again!",
          heightAuto: false,
          customClass: {
            confirmButton: "btn fw-semobold btn-light-danger",
          },
        }).then(() => {
          store.errors = {};
        });
        if (captchaEnabled.value) {
          resetCaptcha();
        }
      }

      //Deactivate indicator
      submitButton.value?.removeAttribute("data-kt-indicator");
      // eslint-disable-next-line
      submitButton.value!.disabled = false;
    };

    return {
      onSubmitLogin,
      login,
      submitButton,
      getAssetPath,
      captchaEnabled,
      recaptchaSiteKey,
    };
  },
});
</script>
