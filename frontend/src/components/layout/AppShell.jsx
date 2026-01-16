import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { Toaster } from "@/components/ui/sonner";

export default function AppShell() {
  return (
    <>
      <div className="min-h-screen bg-muted/30">
        <div className="flex">
          <Sidebar />
          <div className="flex-1">
            <Topbar />

            <main className="p-4 md:p-6">
              <Outlet />
            </main>
          </div>
        </div>
      </div>

      <Toaster richColors position="top-right" />
    </>
  );
}
