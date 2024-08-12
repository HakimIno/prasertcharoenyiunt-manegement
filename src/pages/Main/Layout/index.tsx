import React from 'react';
import { Outlet } from 'react-router-dom';
import NavbarVertical from '../../../components/NavbarVertical';
import { HomeIcon, UserIcon, FolderIcon } from '@heroicons/react/24/outline';

import { HomeIcon as HomeIconSolid, UserIcon as UserIconSolid, FolderIcon as FolderIconSolid } from '@heroicons/react/24/solid';
import { Avatar, DropdownMenu, Flex } from '@radix-ui/themes';
import { useAuth } from '../../../context/AuthContext';
import supabase from '../../../utils/supabase';
import { getColorByCharacter } from '../../../utils/getColorByCharacter';

interface NavbarItem {
    title: string;
    icon: React.ReactNode;
    iconSolid: React.ReactNode
}

const MainLayout: React.FC = () => {

    const navbarList: NavbarItem[] = [
        { title: "", icon: <HomeIcon className="w-6 h-6 text-[#1a1a1a]" />, iconSolid: <HomeIconSolid className="w-6 h-6 text-[#1a1a1a]" /> },
        { title: "users", icon: <UserIcon className="w-6 h-6 text-[#1a1a1a]" />, iconSolid: <UserIconSolid className="w-6 h-6 text-[#1a1a1a]" /> },
        { title: "folders", icon: <FolderIcon className="w-6 h-6 text-[#1a1a1a]" />, iconSolid: <FolderIconSolid className="w-6 h-6 text-[#1a1a1a]" /> }
    ];

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Error logging out:', error.message);
        } else {
            console.log('Logged out successfully');
        }
    };

    const { user } = useAuth()
    const firstChar = user?.email?.charAt(0) || '';
    const avatarColor = getColorByCharacter(firstChar);

    return (
        <div className="flex h-screen">
            <NavbarVertical navbarList={navbarList} handleLogout={handleLogout} />

            <div className="flex-1 flex flex-col">
                <nav className="w-full bg-white shadow-lg p-2 flex justify-between items-center border">
                    <div className="flex items-center justify-end w-full">
                        {/* Avatar */}
                        <DropdownMenu.Root>
                            <DropdownMenu.Trigger>
                                <Flex mr={"5"}>
                                    <Avatar size="3" variant="solid" color={avatarColor} fallback={user?.email?.charAt(0)} radius="full" />
                                </Flex>
                            </DropdownMenu.Trigger>
                            <DropdownMenu.Content>
                                <DropdownMenu.Item shortcut="⌘">
                                    <span className={"font-medium"}>{user?.email}</span>
                                </DropdownMenu.Item>
                                <DropdownMenu.Separator />
                                <DropdownMenu.Item shortcut="⌘" color="red" onSelect={handleLogout}>
                                    <span className={"font-medium"}>ออกจากระบบ</span>
                                </DropdownMenu.Item>
                            </DropdownMenu.Content>
                        </DropdownMenu.Root>
                    </div>
                </nav>
                <div className="flex-1 overflow-auto">
                    <Outlet />
                </div>
            </div>
        </div>

    );
};

export default MainLayout;
