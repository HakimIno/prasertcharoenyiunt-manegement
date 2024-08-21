import React, { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { useCombinedData } from '../../../../hooks/useCombinedData';
import { useNavigate } from 'react-router-dom';

interface SearchBarProps {
    // คุณสามารถเพิ่ม props อื่น ๆ ได้ตามต้องการ
}

const SearchBar: React.FC<SearchBarProps> = () => {
    const [searchQuery, setSearchQuery] = useState<string>('');

    // ดึงข้อมูลที่ตรงกับการค้นหา
    const { combinedData } = useCombinedData(searchQuery);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        //@ts-ignore
        setSearchQuery(e.target.value);
    };

    const handleSearch = () => {
        // คุณสามารถเพิ่มฟังก์ชันค้นหาเพิ่มเติมได้ที่นี่
    };

    const handleKeyDown = (e: any) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const navigate = useNavigate();

    const handleBranchClick = (item: any) => {
        console.log("handleBranchClick", item);
        if (item.type_in === "branch") {
            const encodedBranchName = encodeURIComponent(item?.branch_name);
            navigate(`/branches/${item?.id}/typecars?branchName=${encodedBranchName}`);
        } else {
            navigate(`/branches/${item?.branch_id}/typecars/${item?.id}/files?branchName=${encodeURIComponent(String(item?.branch_name))}&typeCarName=${encodeURIComponent(item?.car_type_name)}`);
        }
    };

    return (
        <div className="relative w-full">
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

            {/* แสดงรายการที่ตรงกับการค้นหา */}
            {searchQuery && (
                <div className="absolute mt-2 w-1/2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50">
                    {combinedData.length > 0 ? (
                        combinedData.map((item) => (
                            <div
                                key={item.id} // ใช้ id หรือ key ที่ไม่ซ้ำกัน
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex flex-row items-center border-b border-b-gray-100 line-clamp-2 w-full"
                                onClick={() => handleBranchClick(item)}
                            >
                                <img
                                    src="https://gpamonnosfwdoxjvyrcw.supabase.co/storage/v1/object/public/media/FIleIcon/folder.png"
                                    alt="iconfolder"
                                    className={'w-8 h-8 mr-4'}
                                />
                                {item.folderName} {/* แสดงชื่อไฟล์หรือข้อมูลที่ต้องการ */}
                            </div>
                        ))
                    ) : (
                        <div className="px-4 py-2 text-gray-500">ไม่พบผลลัพธ์ที่ค้นหา</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchBar;
