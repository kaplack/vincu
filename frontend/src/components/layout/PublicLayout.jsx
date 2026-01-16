import { Outlet, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="h-16 border-b flex items-center">
        <div className="max-w-6xl mx-auto w-full px-4 flex items-center justify-between">
          <Link to="/" className="font-semibold text-lg">
            VINCU
          </Link>
          <div className="flex gap-2">
            <Button variant="ghost" asChild>
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link to="/register">Register</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1">
        <Outlet />
      </div>

      <footer className="border-t">
        <div className="max-w-6xl mx-auto px-4 py-6 text-sm text-muted-foreground">
          © {new Date().getFullYear()} VINCU · Loyalty simple con Google Wallet
        </div>
      </footer>
    </div>
  );
}
