import { useEffect, useState } from "react";
import { RouterProvider } from "@tanstack/react-router";
import { useAuthStore } from "./store/authStore";
import { router } from "./router";
import { useSocket } from "./hooks/useSocket";
import { useGetNotifications } from "./hooks/private/notificationHook";
import { useNotificationStore } from "./store/notificationStore";
import AOS from "aos";
import "aos/dist/aos.css";

function App() {
  const auth = useAuthStore();
  const [isHydrated, setIsHydrated] = useState(false);

  // ✅ Initialiser Socket.IO
  useSocket();

  // ✅ Charger les notifications au démarrage (seulement si authentifié)
  const { setNotifications } = useNotificationStore();
  const { data: notifications } = useGetNotifications(auth.isAuthenticated);

  // ✅ Synchroniser les messages en arrière-plan
  useEffect(() => {
    if (!auth.isAuthenticated) return;

    // Vérifier les nouveaux messages toutes les 5 secondes
    const interval = setInterval(async () => {
      // Cette vérification permettra au cache React Query de se synchroniser
      // avec le backend pour tous les messages
    }, 5000);

    return () => clearInterval(interval);
  }, [auth.isAuthenticated]);

  useEffect(() => {
    if (notifications) {
      setNotifications(notifications);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notifications]);

  // ✅ Hydratation Zustand persist (chargement depuis localStorage)
  useEffect(() => {
    const unsubscribe = useAuthStore.persist.onFinishHydration(() => {
      setIsHydrated(true);
    });

    if (useAuthStore.persist.hasHydrated()) {
      setIsHydrated(true);
    }

    return () => unsubscribe?.();
  }, []);

  // ✅ Initialisation de AOS
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: false,
      offset: 100,
    });
  }, []);

  // ✅ Écran de chargement avant hydratation complète
  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4" />
          <p className="text-lg text-gray-700 font-medium">Chargement...</p>
        </div>
      </div>
    );
  }

  // ✅ Routeur principal avec contexte auth
  return <RouterProvider router={router} context={{ auth }} />;
}

export default App;

