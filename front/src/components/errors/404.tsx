import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import Lottie from 'lottie-react';
import notFoundAnimation from '../../assets/lottie/empty.json';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 px-6 relative overflow-hidden">
      {/* Éléments décoratifs naturels */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-20 h-20 bg-green-200 rounded-full opacity-40 animate-float"></div>
        <div className="absolute top-1/3 right-16 w-16 h-16 bg-amber-200 rounded-full opacity-30 animate-float delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-emerald-300 rounded-full opacity-50 animate-float delay-500"></div>
        
        {/* Lignes discrètes pour un effet organisé */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-300 to-transparent opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-300 to-transparent opacity-20"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ 
          duration: 0.7,
          ease: "easeOut"
        }}
        className="text-center relative z-10 bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-lg border border-green-100 max-w-md w-full"
      >
        {/* Animation Lottie */}
        <motion.div
          whileHover={{ 
            scale: 1.02,
            transition: { duration: 0.2 }
          }}
          className="mb-6 mx-auto"
        >
          <Lottie 
            animationData={notFoundAnimation}
            loop={true}
            className="w-48 h-48 md:w-56 md:h-56"
          />
        </motion.div>

        {/* Titre */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-gray-800 mb-3"
        >
          Page non trouvée
        </motion.h1>

        {/* Code d'erreur discret */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-6xl font-light text-green-600 mb-4"
        >
          404
        </motion.div>

        {/* Message */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-gray-600 mb-2 text-lg font-medium"
        >
          Oups... Cette page n'existe pas
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-gray-500 mb-8 leading-relaxed"
        >
          La section que vous recherchez n'est pas disponible ou a été déplacée.
        </motion.p>

        {/* Bouton de retour */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          whileHover={{ 
            scale: 1.02,
            transition: { duration: 0.2 }
          }}
          whileTap={{ scale: 0.98 }}
        >
          <Link
            to="/"
            className="inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-4 font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:brightness-105 group border border-green-700/20"
          >
            <motion.span
              animate={{ rotate: [0, -10, 0] }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "loop"
              }}
            >
              📚
            </motion.span>
            Retour au tableau de bord
            <motion.span
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="group-hover:translate-x-1 transition-transform duration-200"
            >
              →
            </motion.span>
          </Link>
        </motion.div>
      </motion.div>

      
    </div>
  );
};

export default NotFound;