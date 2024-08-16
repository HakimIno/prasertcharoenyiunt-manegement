// GLOBAL - imports from npm
// STYLES
import { UsersContainer } from './Users.styles';
import DataTable from '../../../components/DataTable';
import { useUsers } from './hooks/useUsers';
import { Badge, Box, Button, Dialog, DropdownMenu, Flex, Skeleton, Spinner, Tabs, Text } from '@radix-ui/themes';
import { EllipsisVerticalIcon, PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/solid';
import { useUserManagement } from '../../../hooks/useUserManagement';
import { useState } from 'preact/hooks';

export default function Users() {
    const { addUser, loading: usersLoading, notification, deleteUser, } = useUserManagement();
    const { users: usersData, loading, error, fetchUsers, } = useUsers(); // เพิ่ม fetchUsers มาจาก useUsers
    const [formState, setFormState] = useState({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        role: 'user',
        phone: '',
        branchName: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const target = e.target as HTMLInputElement | HTMLSelectElement;
        const { name, value } = target;
        setFormState(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleAddUser = async () => {
        const { email, password, firstname, lastname, role, phone } = formState;
        const response = await addUser(email, password, firstname, lastname, role, phone);

        if (response && !response.error) {
            resetForm();
            fetchUsers();
        } else {
            console.error('Failed to add user:', response?.error);
        }
    };

    const resetForm = () => {
        setFormState({
            firstname: '',
            lastname: '',
            email: '',
            password: '',
            role: 'user',
            phone: '',
            branchName: ''
        });
    };


    const columns = [
        {
            title: "ชื่อ",
            key: "firstname",
            render: (el: any) => {
                return (
                    <div className="flex flex-row items-center text-md font-medium gap-2 line-clamp-1 w-[300px]">
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
            title: "นามสกุล",
            key: "lastname",
            render: (el: any) => {
                return (
                    <div className="flex flex-row items-center text-md font-medium gap-2 line-clamp-1 w-[300px]">
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
            title: "ตำแหน่ง",
            key: "role",
            render: (el: any) => {
                return (
                    <div className="flex flex-row items-center text-md font-medium gap-2 line-clamp-1 w-[300px]">
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
            title: "อีเมล",
            key: "email",
            render: (el: any) => {
                return (
                    <div className="flex flex-row items-center text-md font-medium gap-2 line-clamp-1 w-[300px]">
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
            title: "เบอร์โทรศัพทร์",
            key: "phone",
            render: (el: any) => {
                return (
                    <div className="flex flex-row items-center text-md font-medium gap-2 line-clamp-1 w-[300px]">
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
            title: "จัดการ",
            key: "manage",
            render: (_: any, _index: number, row: any) => {
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
                                <DropdownMenu.Item shortcut="⌘ D" color="red" onSelect={() => deleteUser(row?.id)}>
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
                    <Flex justify={"between"}>
                        <div className=""></div>
                        <Dialog.Root>
                            <Dialog.Trigger>
                                {/* @ts-ignore*/}
                                <Button radius="large" variant="surface" className="font-custom" >
                                    <PlusIcon className={"w-4 h-4"} />
                                    <span className={"font-medium"}>เพิ่มผู้ใช้งาน</span>
                                </Button>
                            </Dialog.Trigger>

                            <Dialog.Content maxWidth="450px">
                                <Dialog.Title>เพิ่มผู้ใช้งาน</Dialog.Title>
                                <Flex direction="column" gap="3">
                                    {notification && (
                                        <Badge color="orange">{notification}</Badge>
                                    )}

                                    <label>
                                        <Text as="div" size="2" mb="1" weight="bold">
                                            ชื่อ
                                        </Text>
                                        <input
                                            type="text"
                                            name="firstname"
                                            value={formState.firstname}
                                            onChange={handleChange}
                                            placeholder="กรอกชื่อ"
                                            style={inputStyle}
                                        />
                                    </label>

                                    <label>
                                        <Text as="div" size="2" mb="1" weight="bold">
                                            นามสกุล
                                        </Text>
                                        <input
                                            type="text"
                                            name="lastname"
                                            value={formState.lastname}
                                            onChange={handleChange}
                                            placeholder="กรอกนามสกุล"
                                            style={inputStyle}
                                        />
                                    </label>

                                    <label>
                                        <Text as="div" size="2" mb="1" weight="bold">
                                            อีเมล
                                        </Text>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formState.email}
                                            onChange={handleChange}
                                            placeholder="กรอกอีเมล"
                                            style={inputStyle}
                                        />
                                    </label>

                                    <label>
                                        <Text as="div" size="2" mb="1" weight="bold">
                                            รหัสผ่าน
                                        </Text>
                                        <input
                                            type="password"
                                            name="password"
                                            value={formState.password}
                                            onChange={handleChange}
                                            placeholder="กรอกรหัสผ่าน"
                                            style={inputStyle}
                                        />
                                    </label>

                                    <label>
                                        <Text as="div" size="2" mb="1" weight="bold">
                                            ตำแหน่ง
                                        </Text>
                                        <select
                                            name="role"
                                            value={formState.role}
                                            onChange={handleChange}
                                            style={inputStyle}
                                        >
                                            <option value="user">ผู้ใช้งาน</option>
                                            <option value="admin">ผู้ดูแลระบบ</option>
                                        </select>
                                    </label>

                                    <label>
                                        <Text as="div" size="2" mb="1" weight="bold">
                                            เบอร์โทรศัพท์
                                        </Text>
                                        <input
                                            type="text"
                                            name="phone"
                                            value={formState.phone}
                                            onChange={handleChange}
                                            placeholder="กรอกเบอร์โทรศัพท์"
                                            style={inputStyle}
                                        />
                                    </label>
                                </Flex>

                                <Flex gap="3" mt="4" justify="end">
                                    <Dialog.Close>
                                        {/* @ts-ignore */}
                                        <Button variant="soft" color="gray">
                                            ยกเลิก
                                        </Button>
                                    </Dialog.Close>
                                    <button onClick={handleAddUser} className="w-16 h-8 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center">
                                        {usersLoading ? <Spinner size="3" /> : <span className={"font-semibold"}>เพิ่ม</span>}
                                    </button>
                                </Flex>
                            </Dialog.Content>
                        </Dialog.Root>
                    </Flex>
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

const inputStyle = {
    padding: '7px',
    width: '100%',
    boxSizing: 'border-box',
    borderRadius: '4px',
    border: '1px solid #ccc'
};

Users.propTypes = {};

Users.defaultProps = {};