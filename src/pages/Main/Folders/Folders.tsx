// GLOBAL - imports from npm
// STYLES
import { FoldersContainer } from './Folders.styles';
import { Box, Button, Flex, Tabs, DropdownMenu, Text, Skeleton, Dialog, Spinner } from '@radix-ui/themes';
import SearchBar from './components/SearchBar';
import { PlusIcon } from '@heroicons/react/24/solid';
import DialogInput from '../../../components/Dialog';
import { useFetchIcons } from '../../../hooks/useFetchIcons';
import { useFetchFiles } from '../../../hooks/useFetchFile';
import { PencilIcon, TrashIcon, EllipsisVerticalIcon } from '@heroicons/react/24/solid';
import { useDeleteFile } from '../../../hooks/useDeleteFile';
import DataTable from '../../../components/DataTable';
import dayjs from 'dayjs';
import { useState } from 'preact/hooks';

export default function Folders() {
    const dataIcon = useFetchIcons();
    const { files, loading } = useFetchFiles();

    const { handleDelete, loading: deleteLoading } = useDeleteFile()

    const [open, setOpen] = useState(false);

    const columns = [
        {
            title: "ลำดับ",
            key: "number",
            width: '30px',
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
            width: '250px',
            render: (el: any, _index: number, row: any) => {
                return (
                    <div className="flex flex-row items-center text-md font-medium gap-2 line-clamp-1 w-[300px]">
                        {loading ? <Skeleton width="26px" height="26px" /> : row?.icon?.icon_url && <img src={row?.icon?.icon_url} alt={el} style={{ width: '26px', height: '26px' }} />}
                        <Text className="truncate-text">
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
            width: '150px',
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
            width: '150px',
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
            width: '150px',
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
                                <DropdownMenu.Item shortcut="⌘ D" color="red" onSelect={() => setOpen(true)}>
                                    <TrashIcon className="w-3 h-3 text-red-600" />
                                    <span className={"font-medium"}>ลบ</span>
                                </DropdownMenu.Item>
                            </DropdownMenu.Content>
                        </DropdownMenu.Root>

                        <Dialog.Root open={open} onOpenChange={setOpen}>
                            <Dialog.Content maxWidth="450px">
                                <Dialog.Title>
                                    <div className="font-semibold font-sukhumvit">
                                        คุณแน่ใจว่าต้องการลบไฟล์นี้หรือไม่?
                                    </div>
                                </Dialog.Title>
                                <Dialog.Description size="2" mb="4">
                                    <div className=" font-medium font-sukhumvit">
                                        หากคุณลบไฟล์นี้ จะไม่สามารถกู้คืนได้
                                    </div>

                                </Dialog.Description>

                                <Flex gap="3" mt="4" justify="end">
                                    <Dialog.Close>
                                        {/* @ts-ignore */}
                                        <Button variant="soft" color="gray">
                                            <span className={"font-semibold font-sukhumvit"}>ยกเลิก</span>
                                        </Button>
                                    </Dialog.Close>
                                    <Dialog.Close>
                                        <button onClick={() => handleDelete(row?.id, row?.file_id)} className="w-16 h-8 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center">
                                            {deleteLoading ? <Spinner size="3" /> : <span className={"font-semibold font-sukhumvit"}>ตกลง</span>}
                                        </button>
                                    </Dialog.Close>
                                </Flex>
                            </Dialog.Content>
                        </Dialog.Root>
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
                                    <Tabs.Trigger value="all" ><div className={"font-semibold font-sukhumvit"}>ทั้งหมด</div></Tabs.Trigger>
                                    {dataIcon.map((item) => (
                                        <Tabs.Trigger value={item?.abbreviation} className={"flex gap-2 font-semibold font-sukhumvit"}>
                                            <img src={item?.icon_url} alt={item?.type} style={{ width: '16px', height: '16px' }} />
                                            <div className={"font-semibold font-sukhumvit"}>{item?.abbreviation?.toUpperCase()}</div>
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
