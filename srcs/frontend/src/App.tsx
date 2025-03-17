import AppRouter from "./routes/AppRouter";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import { AlertProvider } from "./context/AlertContext";
import AlertPopup from "./components/alert";

function App() {
  return (
    <AlertProvider>
      <AuthProvider>
        <div className="min-h-screen bg-gray-100 text-gray-900" >
          <Navbar />
          <AppRouter />
          <AlertPopup />
        </div>
      </AuthProvider>
    </AlertProvider>
  );
}

export default App;
