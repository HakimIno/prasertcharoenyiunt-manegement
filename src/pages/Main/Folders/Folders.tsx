// GLOBAL - imports from npm
import { FoldersContainer } from './Folders.styles';
import { Box, Button, Dialog, DropdownMenu, Flex, Spinner, Text } from '@radix-ui/themes';
import { useState } from 'preact/hooks';
import { useFetchBranchs } from '../../../hooks/useFetchBranchs';
import { useNavigate } from 'react-router-dom';
import { EllipsisVerticalIcon, FaceFrownIcon, FolderPlusIcon, PencilIcon, QueueListIcon, Squares2X2Icon, TrashIcon } from '@heroicons/react/24/solid';
import { useCreateBranch } from '../../../hooks/useCreateBranch';
import { useUpdateBranch } from '../../../hooks/useUpdateBranch';
import { useDeleteBranch } from '../../../hooks/useDeleteBranch';
import toast, { Toaster } from 'react-hot-toast';
import { useGlobalState } from '../../../context/GlobalStateProvider';
import { useAuth } from '../../../context/AuthContext';
import SearchBar from './components/SearchBar';


export default function Folders() {
    const { dataBranchs, loading: loadingDataBranchs, fetchBranchs } = useFetchBranchs();
    const { updateBranch, loading: updating, error: updateError } = useUpdateBranch();
    const { deleteBranch, loading: deleting, error: deleteError } = useDeleteBranch();

    const navigate = useNavigate(); // ใช้ useNavigate เพื่อจัดการการนำทาง

    const { viewMode, toggleViewMode } = useGlobalState();

    const handleBranchClick = (branchId: number, branchName: string) => {
        const encodedBranchName = encodeURIComponent(branchName); // เข้ารหัส branchName เพื่อให้ปลอดภัยในการใช้ใน URL
        navigate(`/branches/${branchId}/typecars?branchName=${encodedBranchName}`); // นำทางไปยังหน้า TypeCarsPage พร้อมกับชื่อ branch
    };

    const { createBranch, loading: loadingCreateBranch } = useCreateBranch();
    const [newBranch, setNewBranch] = useState('');
    const [branchId, setBranchId] = useState<number>(0)
    const [open, setOpen] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);

    const handleCreateBranch = async () => {
        if (newBranch) {
            try {
                await createBranch(newBranch);
                setNewBranch('');
                toast.success("สาขาถูกสร้างเรียบร้อยแล้ว!")
                fetchBranchs();
            } catch (error: any) {
                toast.error(error)
            }
        } else {
            toast.error("กรุณากรอกชื่อสาขาใหม่")
        }

    };

    const handleUpdate = async () => {
        if (branchId !== 0 && newBranch) {
            const result = await updateBranch(branchId, newBranch);
            if (!result.error) {
                toast.success("อัปเดตสาขาเรียบร้อยแล้ว")
                setNewBranch("")
                fetchBranchs();
            } else {
                toast.error(updateError)
            }
        } else {
            toast.error("มีบางอย่างไม่ถูกต้อง!")
        }
    };

    const handleDelete = async () => {
        if (branchId !== 0) {
            const result = await deleteBranch(branchId);
            if (!result.error) {
                toast.success("ลบสาขาเรียบร้อยแล้ว")
                setNewBranch("")
                fetchBranchs();
            } else {
                toast.error(deleteError)
            }
        } else {
            toast.error("มีบางอย่างไม่ถูกต้อง!")
        }
    };

    const handleChange = (e: any) => setNewBranch(e.target.value);
    const { role } = useAuth();

    return (
        <FoldersContainer className="w-full h-full flex justify-center bg-slate-50">
            <Toaster
                position="top-right"
                reverseOrder={false}
            />
            <div className="max-w-screen-2xl w-full flex flex-col bg-white my-5 p-10 rounded-xl">
                <Flex direction="column" gap="2">
                    <Flex align={'center'} gap={"3"}>
                        <h5 className="text-xl font-semibold px-2">หน้าแรก</h5>

                    </Flex>

                    <Flex justify="between" align="center" gap="3">
                        <SearchBar />
                        <div className="flex items-center gap-3">
                            <button onClick={toggleViewMode} className="bg-zinc-100 p-1.5 rounded-lg">
                                {viewMode === 'grid' ? <QueueListIcon className={"w-6 h-6 text-gray-800"} /> : <Squares2X2Icon className={"w-6 h-6 text-gray-800"} />}
                            </button>

                            <Dialog.Root>
                                {(role === "superadmin" || role === "admin") && (
                                    <Dialog.Trigger>
                                        <button className="p-1.5 w-[130px] bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center gap-2">
                                            <FolderPlusIcon className={"w-5 h-5 text-white"} />
                                            โฟลเดอร์ใหม่
                                        </button>
                                    </Dialog.Trigger>
                                )}


                                <Dialog.Content maxWidth="450px">
                                    <Dialog.Title>โฟลเดอร์ใหม่สาขา</Dialog.Title>

                                    <Flex direction="column" gap="3">
                                        <label>
                                            <Text as="div" size="2" mb="1" weight="bold">
                                                สาขา
                                            </Text>
                                            <input
                                                type="text"
                                                value={newBranch}
                                                onChange={(e: any) => setNewBranch(e.target.value)}
                                                placeholder="ชื่อโฟลเดอร์สาขา"
                                                style={{
                                                    padding: '8px',
                                                    width: '100%',
                                                    boxSizing: 'border-box',
                                                    borderRadius: '4px',
                                                    border: '1px solid #ccc',
                                                }}
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
                                        <Dialog.Close>
                                            <button onClick={handleCreateBranch} className="w-16 h-8 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center">
                                                {loadingCreateBranch ? <Spinner size="2" /> : <span className={"font-semibold"}>สร้าง</span>}
                                            </button>
                                        </Dialog.Close>
                                    </Flex>
                                </Dialog.Content>
                            </Dialog.Root>
                        </div>
                    </Flex>

                    {/* Display Branches */}
                    <Flex direction={viewMode === 'grid' ? 'row' : 'column'} gap="1" wrap="wrap">
                        {loadingDataBranchs ? (
                            <div className={"flex flex-col items-center justify-center w-full h-[35rem] gap-3"}>
                                <Spinner size={"3"} />
                                <p className={"font-sukhumvit font-semibold"}>กำลังโหลด...</p>
                            </div>
                        ) : (
                            <>
                                {dataBranchs.length === 0 ? (
                                    <div className="text-center text-gray-500  w-full h-full mt-20 justify-center flex">
                                        <div className="flex flex-col items-center justify-center">
                                            <FaceFrownIcon className={"w-28 h-28 text-zinc-200"} />
                                            ไม่มีข้อมูล
                                        </div>
                                    </div>
                                ) : (
                                    dataBranchs.map(branch => (
                                        <Box
                                            key={branch.id}
                                            onClick={() => handleBranchClick(branch.id, branch.branch_name)} // เมื่อคลิกจะไปยังหน้าใหม่
                                            className="relative cursor-pointer p-2 rounded-lg hover:bg-slate-50"
                                        >
                                            <div className={viewMode === 'grid' ? 'w-40 h-40 flex flex-col items-center justify-center' : 'w-full flex items-center'}>
                                                <img
                                                    src="https://gpamonnosfwdoxjvyrcw.supabase.co/storage/v1/object/public/media/FIleIcon/folder.png"
                                                    alt="iconfolder"
                                                    className={viewMode === 'grid' ? 'w-16 h-16 mb-4' : 'w-8 h-8 mr-4'}
                                                />
                                                <Text>{branch.branch_name}</Text>
                                            </div>

                                            {(role === "superadmin" || role === "admin") && (
                                                <Flex gap="2" ml="3" className={`absolute  right-2 ${viewMode === 'grid' ? "top-2" : "top-3"} `}>
                                                    <DropdownMenu.Root>
                                                        <DropdownMenu.Trigger asChild>
                                                            <EllipsisVerticalIcon className="w-6 h-6 text-[#1a1a1a]" />
                                                        </DropdownMenu.Trigger>
                                                        <DropdownMenu.Content variant="soft" color="gray">
                                                            <DropdownMenu.Item onSelect={() => { setBranchId(branch.id); setOpenEdit(true); }}>
                                                                <div className="flex flex-row gap-5 items-center justify-between">
                                                                    <PencilIcon className="w-3 h-3" />
                                                                    <span className="font-medium">แก้ไข</span>
                                                                </div>
                                                            </DropdownMenu.Item>
                                                            <DropdownMenu.Separator />
                                                            <DropdownMenu.Item color="red" onSelect={() => { setBranchId(branch.id); setOpen(true); }}>
                                                                <div className="flex flex-row gap-5 items-center justify-between">
                                                                    <TrashIcon className="w-3 h-3 text-red-600" />
                                                                    <span className="font-medium">ลบ</span>
                                                                </div>
                                                            </DropdownMenu.Item>
                                                        </DropdownMenu.Content>
                                                    </DropdownMenu.Root>
                                                </Flex>
                                            )}



                                        </Box>
                                    ))
                                )}
                            </>
                        )
                        }
                    </Flex>
                </Flex>
            </div>
            {/* Delete Dialog */}
            <Dialog.Root open={open} onOpenChange={setOpen}>
                <Dialog.Content maxWidth="450px">
                    <Dialog.Title>
                        <div className="font-semibold font-sukhumvit">
                            คุณแน่ใจว่าต้องการลบโฟลเดอร์นี้หรือไม่?
                        </div>
                    </Dialog.Title>
                    <Dialog.Description>
                        <div className="font-medium font-sukhumvit">
                            หากคุณลบโฟลเดอร์นี้ จะไม่สามารถกู้คืนได้
                        </div>
                    </Dialog.Description>
                    <Flex gap="3" mt="4" justify="end">
                        <Dialog.Close asChild>
                            {/* @ts-ignore */}
                            <Button variant="soft" color="gray">
                                <span className="font-semibold font-sukhumvit">ยกเลิก</span>
                            </Button>
                        </Dialog.Close>
                        <Dialog.Close asChild>
                            <button onClick={handleDelete} className="w-16 h-8 bg-blue-600 text-white rounded-md hover:bg-blue-700 items-center flex justify-center">
                                {deleting ? <Spinner size="2" /> : <span className={"font-semibold font-sukhumvit"}>ตกลง</span>}
                            </button>
                        </Dialog.Close>
                    </Flex>
                </Dialog.Content>
            </Dialog.Root>

            {/* Edit Dialog */}
            <Dialog.Root open={openEdit} onOpenChange={setOpenEdit}>
                <Dialog.Content maxWidth="450px">
                    <Dialog.Title>
                        <div className="font-semibold font-sukhumvit">
                            แก้ไขชื่อโฟลเดอร์
                        </div>
                    </Dialog.Title>
                    <Flex direction="column" gap="3">
                        <label>
                            <Text as="div" size="2" mb="1" weight="bold">
                                ชื่อโฟลเดอร์
                            </Text>
                            <input
                                className="w-full p-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="กรอกชื่อโฟลเดอร์สาขาใหม่"
                                value={newBranch}
                                onChange={handleChange}
                            />
                        </label>
                    </Flex>
                    <Flex gap="3" mt="4" justify="end">
                        <Dialog.Close asChild>
                            {/* @ts-ignore */}
                            <Button variant="soft" color="gray">
                                <span className="font-semibold font-sukhumvit">ยกเลิก</span>
                            </Button>
                        </Dialog.Close>
                        <Dialog.Close asChild>
                            {/* @ts-ignore */}
                            <button onClick={handleUpdate} className="w-16 h-8 bg-blue-600 text-white rounded-md hover:bg-blue-700 items-center flex justify-center">
                                {updating ? <Spinner size="2" /> : <span className={"font-semibold font-sukhumvit"}>ตกลง</span>}
                            </button>
                        </Dialog.Close>
                    </Flex>
                </Dialog.Content>
            </Dialog.Root>
        </FoldersContainer>
    );
}

// // GLOBAL - imports from npm
// // STYLES
// import { FoldersContainer } from './Folders.styles';
// import { Box, Button, Flex, Tabs, DropdownMenu, Text, Skeleton, Dialog, Spinner } from '@radix-ui/themes';
// import SearchBar from './components/SearchBar';
// import { PlusIcon } from '@heroicons/react/24/solid';
// import DialogInput from '../../../components/Dialog';
// import { useFetchIcons } from '../../../hooks/useFetchIcons';
// import { useFetchFiles } from '../../../hooks/useFetchFile';
// import { PencilIcon, TrashIcon, EllipsisVerticalIcon } from '@heroicons/react/24/solid';
// import { useDeleteFile } from '../../../hooks/useDeleteFile';
// import DataTable from '../../../components/DataTable';
// import dayjs from 'dayjs';
// import { useState } from 'preact/hooks';
// import { useFetchBranchs } from '../../../hooks/useFetchBranchs';
// import DropdownSelected from '../../../components/DropdownSelected';
// import { useUpdateFile } from '../../../hooks/useUpdateFile';
// import { useCreateBranch } from '../../../hooks/useCreateBranch';
// import { useCreateTypeCar } from '../../../hooks/useCreateTypeCar';
// import { useFetchTypeCar } from '../../../hooks/useFetchTypeCar';
// import { useAuth } from '../../../context/AuthContext';

// export default function Folders() {
//     const { role } = useAuth();
//     const [searchQuery, setSearchQuery] = useState<string>('');
//     const { files, loading } = useFetchFiles(searchQuery);
//     const dataBranchs = useFetchBranchs()
//     const dataTypeCar = useFetchTypeCar()
//     const dataIcon = useFetchIcons();

//     const { handleDelete, loading: deleteLoading } = useDeleteFile();
//     const { handleUpdateFile, loading: updateLoading } = useUpdateFile();

//     const [seletedId, setSeletedId] = useState(0)

//     const [open, setOpen] = useState(false);
//     const [openEdit, setOpenEdit] = useState(false);
//     const [seleteBranch, setSeleteBranch] = useState(0)
//     const [seleteTypeCars, setSeleteTypeCars] = useState(0)
//     const [newFilename, setNewFilename] = useState('');

//     const handleFilenameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         //@ts-ignore
//         setNewFilename(e.target.value);
//     };

//     const handleSelection = (option: number) => {
//         setSeleteBranch(option)
//     };

//     const handleSelectionTypeCar = (option: number) => {
//         setSeleteTypeCars(option)
//     };

//     const handleSearch = (query: string) => {
//         setSearchQuery(query);
//     };


//     const columns = [
//         {
//             title: "ลำดับ",
//             key: "number",
//             width: '30px',
//             render: (_: any, index: number) => {
//                 return (
//                     <div className="flex flex-row items-center text-md font-medium gap-2">
//                         <Text>
//                             <Skeleton loading={loading}>
//                                 {index + 1}
//                             </Skeleton>
//                         </Text>
//                     </div>
//                 )
//             }
//         },
//         {
//             title: "ชื่อไฟล์",
//             key: "filename",
//             width: '250px',
//             render: (el: any, _index: number, row: any) => {
//                 return (
//                     <div className="flex flex-row items-center text-md font-medium gap-2 line-clamp-1 w-[300px]">
//                         {loading ? <Skeleton width="26px" height="26px" /> : row?.icon?.icon_url && <img src={row?.icon?.icon_url} alt={el} style={{ width: '26px', height: '26px' }} />}
//                         <Text className="truncate-text">
//                             <Skeleton loading={loading}>
//                                 {el}
//                             </Skeleton>
//                         </Text>
//                     </div>
//                 )
//             }
//         },
//         {
//             title: "วันที่สร้าง",
//             width: '150px',
//             key: "creationdate",
//             render: (date: any) => {
//                 return (
//                     <div className="flex flex-row items-center text-md font-medium gap-2">
//                         <Text>
//                             <Skeleton loading={loading}>
//                                 {dayjs(date).format('DD/MM/YYYY')}
//                             </Skeleton>
//                         </Text>
//                     </div>
//                 )
//             }
//         },
//         {
//             title: "ผู้สร้าง",
//             width: '150px',
//             key: "owner",
//             render: (owner: any) => {
//                 return (
//                     <div className="flex flex-row items-center text-md font-medium gap-2">
//                         <Text>
//                             <Skeleton loading={loading}>
//                                 {owner}
//                             </Skeleton>
//                         </Text>
//                     </div>
//                 )
//             }
//         },
//         {
//             title: "จัดการ",
//             width: '150px',
//             key: "manage",
//             render: (_file: any, _index: number, row: any) => {
//                 return (
//                     <Flex gap="2" ml="3">
//                         <DropdownMenu.Root>
//                             <DropdownMenu.Trigger>
//                                 {/* @ts-ignore */}
//                                 <Button size="1" color="gray" radius='large' variant="ghost">
//                                     <EllipsisVerticalIcon className="w-5 h-5 " />
//                                 </Button>
//                             </DropdownMenu.Trigger>
//                             {(role === "superadmin" || role === "admin") && (
//                                 <DropdownMenu.Content variant="soft" color="gray">
//                                     <DropdownMenu.Item shortcut="⌘ E" onSelect={() => {
//                                         setSeletedId(row?.id)
//                                         setOpenEdit(true)
//                                     }}>
//                                         <PencilIcon className="w-3 h-3" />
//                                         <span className={"font-medium"}>แก้ไข</span>
//                                     </DropdownMenu.Item>
//                                     <DropdownMenu.Separator />
//                                     <DropdownMenu.Item shortcut="⌘ D" color="red" onSelect={() => {
//                                         setSeletedId(row?.id)
//                                         setOpen(true)
//                                     }}>
//                                         <TrashIcon className="w-3 h-3 text-red-600" />
//                                         <span className={"font-medium"}>ลบ</span>
//                                     </DropdownMenu.Item>
//                                 </DropdownMenu.Content>
//                             )}
//                         </DropdownMenu.Root>

//                         <Dialog.Root open={open} onOpenChange={setOpen}>
//                             <Dialog.Content maxWidth="450px">
//                                 <Dialog.Title>
//                                     <div className="font-semibold font-sukhumvit">
//                                         คุณแน่ใจว่าต้องการลบไฟล์นี้หรือไม่?
//                                     </div>
//                                 </Dialog.Title>
//                                 <Dialog.Description size="2" mb="4">
//                                     <div className=" font-medium font-sukhumvit">
//                                         หากคุณลบไฟล์นี้ จะไม่สามารถกู้คืนได้
//                                     </div>

//                                 </Dialog.Description>

//                                 <Flex gap="3" mt="4" justify="end">
//                                     <Dialog.Close>
//                                         {/* @ts-ignore */}
//                                         <Button variant="soft" color="gray">
//                                             <span className={"font-semibold font-sukhumvit"}>ยกเลิก</span>
//                                         </Button>
//                                     </Dialog.Close>
//                                     <Dialog.Close>
//                                         <button onClick={() => {
//                                             handleDelete(seletedId, row?.file_id)
//                                             setSeletedId(0)
//                                         }} className="w-16 h-8 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center">
//                                             {deleteLoading ? <Spinner size="3" /> : <span className={"font-semibold font-sukhumvit"}>ตกลง</span>}
//                                         </button>
//                                     </Dialog.Close>
//                                 </Flex>
//                             </Dialog.Content>
//                         </Dialog.Root>

//                         <Dialog.Root open={openEdit} onOpenChange={setOpenEdit}>
//                             <Dialog.Content maxWidth="450px">
//                                 <Dialog.Title>
//                                     <div className="font-semibold font-sukhumvit">
//                                         แก้ไขชื่อไฟล์
//                                     </div>
//                                 </Dialog.Title>

//                                 <Flex direction="column" gap="3">
//                                     <label>
//                                         <Text as="div" size="2" mb="1" weight="bold">
//                                             ชื่อไฟล์
//                                         </Text>
//                                         <input
//                                             className="w-full p-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
//                                             placeholder="กรอกชื่อไฟล์ใหม่ ไม่ต้องใส่ .png หรือ . อื่นๆ"
//                                             value={newFilename}
//                                             onChange={handleFilenameChange}
//                                         />
//                                     </label>
//                                 </Flex>

//                                 <Flex gap="3" mt="4" justify="end">
//                                     <Dialog.Close>
//                                         {/* @ts-ignore */}
//                                         <Button variant="soft" color="gray">
//                                             <span className={"font-semibold font-sukhumvit"}>ยกเลิก</span>
//                                         </Button>
//                                     </Dialog.Close>
//                                     <Dialog.Close>
//                                         <button onClick={() => {
//                                             handleUpdateFile(seletedId, newFilename + "." + row?.filename.split('.')[1])
//                                             setSeletedId(0)
//                                         }}
//                                             className="w-16 h-8 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center">
//                                             {updateLoading ? <Spinner size="3" /> : <span className={"font-semibold font-sukhumvit"}>ตกลง</span>}
//                                         </button>
//                                     </Dialog.Close>
//                                 </Flex>
//                             </Dialog.Content>
//                         </Dialog.Root>
//                     </Flex >
//                 )
//             }
//         }
//     ];
//     const [branchName, setBranchName] = useState('');
//     const [typeCarName, setTypeCarName] = useState('');
//     const { createBranch, loading: loadingCreateBranch } = useCreateBranch();
//     const { createTypeCar, loading: loadingCreateTypeCar } = useCreateTypeCar()

//     const handleCreateBranch = async () => {
//         try {
//             await createBranch(branchName);
//             setBranchName('');
//             alert('สาขาถูกสร้างเรียบร้อยแล้ว!');
//             window.location.reload();
//         } catch (error) {
//             alert('เกิดข้อผิดพลาดในการสร้างสาขา');
//         }
//     };

//     const handleCreateTypeCars = async () => {
//         try {
//             await createTypeCar(typeCarName);
//             setTypeCarName('');
//             alert('ประเภทรถถูกสร้างเรียบร้อยแล้ว!');
//             window.location.reload();
//         } catch (error) {
//             alert('เกิดข้อผิดพลาดในการสร้างสาขา');
//         }
//     };


//     return (
//         <FoldersContainer className="w-full h-full flex justify-center bg-slate-50">
//             <div className="max-w-screen-2xl w-full flex flex-col bg-white my-5 p-10 rounded-xl">
//                 <Flex direction="column" gap="5">
//                     <h5 className="text-xl font-bold">จัดการไฟล์</h5>
//                     <Flex direction="column" gap="3">
//                         <Flex justify={"between"} width={"100%"}>
//                             <Flex gap={"4"}>
//                                 <SearchBar onSearch={handleSearch} />
//                                 <DropdownSelected
//                                     options={dataBranchs.map(branch => ({ id: branch.id, name: branch.branch_name }))}
//                                     onSelect={handleSelection}
//                                     placeholder="สาขา"
//                                 />

//                                 <DropdownSelected
//                                     options={dataTypeCar.map(typeCar => ({ id: typeCar.id, name: typeCar.car_type_name }))}
//                                     onSelect={handleSelectionTypeCar}
//                                     placeholder="สาขา"
//                                 />
//                             </Flex>
//                             {(role === "superadmin" || role === "admin") && (
//                                 <Flex gap={"3"}>

//                                     <Dialog.Root>
//                                         <Dialog.Trigger>
//                                             {/* @ts-ignore*/}
//                                             <Button color="cyan" variant="soft">สร้างสาขา</Button>
//                                         </Dialog.Trigger>

//                                         <Dialog.Content maxWidth="450px">
//                                             <Dialog.Title>สร้างสาขา</Dialog.Title>

//                                             <Flex direction="column" gap="3">
//                                                 <label>
//                                                     <Text as="div" size="2" mb="1" weight="bold">
//                                                         สาขา
//                                                     </Text>
//                                                     <input
//                                                         type="text"
//                                                         value={branchName}
//                                                         onChange={(e: any) => setBranchName(e.target.value)}
//                                                         placeholder="กรอกชื่อสาขา"
//                                                         style={{
//                                                             padding: '8px',
//                                                             width: '100%',
//                                                             boxSizing: 'border-box',
//                                                             borderRadius: '4px',
//                                                             border: '1px solid #ccc',
//                                                         }}
//                                                     />
//                                                 </label>
//                                             </Flex>

//                                             <Flex gap="3" mt="4" justify="end">
//                                                 <Dialog.Close>
//                                                     {/* @ts-ignore */}
//                                                     <Button variant="soft" color="gray">
//                                                         ยกเลิก
//                                                     </Button>
//                                                 </Dialog.Close>
//                                                 <Dialog.Close>

//                                                     <button onClick={handleCreateBranch} className="w-16 h-8 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center">
//                                                         {loadingCreateBranch ? <Spinner size="3" /> : <span className={"font-semibold"}>สร้าง</span>}
//                                                     </button>
//                                                 </Dialog.Close>
//                                             </Flex>
//                                         </Dialog.Content>
//                                     </Dialog.Root>

//                                     <Dialog.Root>
//                                         <Dialog.Trigger>
//                                             {/* @ts-ignore*/}
//                                             <Button color="crimson" variant="soft">สร้างประเภทรถ</Button>
//                                         </Dialog.Trigger>

//                                         <Dialog.Content maxWidth="450px">
//                                             <Dialog.Title>สร้างประเภทรถ</Dialog.Title>

//                                             <Flex direction="column" gap="3">
//                                                 <label>
//                                                     <Text as="div" size="2" mb="1" weight="bold">
//                                                         ประเภทรถ
//                                                     </Text>
//                                                     <input
//                                                         type="text"
//                                                         value={typeCarName}
//                                                         onChange={(e: any) => setTypeCarName(e.target.value)}
//                                                         placeholder="กรอกชื่อประเภทรถ"
//                                                         style={{
//                                                             padding: '8px',
//                                                             width: '100%',
//                                                             boxSizing: 'border-box',
//                                                             borderRadius: '4px',
//                                                             border: '1px solid #ccc',
//                                                         }}
//                                                     />
//                                                 </label>
//                                             </Flex>

//                                             <Flex gap="3" mt="4" justify="end">
//                                                 <Dialog.Close>
//                                                     {/* @ts-ignore */}
//                                                     <Button variant="soft" color="gray">
//                                                         ยกเลิก
//                                                     </Button>
//                                                 </Dialog.Close>
//                                                 <Dialog.Close>
//                                                     <button onClick={handleCreateTypeCars} className="w-16 h-8 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center">
//                                                         {loadingCreateTypeCar ? <Spinner size="3" /> : <span className={"font-semibold"}>สร้าง</span>}
//                                                     </button>
//                                                 </Dialog.Close>
//                                             </Flex>
//                                         </Dialog.Content>
//                                     </Dialog.Root>

//                                     <DialogInput
//                                         trigger={
//                                             //@ts-ignore
//                                             <Button radius="large" variant="surface" className="font-custom" >
//                                                 <PlusIcon className={"w-4 h-4"} />
//                                                 <span className={"font-medium"}>เพิ่มไฟล์</span>
//                                             </Button>
//                                         }
//                                         title='เพิ่มไฟล์'
//                                     />
//                                 </Flex>
//                             )}
//                         </Flex>
//                         <Box>
//                             <Tabs.Root defaultValue="all">
//                                 <Tabs.List>
//                                     <Tabs.Trigger value="all" ><div className={"font-semibold font-sukhumvit"}>ทั้งหมด</div></Tabs.Trigger>
//                                     {dataIcon.map((item) => (
//                                         <Tabs.Trigger value={item?.abbreviation}>
//                                             <div className="flex gap-1 font-semibold font-sukhumvit">
//                                                 <img src={item?.icon_url} alt={item?.type} style={{ width: '16px', height: '16px' }} />
//                                                 <div className={"font-semibold font-sukhumvit"}>{item?.abbreviation?.toUpperCase()}</div>
//                                             </div>
//                                         </Tabs.Trigger>
//                                     ))}
//                                 </Tabs.List>

//                                 <Box pt="3">
//                                     <Tabs.Content value="all">
//                                         <DataTable columns={columns} data={
//                                             files
//                                                 .filter((branch) => seleteBranch === 0 || branch?.branchs?.id === seleteBranch)
//                                                 .filter((type) => seleteTypeCars === 0 || type?.type_cars?.id === seleteTypeCars)
//                                         } />
//                                     </Tabs.Content>

//                                     {dataIcon.map((item) => (
//                                         <Tabs.Content value={item?.abbreviation}>
//                                             <DataTable
//                                                 columns={columns}
//                                                 data={files
//                                                     .filter((folder) => folder.icon.id === item?.id)
//                                                     .filter((branch) => seleteBranch === 0 || branch?.branchs?.id === seleteBranch)
//                                                     .filter((type) => seleteTypeCars === 0 || type?.type_cars?.id === seleteTypeCars)
//                                                 }
//                                             />
//                                         </Tabs.Content>
//                                     ))}

//                                 </Box>
//                             </Tabs.Root>
//                         </Box>
//                     </Flex>
//                 </Flex>
//             </div>
//         </FoldersContainer>
//     );
// }

// Folders.propTypes = {};

// Folders.defaultProps = {};
