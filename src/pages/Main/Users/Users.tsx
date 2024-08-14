// GLOBAL - imports from npm
// STYLES
import { UsersContainer } from './Users.styles';
import DataTable from '../../../components/DataTable';
import { useUsers } from './hooks/useUsers';
import { Box, Button, DropdownMenu, Flex, Tabs } from '@radix-ui/themes';
import { EllipsisVerticalIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/solid';

export default function Users() {

    const { users: usersData, loading, error } = useUsers()

    const columns = [
        {
            title: "ชื่อ",
            key: "firstname",
        },
        {
            title: "นามสกุล",
            key: "lastname",
        },
        {
            title: "ตำแหน่ง",
            key: "role",
        },
        {
            title: "อีเมล",
            key: "email",
        },
        {
            title: "เบอร์โทรศัพทร์",
            key: "phone",
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


    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;


    return (
        <UsersContainer className="w-full h-full flex  justify-center bg-slate-50">
            <div className="max-w-screen-2xl w-full flex flex-col bg-white  my-10  p-10 rounded-xl">
                <Flex direction="column" gap="3" >

                    <h5 className="text-xl font-bold ">จัดการข้อมูลผู้ใช้งาน</h5>
                    <Tabs.Root defaultValue="all">
                        <Tabs.List>
                            <Tabs.Trigger value="all">ทั้งหมด</Tabs.Trigger>
                            <Tabs.Trigger value="admin">ผู้ดูแลระบบ</Tabs.Trigger>
                            <Tabs.Trigger value="user">ผู้ใช้งาน</Tabs.Trigger>
                        </Tabs.List>

                        <Box pt="3">
                            <Tabs.Content value="all">
                                <DataTable columns={columns} data={usersData} />
                            </Tabs.Content>
                            <Tabs.Content value="admin">
                                <DataTable columns={columns} data={usersData.filter((user: { role: string; }) => user.role === "admin")} />
                            </Tabs.Content>
                            <Tabs.Content value="user">
                                <DataTable columns={columns} data={usersData.filter((user: { role: string; }) => user.role === "user")} />
                            </Tabs.Content>
                        </Box>
                    </Tabs.Root>
                </Flex>


            </div>
        </UsersContainer>
    )
}

Users.propTypes = {};

Users.defaultProps = {};