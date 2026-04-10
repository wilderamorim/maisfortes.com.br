import { BottomTabBar } from "@/components/layout/BottomTabBar";
import { NotificationBell } from "@/components/layout/NotificationBell";
import { PushPermission } from "@/components/layout/PushPermission";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh flex flex-col">
      <main className="flex-1 pb-safe">{children}</main>
      <BottomTabBar />
      <PushPermission />
    </div>
  );
}
