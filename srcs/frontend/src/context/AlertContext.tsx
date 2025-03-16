import { createContext, useContext, useState, ReactNode } from "react";

type Alert = {
  id: number;
  message: string;
  type: "success" | "error" | "warning";
};

type AlertContextType = {
  alerts: Alert[];
  showAlert: (message: string, type?: "success" | "error" | "warning") => void;
};

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const showAlert = (message: string, type: "success" | "error" | "warning" = "success") => {
    const id = Date.now();
    setAlerts((prev) => [...prev, { id, message, type }]);

    // Auto-hide alert after 3 seconds
    setTimeout(() => setAlerts((prev) => prev.filter((alert) => alert.id !== id)), 3000);
  };

  return (
    <AlertContext.Provider value={{ alerts, showAlert }}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) throw new Error("useAlert must be used within an AlertProvider");
  return context;
};
