import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import { PowerIcon, } from '@heroicons/react/24/outline';
import { BoltIcon } from '@heroicons/react/24/solid';
import Tooltip from './Tooltip'; // Import Tooltip component
import supabase from '../utils/supabase';
import { NavLink, useLocation } from 'react-router-dom';

interface NavbarItem {
    title: string;
    icon: React.ReactNode;
    iconSolid: React.ReactNode
}

interface NavbarVerticalProps {
    navbarList: NavbarItem[];
}

const NavbarVertical: React.FC<NavbarVerticalProps> = ({ navbarList }) => {
    const location = useLocation();
    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Error logging out:', error.message);
        } else {
            console.log('Logged out successfully');
            // Optionally, redirect or update state after logout
        }
    };


    const checkPath = (pathname: string): boolean => location.pathname === pathname;

    return (
        <NavigationMenu.Root className="h-screen w-16 bg-white text-white border flex flex-col justify-between">
            <NavigationMenu.List className="flex flex-col space-y-2 p-2 flex-grow">
                <NavigationMenu.Item>
                    <NavigationMenu.Link className="flex p-2 rounded-lg justify-center items-center">
                        <BoltIcon className="w-6 h-6 text-amber-500" />
                    </NavigationMenu.Link>
                </NavigationMenu.Item>
                <hr className="border-dashed border-gray-200" />
                {navbarList.map((item, index) => (
                    <Tooltip key={index} text={item.title}>
                        <NavigationMenu.Item>
                            <NavLink to={`/${item.title.toLowerCase()}`} className={`flex p-2 rounded-lg justify-center items-center ${checkPath(`/${item.title}`) ? 'bg-zinc-100' : 'hover:bg-zinc-100'}`}>
                                {checkPath(`/${item.title}`) ? item.iconSolid : item.icon}
                            </NavLink>
                        </NavigationMenu.Item>
                    </Tooltip>
                ))}
            </NavigationMenu.List>
            <div className="flex flex-col p-2">
                <hr className="border-dashed border-gray-200" />
                <Tooltip text="Logout">
                    <NavigationMenu.Item>
                        <NavigationMenu.Link onClick={handleLogout} className="group flex p-2 rounded-lg hover:bg-red-100 justify-center items-center">
                            <PowerIcon className="w-6 h-6 text-[#1a1a1a] group-hover:text-red-600" />
                        </NavigationMenu.Link>
                    </NavigationMenu.Item>
                </Tooltip>
            </div>
        </NavigationMenu.Root>
    );
};

export default NavbarVertical;
