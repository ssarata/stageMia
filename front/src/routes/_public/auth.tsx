import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { House } from "lucide-react";

export const Route = createFileRoute("/_public/auth")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-white overflow-hidden">
      {/* Motif pointillé en arc */}
      <div
        className="
          absolute inset-0
          [background-image:radial-gradient(circle,#3b82f6_2px,transparent_2px)]
          [background-size:24px_24px]
          [mask-image:radial-gradient(circle_at_70%_30%,white,transparent_70%)]
          opacity-70
          rotate-[-20deg]
          scale-[1.4]
        "
      ></div>

      {/* Contenu du formulaire */}
      <div className="relative z-10 w-full max-w-md px-4">
        <div className="flex justify-center mb-4">
          <Link
            to="/"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-green-600 text-white shadow-2xl hover:bg-green-700 transition-colors"
          >
            <House className="w-5 h-5" />
          </Link>
        </div>

        <Outlet />
      </div>
    </div>
  );
}
