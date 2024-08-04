import { Button, Flex } from '@radix-ui/themes';
import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    handlePageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalItems,
    itemsPerPage,
    handlePageChange
}) => {
    // Calculate total pages
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Calculate start and end indices for the current page
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    return (
        <div className="flex justify-between items-center  w-full py-2  px-2 bg-gray-100 rounded-md border-b border-r border-l">
            <span className="mr-4 text-sm">
                แสดง {startItem} ถึง {endItem} จาก {totalItems}
            </span>


            <Flex gap="2">
                <Button
                    // @ts-ignore
                    size="1"
                    variant='surface'
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}>
                    ย้อนกลับ
                </Button>

                <Button
                    // @ts-ignore
                    size="1"
                    variant='solid'
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    ถัดไป
                </Button>
            </Flex>

        </div >
    );
};

export default Pagination;
