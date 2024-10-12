import './App.scss'
import { LayoutDashboard, LogOut, ChartPie, ShieldCheck, UserRoundCog, BadgePlus, FilePenLine, UserRoundPlus, Bug, FilePlus2, BookUser, BookCopy } from 'lucide-react'
import Sidebar from './components/sidebar/Sidebar'
import { SidebarItem } from './components/sidebar/Sidebar'
import { Route, BrowserRouter as Router, Routes, useLocation } from "react-router-dom";
import Dashboard from './pages/Home/Dashboard';
import PrivateRoute from './routes/PrivateRoute';
import Login from './components/login/Login';
import Logout from './components/logout/Logout';
import RegistrarUsuario from './pages/Usuarios/RegistrarUsuario';
import { registerLicense } from '@syncfusion/ej2-base';
import ListaUsuarios from './pages/Usuarios/ListaUsuarios';

registerLicense('Ngo9BigBOggjHTQxAR8/V1NDaF5cWGFCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdnWH9fcXZURWVcU0FwVkI=');


function AppWrapper() {
  const location = useLocation(); // Obtiene la ruta actual

  return (
    <div className="app-container flex">
      <Sidebar>
        <SidebarItem icon={<ChartPie size={20} />} text="Dashboard" alert={location.pathname === '/' || location.pathname === '/dashboard'}
          active={location.pathname === '/' || location.pathname === '/dashboard'} />

        <SidebarItem
          icon={<Bug size={20} />}
          text="Incidencias"
          alert={location.pathname === '/incidencias/registro' || location.pathname === '/incidencias/listar' || location.pathname === '/incidencias/editar'}
          subItems={[
            { text: "Registrar", to: "/incidencias/registro", icon: <BadgePlus size={20} /> },
            { text: "Listar", to: "/incidencias/listar", icon: <LayoutDashboard size={20} /> },
            { text: "Editar", to: "/incidencias/editar", icon: <FilePenLine size={20} /> },
          ]}
        />

        <SidebarItem
          icon={<ShieldCheck size={20} />}
          text="Acciones"
          alert={location.pathname === '/acciones/registro' || location.pathname === '/acciones/listar' || location.pathname === '/acciones/editar'}
          subItems={[
            { text: "Registrar", to: "/acciones/registro", icon: <FilePlus2 size={20} /> },
            { text: "Listar", to: "/acciones/listar", icon: <BookCopy size={20} /> },
            { text: "Editar", to: "/acciones/editar", icon: <FilePenLine size={20} /> },
          ]}
        />

        <SidebarItem
          icon={<UserRoundCog size={20} />}
          text="Usuarios"
          alert={location.pathname === '/usuarios/registrar' || location.pathname === '/usuarios/listar' || location.pathname === '/usuarios/editar'}
          subItems={[
            { text: "Registrar Usuario", to: "/usuarios/registrar", icon: <UserRoundPlus size={20} /> },
            { text: "Listar Usuarios", to: "/usuarios/listar", icon: <BookUser size={20} /> },
            { text: "Editar", to: "/usuarios/editar", icon: <FilePenLine size={20} /> },
          ]}
        />

        <Logout>
          <SidebarItem
            icon={<LogOut size={20} />}
            text="Cerrar Sesión"
            active={location.pathname === '/logout'}
          />
        </Logout>

      </Sidebar>

      <div className="content flex-1">
        <Routes>
          <Route path="/" element={<Dashboard />} caseSensitive={false} />
          <Route path="/dashboard" element={<Dashboard />} caseSensitive={false} />
          <Route path="/usuarios/registrar" element={<RegistrarUsuario />} caseSensitive={false} />
          <Route path="/usuarios/listar" element={<ListaUsuarios />} caseSensitive={false} />

          {/* Agregar una ruta que capture cualquier ruta no válida */}
          <Route path="*" element={<NotFound />} />
        </Routes>

      </div>
    </div>
  );
}

// Crear un componente simple para el fallback
const NotFound = () => {
  return <div className='flex items-center justify-center min-h-screen'>
    <h2>404 - Página no encontrada</h2>
  </div>;
};

function App() {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<PrivateRoute isAuthenticated={isAuthenticated} />}>
          <Route path="/*" element={<AppWrapper />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App

