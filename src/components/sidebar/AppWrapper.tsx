import Sidebar, { SidebarItem } from './Sidebar';
import { BadgePlus, BookCopy, BookUser, Bug, ChartPie, FilePlus2, LayoutDashboard, LogOut, ShieldCheck, UserRoundCog, UserRoundPlus } from 'lucide-react';
import Logout from '../auth/logout/Logout';
import { Route, Routes, useLocation } from "react-router-dom";
import Dashboard from '../../pages/Home/Dashboard';
import RegistrarUsuario from '../../pages/Usuarios/RegistrarUsuario';
import ListaUsuarios from '../../pages/Usuarios/ListaUsuarios';
import RegistrarIncidente from '../../pages/Incidencias/RegistrarIncidencias';
import ListaIncidencias from '../../pages/Incidencias/Listar';
import { IUsuarioAside } from '../../core/interface/usuarios/Usuario';
import { useEffect, useState } from 'react';
import { getUsuarioAside } from '../../core/services/usuarios/UsuarioService';
import { showErrorAlert } from '../../core/services/alerts/AlertsService';
import RegistrarAcciones from '../../pages/Acciones/RegistrarAcciones';
import ListaAcciones from '../../pages/Acciones/Listar';
import EditarUsuario from '../../pages/Usuarios/Editarusuarios';
import EditarIncidente from '../../pages/Incidencias/Editar';
import ProtectedRoute from '../rutas/ProtectedRoute';
import { jwtDecode } from 'jwt-decode';

function AppWrapper() {
    const [usuarioAside, setUsuarioAside] = useState<IUsuarioAside | null>(null);
    const token = localStorage.getItem('token');
    interface DecodedToken {
        role: string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [key: string]: any;
    }

    const decoded: DecodedToken | null = token ? jwtDecode<DecodedToken>(token) : null;

    const getDatos = async () => {
        try {
            const data = await getUsuarioAside();
            setUsuarioAside(data);
        } catch (error) {
            showErrorAlert({ title: 'Error', text: (error as Error).message });
        }
    }

    useEffect(() => {
        getDatos();
    }, []);
    const location = useLocation(); // Obtiene la ruta actual

    return (
        <div className="app-container flex">
            <Sidebar email={usuarioAside?.email} userName={usuarioAside?.nombre_usuario}>
                <SidebarItem icon={<ChartPie size={20} />} text="Dashboard" alert={location.pathname === '/' || 
                    location.pathname === '/dashboard'} active={location.pathname === '/' || location.pathname === '/dashboard'} />

                <SidebarItem
                    icon={<Bug size={20} />}
                    text="Incidencias"
                    alert={location.pathname === '/incidencias/registro' || location.pathname === '/incidencias/listar'}
                    subItems={[
                        { text: "Registrar", to: "/incidencias/registro", icon: <BadgePlus size={20} /> },
                        { text: "Listar", to: "/incidencias/listar", icon: <LayoutDashboard size={20} /> }
                    ]}
                />

                <SidebarItem
                    icon={<ShieldCheck size={20} />}
                    text="Acciones"
                    alert={location.pathname === '/acciones/registro' || location.pathname === '/acciones/listar'}
                    subItems={[
                        { text: "Registrar", to: "/acciones/registro", icon: <FilePlus2 size={20} /> },
                        { text: "Listar", to: "/acciones/listar", icon: <BookCopy size={20} /> },
                    ]}
                />
                {decoded?.role === 'Admin' && (
                    <SidebarItem
                        icon={<UserRoundCog size={20} />}
                        text="Usuarios"
                        alert={location.pathname === '/usuarios/registrar' || location.pathname === '/usuarios/listar'}
                        subItems={[
                            { text: "Registrar Usuario", to: "/usuarios/registrar", icon: <UserRoundPlus size={20} /> },
                            { text: "Listar Usuarios", to: "/usuarios/listar", icon: <BookUser size={20} /> },
                        ]}
                    />
                )}

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

                    <Route
                        path="/usuarios/registrar"
                        element={<ProtectedRoute allowedRoles={['Admin']} element={<RegistrarUsuario />} />}
                        caseSensitive={false} />
                    <Route
                        path="/usuarios/listar"
                        element={<ProtectedRoute allowedRoles={['Admin']} element={<ListaUsuarios />} />}
                        caseSensitive={false} />
                    <Route path="/usuarios/editar/:id" element={<EditarUsuario />} caseSensitive />
                    <Route path="/incidencias/registro" element={<RegistrarIncidente />} caseSensitive={false} />
                    <Route path="/incidencias/listar" element={<ListaIncidencias />} caseSensitive />
                    <Route path="/incidencias/editar/:id" element={<EditarIncidente />} caseSensitive />
                    <Route path="/acciones/registro" element={<RegistrarAcciones />} caseSensitive />
                    <Route path="/acciones/listar" element={<ListaAcciones />} caseSensitive />

                    <Route path="/unauthorized" element={<Unauthorized />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>

            </div>
        </div>
    );
}

const NotFound = () => {
    return <div className='flex items-center justify-center min-h-screen'>
        <h2>404 - Página no encontrada</h2>
    </div>;
};

const Unauthorized = () => (
    <div className='flex items-center justify-center min-h-screen'>
        <h2>403 - No tienes permiso para acceder a esta página</h2>
    </div>
);


export default AppWrapper;