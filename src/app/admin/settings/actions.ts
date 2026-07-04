"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/guard";
import { updateSettings } from "@/lib/settings";

export interface SettingsResult {
  ok: boolean;
  error?: string;
}

export async function saveSettingsAction(
  _prev: SettingsResult | null,
  formData: FormData,
): Promise<SettingsResult> {
  await requireAdmin("/admin/settings");

  const title = String(formData.get("title") ?? "").trim();
  const introText = String(formData.get("introText") ?? "");
  const discordWebhookUrl = String(formData.get("discordWebhookUrl") ?? "").trim();
  const acceptingResponses = formData.get("acceptingResponses") === "on";

  if (!title) return { ok: false, error: "標題不能空白。" };
  if (discordWebhookUrl && !/^https?:\/\//.test(discordWebhookUrl)) {
    return { ok: false, error: "Discord Webhook URL 格式不正確。" };
  }

  await updateSettings({
    title,
    introText,
    discordWebhookUrl: discordWebhookUrl || null,
    acceptingResponses,
  });

  revalidatePath("/admin/settings");
  revalidatePath("/");
  return { ok: true };
}
