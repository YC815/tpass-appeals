"use server";

// 送出申訴。身分一律由伺服器從驗章後的 session 戳記帶入（一律具名，不做匿名分支）。
import { Prisma } from "@prisma/client";
import { requireSession } from "@/lib/guard";
import { prisma } from "@/lib/db";
import { listQuestions } from "@/lib/questions";
import { validateAnswers, type AnswerMap } from "@/lib/answers";
import { getSettings } from "@/lib/settings";
import { deriveGrade } from "@/lib/grade";
import { postAppealToDiscord } from "@/lib/discord";

export interface SubmitResult {
  ok: boolean;
  errors?: Record<string, string>;
  message?: string;
}

export async function submitAppealAction(answers: AnswerMap): Promise<SubmitResult> {
  const session = await requireSession("/");
  const settings = await getSettings();
  if (!settings.acceptingResponses) {
    return { ok: false, message: "申訴系統目前沒有開放收件。" };
  }

  const questions = await listQuestions();
  if (questions.length === 0) {
    return { ok: false, message: "表單尚未設定題目，請聯繫學生會。" };
  }

  const fieldErrors = validateAnswers(questions, answers);
  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, errors: fieldErrors, message: "有題目尚未完成。" };
  }

  const respondentName = session.name;
  const respondentEmail = session.email;
  const respondentGrade = deriveGrade(session.email);

  // DB 為唯一真相來源／備份，永遠先寫這筆——Discord 通知失敗不影響這裡的結果。
  await prisma.appeal.create({
    data: {
      respondentSub: session.sub,
      respondentName,
      respondentEmail,
      respondentGrade,
      answers: answers as Prisma.InputJsonValue,
    },
  });

  await postAppealToDiscord(settings.discordWebhookUrl, questions, answers, {
    name: respondentName,
    email: respondentEmail,
  });

  return { ok: true };
}
