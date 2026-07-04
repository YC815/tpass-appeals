// 把答案值轉成人話字串（後台明細頁 + Discord 通知共用）。裁剪自 tpass-form 的
// answer-format.ts，只留這裡實際會用到的 5 種題型。
import type { QuestionView } from "@/lib/questions";
import type { UploadedFile } from "@/components/QuestionRenderer";

export function answerToText(q: QuestionView, value: unknown): string {
  if (value === undefined || value === null) return "";

  switch (q.type) {
    case "short_text":
    case "paragraph":
      return typeof value === "string" ? value : "";
    case "single_choice":
      return q.options?.find((o) => o.id === value)?.label ?? "";
    case "multi_choice": {
      if (!Array.isArray(value)) return "";
      const byId = new Map(q.options?.map((o) => [o.id, o.label]));
      return value.map((v) => byId.get(v as string) ?? "").filter(Boolean).join("、");
    }
    case "file_upload": {
      if (!Array.isArray(value)) return "";
      return (value as UploadedFile[]).map((f) => f.name).join("、");
    }
    default:
      return "";
  }
}
