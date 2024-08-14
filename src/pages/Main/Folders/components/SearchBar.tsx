import React, { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';

interface SearchBarProps {
    onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
    const [searchQuery, setSearchQuery] = useState<string>('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        //@ts-ignore
        setSearchQuery(e.target.value);
    };

    const handleSearch = () => {
        onSearch(searchQuery);
    };

    //@ts-ignore
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="flex flex-row items-center gap-2 max-w-sm border border-gray-200 rounded-xl shadow-sm bg-white">
            <div className="relative flex items-center w-full">
                <MagnifyingGlassIcon className="absolute left-2 text-gray-500" height="20" width="20" />
                <input
                    className="w-full pl-10 pr-4 py-1 border-none outline-none bg-transparent text-gray-700 rounded-lg"
                    placeholder="ค้นหาชื่อไฟล์"
                    value={searchQuery}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                />
            </div>
            <button
                onClick={handleSearch}
                className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200"
            >
                <MagnifyingGlassIcon width="18" height="18" />
            </button>
        </div>
    );
};

export default SearchBar;
