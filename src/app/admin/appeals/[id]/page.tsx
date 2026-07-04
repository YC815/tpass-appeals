import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getAppeal } from "@/lib/appeals";
import { getQuestions } from "@/lib/questions";
import { answerToText } from "@/lib/answer-format";
import { gradeLabel } from "@/lib/grade";
import { Badge } from "@/components/ui/primitives";

export default async function AppealDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const appeal = await getAppeal(id);
  if (!appeal) notFound();

  const questions = await getQuestions(Object.keys(appeal.answers));
  const byId = new Map(questions.map((q) => [q.id, q]));

  return (
    <div>
      <Link
        href="/admin"
        className="inline-flex items-center gap-1.5 font-bold text-sm text-muted-foreground hover:text-foreground mb-4"
      >
        <ArrowLeft className="h-4 w-4" /> 回申訴案件列表
      </Link>

      <div className="rounded-2xl border-2 border-foreground bg-card p-5 shadow-[4px_4px_0_0_var(--color-foreground)] mb-6">
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="font-extrabold text-2xl">{appeal.respondentName}</h1>
          {appeal.respondentGrade && <Badge>{gradeLabel(appeal.respondentGrade)}</Badge>}
        </div>
        <p className="mt-1 font-mono text-[11px] text-muted-foreground">
          {appeal.respondentEmail} ·{" "}
          {appeal.submittedAt.toLocaleString("zh-TW", { timeZone: "Asia/Taipei" })}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {Object.entries(appeal.answers).map(([qid, value]) => {
          const q = byId.get(qid);
          if (!q) return null;
          return (
            <div
              key={qid}
              className="rounded-2xl border-2 border-foreground bg-card p-5 shadow-[3px_3px_0_0_var(--color-foreground)]"
            >
              <p className="font-bold">{q.title}</p>
              <p className="mt-2 font-medium whitespace-pre-wrap">
                {answerToText(q, value) || "（未作答）"}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
