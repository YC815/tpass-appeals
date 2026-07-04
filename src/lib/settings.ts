// 申訴系統設定（單例列）存取層。
import "server-only";
import { prisma } from "@/lib/db";

const SINGLETON_ID = "singleton";

export interface AppealSettingsView {
  title: string;
  introText: string;
  discordWebhookUrl: string | null;
  acceptingResponses: boolean;
}

export async function getSettings(): Promise<AppealSettingsView> {
  const row = await prisma.appealSettings.upsert({
    where: { id: SINGLETON_ID },
    create: { id: SINGLETON_ID },
    update: {},
  });
  return {
    title: row.title,
    introText: row.introText,
    discordWebhookUrl: row.discordWebhookUrl,
    acceptingResponses: row.acceptingResponses,
  };
}

export interface SettingsPatch {
  title?: string;
  introText?: string;
  discordWebhookUrl?: string | null;
  acceptingResponses?: boolean;
}

export async function updateSettings(patch: SettingsPatch): Promise<void> {
  await prisma.appealSettings.upsert({
    where: { id: SINGLETON_ID },
    create: { id: SINGLETON_ID, ...patch },
    update: patch,
  });
}
