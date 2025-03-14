import AppRouter from './routes/AppRouter';
import Navbar from './components/Navbar';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <Navbar />
      <AuthProvider>
          <AppRouter />
      </AuthProvider>
    </div>
  );
}

export default App;
