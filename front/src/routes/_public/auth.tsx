import { createFileRoute, Link, Outlet } from "@tanstack/react-router";

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
            className="flex items-center justify-center hover:opacity-80 transition-opacity"
          >
            <img
              src="/logo.png"
              alt="Logo MIA Burkina Faso"
              className="h-16 w-auto drop-shadow-lg"
            />
          </Link>
        </div>

        <Outlet />
      </div>
    </div>
  );
}
