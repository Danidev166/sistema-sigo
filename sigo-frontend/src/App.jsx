// src/App.jsx
import AppRouter from './routes/AppRouter';
import { AuthProvider } from './context/AuthProvider';
;

export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
      <!-- ToastContainer removido - Toaster ya está en main.jsx -->
    </AuthProvider>
  );
}
