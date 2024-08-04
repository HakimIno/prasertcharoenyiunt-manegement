import React, { useState } from 'react';
import { Table } from '@radix-ui/themes';
import Pagination from './Pagination';

interface Column {
    title: string;
    key: string;
    render?: (item: any, index: number) => React.ReactNode;
}

interface DataTableProps {
    columns: Column[];
    data: any[];
    itemsPerPage?: number; // Optional prop for items per page
}

const DataTable: React.FC<DataTableProps> = ({ columns, data, itemsPerPage = 10 }) => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const totalItems = data.length;

    const handlePageChange = (page: number) => {
        if (page > 0 && page <= Math.ceil(totalItems / itemsPerPage)) {
            setCurrentPage(page);
        }
    };

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentPageData = data.slice(startIndex, endIndex);

    return (
        <div>
            <Table.Root layout="auto" variant="surface">
                <Table.Header>
                    <Table.Row className="bg-gray-50">
                        <Table.ColumnHeaderCell className="text-[#1a1a1a] font-semibold">ลำดับ</Table.ColumnHeaderCell>
                        {columns.map((column, index) => (
                            <Table.ColumnHeaderCell key={index} className="text-[#1a1a1a] font-semibold">{column.title}</Table.ColumnHeaderCell>
                        ))}
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {currentPageData.map((item, rowIndex) => (
                        <Table.Row key={startIndex + rowIndex}>
                            <Table.Cell>{startIndex + rowIndex + 1}</Table.Cell>
                            {columns.map((column, colIndex) => (
                                <Table.Cell key={colIndex}>
                                    {column.render ? column.render(item, startIndex + rowIndex) : item[column.key]}
                                </Table.Cell>
                            ))}
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table.Root>
            <Pagination
                currentPage={currentPage}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                handlePageChange={handlePageChange}
            />
        </div>
    );
};

export default DataTable;
