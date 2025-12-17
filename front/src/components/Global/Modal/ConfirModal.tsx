import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../providers/theme-provider";

interface ConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal = ({ isOpen, onConfirm, onCancel }: ConfirmModalProps) => {
  const { theme } = useTheme();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
            theme === "dark" ? "bg-green/70" : "bg-green/30"
          }`}
        >
          <motion.div
            initial={{ y: -50, scale: 0.95 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 50, scale: 0.95 }}
            className={`w-full max-w-md overflow-hidden shadow-2xl rounded-xl ${
              theme === "dark"
                ? "bg-green-950 text-green-100"
                : "bg-white text-green-800"
            }`}
          >
            <div className="p-6">
              <div
                className={`flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full ${
                  theme === "dark" ? "bg-red-900/30" : "bg-red-100"
                }`}
              >
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>

              <h2
                className={`mb-2 text-xl font-bold text-center ${
                  theme === "dark" ? "text-green-100" : "text-green-800"
                }`}>
                Confirmer la suppression
              </h2>
              <p
                className={`text-center ${
                  theme === "dark" ? "text-green-300" : "text-green-600"
                }`}
              >
                Êtes-vous sûr de vouloir supprimer ? Cette action est irréversible.
              </p>
            </div>

            <div
              className={`flex px-6 py-4 space-x-4 ${
                theme === "dark" ? "bg-gray-700" : "bg-green-50"
              }`}>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className={`flex-1 px-4 py-2 transition-colors duration-200 rounded-lg ${
                  theme === "dark"
                    ? "text-green-200 bg-green-950 hover:bg-green-500"
                    : "text-green-700 bg-green-200 hover:bg-gray-300"
                }`}
                onClick={onCancel}>
                Annuler
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 px-4 py-2 text-white transition-colors duration-200 bg-red-950 rounded-lg hover:bg-red-700"
                onClick={onConfirm}>
                Supprimer
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;