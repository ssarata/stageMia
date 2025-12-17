import { createFileRoute, Outlet } from "@tanstack/react-router";
import Footer from "../components/publics/partials/Footer";
import Header from "../components/publics/partials/Header";

export const Route = createFileRoute("/_public")({
  component: PublicLayout,
});

function PublicLayout() {


  return (
    <div className="min-h-screen flex flex-col">
      {/* NAVBAR - Toujours visible */}
      <Header />
      {/* CONTENU PRINCIPAL - Change selon la route */}
      <main className="flex-1">
        <Outlet />
      </main>
      {/* FOOTER - Toujours visible */}
      <Footer />
    </div>
  );
}

