// ★ 題型定義的單一真相（zod + 型別）★ 只有一份表單、題目彼此獨立，
// 不做 tpass-form 那種分段/跳轉——申訴表單用不到，硬做只是多餘的特殊情況。
import { z } from "zod";
import { customAlphabet } from "nanoid";

const nano = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 10);
export const newId = (prefix = "") => (prefix ? `${prefix}_${nano()}` : nano());

export const QUESTION_TYPES = [
  "short_text",
  "paragraph",
  "single_choice",
  "multi_choice",
  "file_upload",
] as const;
export const qTypeSchema = z.enum(QUESTION_TYPES);
export type QType = z.infer<typeof qTypeSchema>;

export const QUESTION_TYPE_LABELS: Record<QType, string> = {
  short_text: "短答",
  paragraph: "段落",
  single_choice: "單選",
  multi_choice: "多選（複選）",
  file_upload: "檔案上傳",
};

export const optionSchema = z.object({
  id: z.string().min(1),
  label: z.string(),
});
export type Option = z.infer<typeof optionSchema>;

export const optionsSchema = z.array(optionSchema);

export function createOption(label = "選項"): Option {
  return { id: newId("o"), label };
}

export function needsOptions(type: QType): boolean {
  return type === "single_choice" || type === "multi_choice";
}
