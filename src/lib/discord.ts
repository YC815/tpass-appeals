// 申訴送出後貼到 Discord 論壇頻道（一筆申訴 = 一個 thread）。純通知用途，
// 失敗只 log 不外拋——DB 才是唯一真相來源，Discord 掛掉不該讓學生看到送出失敗。
// 逾時保護比照 tmsg 的 src/lib/chat.ts（AbortSignal.timeout）。
import "server-only";
import type { QuestionView } from "@/lib/questions";
import { answerToText } from "@/lib/answer-format";

const TIMEOUT_MS = 10_000;

interface Respondent {
  name: string;
  email: string;
}

export async function postAppealToDiscord(
  webhookUrl: string | null,
  questions: QuestionView[],
  answers: Record<string, unknown>,
  respondent: Respondent,
): Promise<void> {
  if (!webhookUrl) return;

  const body = questions
    .map((q) => `**${q.title}**\n${answerToText(q, answers[q.id]) || "（未作答）"}`)
    .join("\n\n")
    .slice(0, 4000); // embed description 上限 4096，留緩衝

  const threadName = `${respondent.name} - ${new Date().toLocaleString("zh-TW", {
    timeZone: "Asia/Taipei",
  })}`.slice(0, 100);

  try {
    const res = await fetch(`${webhookUrl}?wait=true`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        thread_name: threadName,
        embeds: [
          {
            title: "新申訴",
            description: body,
            footer: { text: respondent.email },
            timestamp: new Date().toISOString(),
          },
        ],
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) {
      console.error(`[discord] 貼文失敗：HTTP ${res.status}`);
    }
  } catch (err) {
    const message =
      err instanceof Error && err.name === "TimeoutError" ? "逾時（10 秒）" : err;
    console.error("[discord] 貼文失敗", message);
  }
}
