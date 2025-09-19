// src/components/ui/ButtonPrimary.jsx
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function ButtonPrimary({ children, onClick, showIcon = true }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full shadow-md font-semibold flex items-center justify-center gap-2 text-sm transition"
    >
      {children}
      {showIcon && <ArrowRight size={18} />}
    </motion.button>
  );
}
