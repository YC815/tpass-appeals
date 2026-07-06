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
  // 只收 Discord webhook（https + 官方網域）：擋掉貼錯與「admin 帳號失守時
  // 把含個資的申訴通知導去任意主機」的外洩面（安全審查 L3）。
  if (discordWebhookUrl) {
    let parsed: URL;
    try {
      parsed = new URL(discordWebhookUrl);
    } catch {
      return { ok: false, error: "Discord Webhook URL 格式不正確。" };
    }
    const allowedHosts = ["discord.com", "discordapp.com"];
    if (parsed.protocol !== "https:" || !allowedHosts.includes(parsed.hostname)) {
      return { ok: false, error: "Webhook 必須是 https://discord.com/…（或 discordapp.com）。" };
    }
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
