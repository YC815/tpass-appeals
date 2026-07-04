import { listQuestions } from "@/lib/questions";
import { QuestionEditor } from "@/components/admin/QuestionEditor";

export default async function QuestionsPage() {
  const questions = await listQuestions();

  return (
    <div>
      <h1 className="font-extrabold text-2xl tracking-tight mb-2">題目管理</h1>
      <p className="font-medium text-muted-foreground mb-6">
        增刪改排申訴表單的題目，變更會立即反映在填寫頁（已送出的申訴答案不受影響）。
      </p>
      <QuestionEditor questions={questions} />
    </div>
  );
}
