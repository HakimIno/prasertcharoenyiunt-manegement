import React from 'react';

import DataTable from '../../../../components/DataTable';

interface FolderTableProps {
    columns: any[];
    data: any[];
}

const FolderTable: React.FC<FolderTableProps> = ({ columns, data }) => {
    return (
        <DataTable columns={columns} data={data} />
    );
};


export default FolderTable;
