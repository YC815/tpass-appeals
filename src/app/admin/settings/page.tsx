import { getSettings } from "@/lib/settings";
import { SettingsForm } from "@/components/admin/SettingsForm";

export default async function SettingsPage() {
  const settings = await getSettings();

  return (
    <div>
      <h1 className="font-extrabold text-2xl tracking-tight mb-2">設定</h1>
      <p className="font-medium text-muted-foreground mb-6">
        管理申訴表單的標題、說明文字，以及送出後的 Discord 通知。
      </p>
      <div className="rounded-2xl border-2 border-foreground bg-card p-5 shadow-[4px_4px_0_0_var(--color-foreground)]">
        <SettingsForm settings={settings} />
      </div>
    </div>
  );
}
