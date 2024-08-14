import React, { useState } from 'react';

interface DropdownProps {
    options: { id: number; branch_name: string }[];
    onSelect: (id: number) => void; // ส่งออกเป็น id ของ branch
}

const DropdownSelected: React.FC<DropdownProps> = ({ options, onSelect }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [selected, setSelected] = useState<string | null>(null);

    const handleSelect = (id: number, branch_name: string) => {
        setSelected(branch_name);
        setIsOpen(false);
        onSelect(id); // ส่งออก id ของ branch ที่เลือก
    };

    return (
        <div className="relative inline-block text-left z-50">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-blue-50 border border-blue-600 text-gray-700 p-1 rounded-lg flex items-center justify-between w-[180px]"
            >
                <span className="text-blue-600 ml-3 font-Semibold">{selected || 'เลือกสาขา'}</span>
                <svg
                    className={`w-4 h-4 ml-2 transition-transform ${isOpen ? 'rotate-180' : 'rotate-0'} text-blue-600`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                    <ul className="py-1">
                        {options.map(({ id, branch_name }) => (
                            <li
                                key={id}
                                onClick={() => handleSelect(id, branch_name)}
                                className="cursor-pointer px-4 py-2 hover:bg-blue-50 text-sm hover:font-semibold text-gray-500 hover:text-black"
                            >
                                {branch_name}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default DropdownSelected;
