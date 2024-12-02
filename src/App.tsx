import './App.scss'
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import PrivateRoute from './routes/PrivateRoute';
import Login from './components/auth/login/Login';
import { registerLicense } from '@syncfusion/ej2-base';
import AppWrapper from './components/sidebar/AppWrapper';
import { AuthProvider } from './core/services/auth/AuthContext';
import RecoveryPassword from './components/auth/recovery/RecoveryPassword';
import ActualizarPassword from './pages/Usuarios/ActualizarPassword';

registerLicense('Ngo9BigBOggjHTQxAR8/V1NDaF5cWGFCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdnWH9fcXZURWVcU0FwVkI=');

function App() {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/recuperar-contrasena" element={<RecoveryPassword />} />
          <Route path="/actualizar-contrasena/:token" element={<ActualizarPassword />} />
          <Route element={<PrivateRoute isAuthenticated={isAuthenticated} />}>
            <Route path="/*" element={<AppWrapper />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App

