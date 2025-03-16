import { motion, AnimatePresence } from "framer-motion";
import { useAlert } from "../context/AlertContext";

const AlertPopup = () => {
  const { alerts } = useAlert();

  return (
    <div className="fixed top-5 right-5 flex flex-col gap-2 z-50">
      <AnimatePresence>
        {alerts.map((alert) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3 }}
            className={`p-4 rounded-lg text-white ${
              alert.type === "success" ? "bg-green-500" : alert.type === "error" ? "bg-red-500" : "bg-yellow-500"
            }`}
          >
            <div className="flex justify-between items-center">
              <span>{alert.message}</span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default AlertPopup;
