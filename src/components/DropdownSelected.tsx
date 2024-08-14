
import React, { useState } from 'react';

interface DropdownProps {
    options: { id: number; name: string }[]; // เปลี่ยน branch_name เป็น name เพื่อให้ทั่วไป
    onSelect: (id: number) => void;
    placeholder: string
}

const DropdownSelected: React.FC<DropdownProps> = ({ options, onSelect, placeholder }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [selected, setSelected] = useState<string | null>(null);

    const handleSelect = (id: number, name: string) => {
        setSelected(name);
        setIsOpen(false);
        onSelect(id); // ส่งออก id ของรายการที่เลือก
    };

    return (
        <div className="relative inline-block text-left">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-blue-50 border border-blue-600 text-gray-700 p-1 rounded-lg flex items-center justify-between w-[180px]"
            >
                <span className="text-blue-600 ml-3 font-Semibold">{selected || 'เลือก' + placeholder}</span>
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

                <div
                    className="absolute right-0 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg"
                    style={{ zIndex: 9999, top: '100%', left: '0' }}
                >
                    <ul className="py-1">
                        {options.map(({ id, name }) => (
                            <li
                                key={id}
                                onClick={() => handleSelect(id, name)}
                                className="cursor-pointer px-4 py-2 hover:bg-blue-50 text-sm hover:font-semibold text-gray-500 hover:text-black"
                            >
                                {name}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>

    );
};

export default DropdownSelected;
