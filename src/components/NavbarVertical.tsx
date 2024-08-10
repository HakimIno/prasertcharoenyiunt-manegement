import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import { PowerIcon } from '@heroicons/react/24/outline';
import Tooltip from './Tooltip'; // Import Tooltip component
import { NavLink, useLocation } from 'react-router-dom';

interface NavbarItem {
    title: string;
    icon: React.ReactNode;
    iconSolid: React.ReactNode;
}

interface NavbarVerticalProps {
    navbarList: NavbarItem[];
    handleLogout: () => void;
}

const NavbarVertical: React.FC<NavbarVerticalProps> = ({ navbarList, handleLogout }) => {
    const location = useLocation();


    const checkPath = (pathname: string): boolean => location.pathname === pathname;

    return (
        <div className="h-screen w-16 bg-white text-white border flex flex-col justify-between">
            <div className="flex flex-col space-y-2 p-2 flex-grow">
                <NavigationMenu.Root>
                    <NavigationMenu.List>
                        <NavigationMenu.Item>
                            <NavigationMenu.Link className="flex p-0.5 rounded-lg justify-center items-center">
                                <img
                                    className="w-full h-full rounded-lg mb-1 "
                                    src="https://gpamonnosfwdoxjvyrcw.supabase.co/storage/v1/object/public/media/942893c8-fe77-460c-a385-012b71fa7ae8.jpg"
                                    alt="logo"
                                />
                            </NavigationMenu.Link>
                        </NavigationMenu.Item>
                    </NavigationMenu.List>
                    <hr className="border-dashed border-gray-200" />
                    <NavigationMenu.List>
                        {navbarList.map((item, index) => (
                            <Tooltip key={index} text={item.title}>
                                <NavigationMenu.Item>
                                    <NavLink
                                        to={`/${item.title.toLowerCase()}`}
                                        className={`flex p-2 rounded-lg justify-center items-center ${checkPath(`/${item.title}`) ? 'bg-zinc-100' : 'hover:bg-zinc-100'} my-2`}
                                    >
                                        {checkPath(`/${item.title}`) ? item.iconSolid : item.icon}
                                    </NavLink>
                                </NavigationMenu.Item>
                            </Tooltip>
                        ))}
                    </NavigationMenu.List>
                </NavigationMenu.Root>
            </div>
            <div className="flex flex-col p-2">
                <hr className="border-dashed border-gray-200" />
                <Tooltip text="Logout">
                    <NavigationMenu.Root>
                        <NavigationMenu.Item>
                            <NavigationMenu.Link
                                onClick={handleLogout}
                                className="group flex p-2 rounded-lg hover:bg-red-100 justify-center items-center"
                            >
                                <PowerIcon className="w-6 h-6 text-[#1a1a1a] group-hover:text-red-600" />
                            </NavigationMenu.Link>
                        </NavigationMenu.Item>
                    </NavigationMenu.Root>
                </Tooltip>
            </div>
        </div>
    );
};

export default NavbarVertical;
