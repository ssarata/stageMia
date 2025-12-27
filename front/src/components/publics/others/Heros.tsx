import { useAuthStore } from "@/store/authStore";
import { Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { Sparkles, Brain, Zap } from "lucide-react";

const Heros = () => {
  const { isAuthenticated } = useAuthStore();
  const sliderContainerRef = useRef<HTMLDivElement>(null);
  const [sliderWidth, setSliderWidth] = useState<number>(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    const handleResize = () => {
      if (sliderContainerRef.current) {
        const containerWidth = sliderContainerRef.current.offsetWidth;
        setSliderWidth(containerWidth);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sliderHeight = Math.round(sliderWidth * 0.45);

  return (
    <section className="w-full relative overflow-hidden">
      {/* Fond avec dégradé */}
      <div className="relative bg-gradient-to-br from-[#1A4D7C] via-[#1A4D7C]/80 to-[#2D7A4A]/40 w-full overflow-hidden flex items-center justify-center"
        style={{ minHeight: `${Math.max(sliderHeight, 600)}px` }}
      >
        {/* Particules flottantes animées */}
        <div className="absolute inset-0 overflow-hidden">
          <Sparkles className="absolute top-20 left-10 text-yellow-300/30 w-8 h-8 animate-pulse" style={{ animationDelay: '0s', animationDuration: '3s' }} />
          <Brain className="absolute top-40 right-20 text-blue-300/30 w-12 h-12 animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '4s' }} />
          <Zap className="absolute bottom-32 left-1/4 text-green-300/30 w-10 h-10 animate-pulse" style={{ animationDelay: '1s', animationDuration: '3.5s' }} />
          <Sparkles className="absolute bottom-20 right-1/3 text-yellow-300/30 w-6 h-6 animate-bounce" style={{ animationDelay: '1.5s', animationDuration: '3s' }} />
          <Brain className="absolute top-1/3 right-1/4 text-blue-300/20 w-8 h-8 animate-pulse" style={{ animationDelay: '2s', animationDuration: '4s' }} />
        </div>

        {/* Overlay avec dégradé pour meilleure lisibilité */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40"></div>

        {/* Contenu principal */}
        <div ref={sliderContainerRef} className="relative z-10 w-full h-full flex flex-col justify-center items-center text-center px-4 py-20">
          <h1 className={`text-4xl md:text-7xl font-bold mb-6 text-white drop-shadow-lg transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            Maison de l'Intelligence Artificielle
          </h1>
          <h2 className={`text-2xl md:text-4xl font-semibold mb-4 text-yellow-300 drop-shadow-lg transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            Burkina Faso
          </h2>
          <p className={`text-lg md:text-2xl mb-8 text-white/90 max-w-3xl drop-shadow-md transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            Pionnier de l'innovation technologique et de l'IA en Afrique de l'Ouest
          </p>

          <div className={`flex flex-wrap gap-4 justify-center transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="bg-gradient-to-r from-[#1A4D7C] to-[#2D7A4A] text-white px-10 py-4 rounded-full font-bold text-lg hover:shadow-2xl hover:scale-110 hover:-translate-y-1 transition-all duration-300 animate-pulse"
                style={{ animationDuration: '3s' }}
              >
                Accéder au Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/auth/login"
                  className="bg-gradient-to-r from-[#1A4D7C] to-[#2D7A4A] text-white px-10 py-4 rounded-full font-bold text-lg hover:shadow-2xl hover:scale-110 hover:-translate-y-1 transition-all duration-300"
                >
                  Se Connecter
                </Link>
                <Link
                  to="/auth/register"
                  className="border-3 border-white bg-white/10 backdrop-blur text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-[#1A4D7C] hover:scale-110 hover:-translate-y-1 transition-all duration-300"
                >
                  Créer un Compte
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Heros;