// 申訴案件（提交紀錄）資料存取層。DB 為唯一真相來源／備份，不受 Discord 通知成敗影響。
import "server-only";
import { prisma } from "@/lib/db";

export interface AppealRow {
  id: string;
  respondentName: string;
  respondentEmail: string;
  respondentGrade: number | null;
  answers: Record<string, unknown>;
  submittedAt: Date;
}

export async function listAppeals(): Promise<AppealRow[]> {
  const rows = await prisma.appeal.findMany({ orderBy: { submittedAt: "desc" } });
  return rows.map(toRow);
}

export async function getAppeal(id: string): Promise<AppealRow | null> {
  const row = await prisma.appeal.findUnique({ where: { id } });
  return row ? toRow(row) : null;
}

function toRow(row: {
  id: string;
  respondentName: string;
  respondentEmail: string;
  respondentGrade: number | null;
  answers: unknown;
  submittedAt: Date;
}): AppealRow {
  return {
    id: row.id,
    respondentName: row.respondentName,
    respondentEmail: row.respondentEmail,
    respondentGrade: row.respondentGrade,
    answers: row.answers as Record<string, unknown>,
    submittedAt: row.submittedAt,
  };
}
