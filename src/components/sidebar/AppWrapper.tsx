import Sidebar, { SidebarItem } from './Sidebar';
import { BadgePlus, BookCopy, BookUser, Bug, ChartPie, FilePenLine, FilePlus2, LayoutDashboard, LogOut, ShieldCheck, UserRoundCog, UserRoundPlus } from 'lucide-react';
import Logout from '../logout/Logout';
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

function AppWrapper() {
    const [usuarioAside, setUsuarioAside] = useState<IUsuarioAside | null>(null);

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
                    <Route path="/incidencias/registro" element={<RegistrarIncidente />} caseSensitive={false} />
                    <Route path="/incidencias/listar" element={<ListaIncidencias />} caseSensitive />

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


export default AppWrapper;