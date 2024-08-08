import React from 'react';
import { Flex, Button, DropdownMenu } from '@radix-ui/themes';
import { PencilIcon, TrashIcon, EllipsisVerticalIcon } from '@heroicons/react/24/solid';
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

export const columns = [
    {
        title: "Name",
        key: "filename",
        render: (el: any, _index: number, row: any) => {
            return (
                <div className="flex flex-row items-center text-md font-medium gap-2">
                    {row?.icon?.icon_url && <img src={row?.icon?.icon_url} alt={el} style={{ width: '26px', height: '26px' }} />}
                    {el}
                </div>
            )
        }
    },
    {
        title: "Openned",
        key: "opened",
    },
    {
        title: "Owner",
        key: "owner",
    },
    {
        title: "จัดการ",
        key: "manage",
        render: () => {
            return (
                <Flex gap="2" ml="3">
                    <DropdownMenu.Root>
                        <DropdownMenu.Trigger>
                            {/* @ts-ignore */}
                            <Button size="1" color="gray" radius='large' variant="ghost">
                                <EllipsisVerticalIcon className="w-5 h-5 " />
                            </Button>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Content variant="soft" color="gray" >
                            <DropdownMenu.Item shortcut="⌘ E">
                                <PencilIcon className="w-3 h-3" />
                                แก้ไข
                            </DropdownMenu.Item>
                            <DropdownMenu.Separator />
                            <DropdownMenu.Item shortcut="⌘ D" color="red">
                                <TrashIcon className="w-3 h-3 text-red-600" />
                                ลบ
                            </DropdownMenu.Item>
                        </DropdownMenu.Content>
                    </DropdownMenu.Root>
                </Flex>
            )
        }
    }
];

export default FolderTable;
