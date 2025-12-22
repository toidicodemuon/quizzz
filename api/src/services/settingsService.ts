import { prisma } from "../utils/prisma";

const CAPTCHA_SETTING_KEY = "captchaEnabled";

export type PublicSettings = {
  captchaEnabled: boolean;
  recaptchaSiteKey: string | null;
};

export async function getCaptchaEnabled(): Promise<boolean> {
  const setting = await prisma.appSetting.findUnique({
    where: { key: CAPTCHA_SETTING_KEY },
  });
  return setting?.value === "true";
}

export async function getPublicSettings(): Promise<PublicSettings> {
  const captchaEnabled = await getCaptchaEnabled();
  const recaptchaSiteKey = process.env.RECAPTCHA_SITE_KEY?.trim() || null;
  return { captchaEnabled, recaptchaSiteKey };
}

export async function updateCaptchaEnabled(
  enabled: boolean
): Promise<PublicSettings> {
  await prisma.appSetting.upsert({
    where: { key: CAPTCHA_SETTING_KEY },
    update: { value: String(enabled) },
    create: { key: CAPTCHA_SETTING_KEY, value: String(enabled) },
  });
  return getPublicSettings();
}
