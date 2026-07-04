"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/guard";
import * as questions from "@/lib/questions";
import type { QuestionInput } from "@/lib/questions";

export interface QuestionActionResult {
  ok: boolean;
  error?: string;
}

export async function createQuestionAction(
  input: QuestionInput,
): Promise<QuestionActionResult> {
  await requireAdmin("/admin/questions");
  if (!input.title.trim()) return { ok: false, error: "題目標題不能空白。" };
  await questions.createQuestion(input);
  revalidatePath("/admin/questions");
  revalidatePath("/");
  return { ok: true };
}

export async function updateQuestionAction(
  id: string,
  input: QuestionInput,
): Promise<QuestionActionResult> {
  await requireAdmin("/admin/questions");
  if (!input.title.trim()) return { ok: false, error: "題目標題不能空白。" };
  await questions.updateQuestion(id, input);
  revalidatePath("/admin/questions");
  revalidatePath("/");
  return { ok: true };
}

export async function deleteQuestionAction(id: string): Promise<void> {
  await requireAdmin("/admin/questions");
  await questions.deleteQuestion(id);
  revalidatePath("/admin/questions");
  revalidatePath("/");
}

export async function moveQuestionAction(
  id: string,
  direction: "up" | "down",
): Promise<void> {
  await requireAdmin("/admin/questions");
  await questions.moveQuestion(id, direction);
  revalidatePath("/admin/questions");
  revalidatePath("/");
}
