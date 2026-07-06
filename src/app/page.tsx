import Link from "next/link";
import { requireSession } from "@/lib/guard";
import { listQuestions } from "@/lib/questions";
import { getSettings } from "@/lib/settings";
import { authConfig } from "@/config/auth";
import { isAdmin } from "@/config/admin";
import { PortalLink } from "@/components/common/PortalLink";
import { AppealForm } from "@/components/AppealForm";

export default async function HomePage() {
  const session = await requireSession("/");
  const [questions, settings, admin] = await Promise.all([
    listQuestions(),
    getSettings(),
    isAdmin(session.email),
  ]);

  return (
    <div className="min-h-full flex flex-col">
      <header className="sticky top-0 z-50 h-16 bg-background/90 backdrop-blur-md border-b-2 border-foreground/20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
          <PortalLink href={authConfig.portalUrl} />
          <div className="flex items-center gap-3">
            {admin && (
              <Link
                href="/admin"
                className="rounded-md border-2 border-foreground bg-primary px-2.5 py-1 font-mono text-[11px] font-bold text-primary-foreground shadow-[2px_2px_0_0_var(--color-foreground)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_var(--color-foreground)]"
              >
                管理後台
              </Link>
            )}
            <form method="post" action={authConfig.logoutUrl}>
              <button
                type="submit"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                登出
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-8">
        <AppealForm
          title={settings.title}
          introText={settings.introText}
          acceptingResponses={settings.acceptingResponses}
          questions={questions}
          identityNotice={`以 ${session.name}（${session.email}）身分送出`}
        />
      </main>
    </div>
  );
}
