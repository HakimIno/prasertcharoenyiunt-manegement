import React from 'react';
import { Outlet } from 'react-router-dom';
import NavbarVertical from '../../../components/NavbarVertical';
import { HomeIcon, UserIcon, FolderIcon } from '@heroicons/react/24/outline';

import { HomeIcon as HomeIconSolid, UserIcon as UserIconSolid, FolderIcon as FolderIconSolid } from '@heroicons/react/24/solid';

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

    return (
        <div className="flex">
            <NavbarVertical navbarList={navbarList} />
            <div className="w-screen h-screen justify-center items-center">
                <Outlet />
            </div>
        </div>
    );
};

export default MainLayout;
