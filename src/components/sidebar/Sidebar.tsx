import { ChevronLast, ChevronFirst } from "lucide-react"
import { createContext, useContext, useState, ReactNode } from "react"
import { Link, useLocation } from "react-router-dom";

interface SidebarContextType {
    expanded: boolean;
}

const SidebarContext = createContext<SidebarContextType>({ expanded: false });


export default function Sidebar({ children, userName, email }: { children: ReactNode, userName?: string, email?: string }) {
    const [expanded, setExpanded] = useState(true)

    return (
        <aside className="h-screen w-fit">
            <nav className="h-full flex flex-col bg-white border-r shadow-sm">
                <div className="p-4 pb-2 flex justify-between items-center">
                    <img
                        src="https://img.logoipsum.com/243.svg"
                        className={`overflow-hidden transition-all ${expanded ? "w-32" : "w-0"
                            }`}
                        alt=""
                    />
                    <button
                        onClick={() => setExpanded((curr) => !curr)}
                        className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
                    >
                        {expanded ? <ChevronFirst /> : <ChevronLast />}
                    </button>
                </div>

                <SidebarContext.Provider value={{ expanded }}>
                    <ul className="flex-1 px-3">{children}</ul>
                </SidebarContext.Provider>

                <div className="border-t flex p-3">
                    <div
                        className={`
              flex justify-between items-center
              overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}
          `}
                    >
                        <div className="leading-4">
                            <h4 className="font-semibold">{!userName ? 'John Doe' : userName}</h4>
                            <span className="text-xs text-gray-600">{!email ? 'johndoe@gmail.com' : email}</span>
                        </div>
                    </div>
                </div>
            </nav>
        </aside>
    )
}


interface SubItem {
    text: string;
    to: string;
    icon?: React.ReactNode; // Propiedad opcional para el icono
}

interface SidebarItemProps {
    icon: React.ReactNode;
    text: string;
    active?: boolean;
    alert?: boolean;
    subItems?: SubItem[];
}

export function SidebarItem({ icon, text, alert, subItems }: SidebarItemProps) {
    const { expanded }: { expanded: boolean } = useContext(SidebarContext);
    const location = useLocation(); // Obtener la ubicación actual
    const [isDropdownOpen, setDropdownOpen] = useState(false);

    const handleToggleDropdown = () => {
        setDropdownOpen(!isDropdownOpen);
    };

    const isActive = () => {
        // Comprobar si la ruta actual coincide con la ruta del texto principal
        return location.pathname === `/${text.toLowerCase()}`;
    };

    const isSubItemActive = (subItemPath: string) => {
        // Comprobar si la ruta actual coincide con la ruta de un subitem
        return location.pathname === subItemPath;
    };

    return (
        <li className="relative">
            {!subItems ? (
                <Link to={`/${text.toLowerCase()}`}>
                    <div
                        className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group
                ${isActive() ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800" : "hover:bg-indigo-50 text-gray-600"}`}
                    >
                        {icon}
                        <span className={`overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}`}>
                            {text}
                        </span>
                        {alert && (
                            <div className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${expanded ? "" : "top-2"}`} />
                        )}
                        {!expanded && (
                            <div className={`absolute left-full rounded-md px-2 py-1 ml-6 bg-indigo-100 text-indigo-800 text-sm
                  invisible opacity-20 -translate-x-3 transition-all
                  group-hover:visible group-hover:opacity-100 group-hover:translate-x-0`}>
                                {text}
                            </div>
                        )}
                    </div>
                </Link>
            ) : (
                <>
                    <div
                        className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group
                ${isActive() ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800" : "hover:bg-indigo-50 text-gray-600"}`}
                        onClick={handleToggleDropdown} // Toggle para subitems
                    >
                        {icon}
                        <span className={`overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}`}>
                            {text}
                        </span>
                        {alert && (
                            <div className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${expanded ? "" : "top-2"}`} />
                        )}
                        {!expanded && (
                            <div className={`absolute left-full rounded-md px-2 py-1 ml-6 bg-indigo-100 text-indigo-800 text-sm
                  invisible opacity-20 -translate-x-3 transition-all
                  group-hover:visible group-hover:opacity-100 group-hover:translate-x-0`}>
                                {text}
                            </div>
                        )}
                    </div>

                    {subItems && isDropdownOpen && (
                        <ul className="pl-4 mt-2">
                            {subItems.map((subItem) => (
                                <li key={subItem.text}>
                                    <Link
                                        to={subItem.to}
                                        className={`block py-1 px-2 text-gray-600 hover:bg-indigo-50 rounded-md
                        ${isSubItemActive(subItem.to) ? 'bg-indigo-100 text-indigo-800' : ''}`} // Clase activa para subitem
                                    >
                                        <div className={`flex items-center`}>
                                            {subItem.icon && <span className="mr-2">{subItem.icon}</span>}
                                            {subItem.text}
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </>
            )}
        </li>
    );

}