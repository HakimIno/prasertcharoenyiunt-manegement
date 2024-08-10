// GLOBAL - imports from npm
// STYLES
import { FoldersContainer } from './Folders.styles';
import { Box, Button, Flex, Tabs, DropdownMenu, Text, Skeleton } from '@radix-ui/themes';
import SearchBar from './components/SearchBar';
import { PlusIcon } from '@heroicons/react/24/solid';
import DialogInput from '../../../components/Dialog';
import { useFetchIcons } from '../../../hooks/useFetchIcons';
import { useFetchFiles } from '../../../hooks/useFetchFile';
import { PencilIcon, TrashIcon, EllipsisVerticalIcon } from '@heroicons/react/24/solid';
import { useDeleteFile } from '../../../hooks/useDeleteFile';
import DataTable from '../../../components/DataTable';
import dayjs from 'dayjs';

export default function Folders() {
    const dataIcon = useFetchIcons();
    const { files, loading } = useFetchFiles();

    const { handleDelete } = useDeleteFile()

    const columns = [
        {
            title: "ลำดับ",
            key: "number",
            render: (_: any, index: number) => {
                return (
                    <div className="flex flex-row items-center text-md font-medium gap-2">
                        <Text>
                            <Skeleton loading={loading}>
                                {index + 1}
                            </Skeleton>
                        </Text>
                    </div>
                )
            }
        },
        {
            title: "ชื่อไฟล์",
            key: "filename",
            render: (el: any, _index: number, row: any) => {
                return (
                    <div className="flex flex-row items-center text-md font-medium gap-2">
                        {loading ? <Skeleton width="26px" height="26px" /> : row?.icon?.icon_url && <img src={row?.icon?.icon_url} alt={el} style={{ width: '26px', height: '26px' }} />}
                        <Text>
                            <Skeleton loading={loading}>
                                {el}
                            </Skeleton>
                        </Text>
                    </div>
                )
            }
        },
        {
            title: "วันที่สร้าง",
            key: "creationdate",
            render: (date: any) => {
                return (
                    <div className="flex flex-row items-center text-md font-medium gap-2">
                        <Text>
                            <Skeleton loading={loading}>
                                {dayjs(date).format('DD/MM/YYYY')}
                            </Skeleton>
                        </Text>
                    </div>
                )
            }
        },
        {
            title: "ผู้สร้าง",
            key: "owner",
            render: (owner: any) => {
                return (
                    <div className="flex flex-row items-center text-md font-medium gap-2">
                        <Text>
                            <Skeleton loading={loading}>
                                {owner}
                            </Skeleton>
                        </Text>
                    </div>
                )
            }
        },
        {
            title: "จัดการ",
            key: "manage",
            render: (_file: any, _index: number, row: any) => {
                return (
                    <Flex gap="2" ml="3">
                        <DropdownMenu.Root>
                            <DropdownMenu.Trigger>
                                {/* @ts-ignore */}
                                <Button size="1" color="gray" radius='large' variant="ghost">
                                    <EllipsisVerticalIcon className="w-5 h-5 " />
                                </Button>
                            </DropdownMenu.Trigger>
                            <DropdownMenu.Content variant="soft" color="gray">
                                <DropdownMenu.Item shortcut="⌘ E" onSelect={() => console.log('Edit clicked')}>
                                    <PencilIcon className="w-3 h-3" />
                                    <span className={"font-medium"}>แก้ไข</span>
                                </DropdownMenu.Item>
                                <DropdownMenu.Separator />
                                <DropdownMenu.Item shortcut="⌘ D" color="red" onSelect={() => handleDelete(row?.id, row.file_id)}>
                                    <TrashIcon className="w-3 h-3 text-red-600" />
                                    <span className={"font-medium"}>ลบ</span>
                                </DropdownMenu.Item>
                            </DropdownMenu.Content>
                        </DropdownMenu.Root>
                    </Flex>
                )
            }
        }
    ];

    return (
        <FoldersContainer className="w-full h-full flex justify-center bg-slate-50">
            <div className="max-w-screen-2xl w-full flex flex-col bg-white my-5 p-10 rounded-xl">
                <Flex direction="column" gap="5">
                    <h5 className="text-xl font-bold">จัดการไฟล์</h5>
                    <Flex direction="column" gap="3">
                        <Flex justify={"between"} width={"100%"}>
                            <SearchBar />
                            <DialogInput
                                trigger={
                                    //@ts-ignore
                                    <Button radius="large" variant="surface" className="font-custom" >
                                        <PlusIcon className={"w-4 h-4"} />
                                        <span className={"font-medium"}>เพิ่มไฟล์</span>
                                    </Button>
                                }
                                title='เพิ่มไฟล์'
                                dataIcon={dataIcon}
                            />
                        </Flex>

                        <Box>
                            <Tabs.Root defaultValue="all">
                                <Tabs.List>
                                    <Tabs.Trigger value="all" className="font-bold">ทั้งหมด</Tabs.Trigger>
                                    {dataIcon.map((item) => (
                                        <Tabs.Trigger value={item?.abbreviation} className={"flex gap-2 font-bold"}>
                                            <img src={item?.icon_url} alt={item?.type} style={{ width: '16px', height: '16px' }} />
                                            {item?.abbreviation?.toUpperCase()}
                                        </Tabs.Trigger>
                                    ))}
                                </Tabs.List>

                                <Box pt="3">
                                    <Tabs.Content value="all">
                                        <DataTable columns={columns} data={files} />
                                    </Tabs.Content>

                                    {dataIcon.map((item) => (
                                        <Tabs.Content value={item?.abbreviation}>

                                            <DataTable columns={columns} data={files.filter((folder: { filename: string; }) => folder.filename.endsWith(`.${item?.abbreviation}`))} />
                                        </Tabs.Content>
                                    ))}

                                </Box>


                            </Tabs.Root>


                        </Box>
                    </Flex>
                </Flex>
            </div>
        </FoldersContainer>
    );
}

Folders.propTypes = {};

Folders.defaultProps = {};
