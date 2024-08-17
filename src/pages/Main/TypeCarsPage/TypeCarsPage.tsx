import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useFetchTypeCar } from '../../../hooks/useFetchTypeCar';
import { Box, Button, Dialog, DropdownMenu, Flex, Spinner, Text } from '@radix-ui/themes';
import { FoldersContainer } from '../Folders/Folders.styles';
import { useCreateTypeCar } from '../../../hooks/useCreateTypeCar';
import { ArrowLeftIcon, ChevronRightIcon, EllipsisVerticalIcon, FaceFrownIcon, FolderPlusIcon, PencilIcon, QueueListIcon, Squares2X2Icon, TrashIcon } from '@heroicons/react/24/solid';
import { useGlobalState } from '../../../context/GlobalStateProvider';
import toast, { Toaster } from 'react-hot-toast';
import { useUpdateTypeCar } from '../../../hooks/useUpdateTypeCar';
import { useDeleteTypeCar } from '../../../hooks/useDeleteTypeCar';
import { useAuth } from '../../../context/AuthContext';

export default function TypeCarsPage() {
    const { branchId } = useParams(); // รับ branchId จาก URL
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const branchName = queryParams.get('branchName'); // ดึงค่า branchName จาก query parameters
    const { dataTypeCars, loading: loadingDataTypeCars, fetchTypeCars } = useFetchTypeCar(branchId); // ดึงข้อมูล TypeCars
    const { createTypeCar, loading: loadingCreateTypeCar } = useCreateTypeCar(); // ใช้ hook สำหรับสร้าง TypeCar

    const { updateTypeCar, loading: updating, error: updateError } = useUpdateTypeCar();
    const { deleteTypeCar, loading: deleting, error: deleteError } = useDeleteTypeCar();

    const { viewMode, toggleViewMode } = useGlobalState();

    const [newTypeCarName, setNewTypeCarName] = useState(''); // สถานะเพื่อเก็บชื่อประเภทรถใหม่



    const navigate = useNavigate(); // สร้าง hook navigate สำหรับการนำทาง

    const handleBackClick = () => {
        navigate(-1); // นำทางกลับไปหน้าก่อนหน้านี้
    };

    const handleTypeCarClick = (typeCarId: number, typeCarName: string) => {
        navigate(`/branches/${branchId}/typecars/${typeCarId}/files?branchName=${encodeURIComponent(String(branchName))}&typeCarName=${encodeURIComponent(typeCarName)}`);
    };

    const [newTypeCar, setNewTypeCar] = useState('');
    const [typeCarId, setTypeCarId] = useState<number>(0)
    const [open, setOpen] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);

    const handleCreateTypeCar = async () => {
        if (newTypeCarName.trim() && branchId) {
            await createTypeCar(newTypeCarName, Number(branchId))
            toast.success("สร้างโฟลเดอร์เรียบร้อยแล้ว")
            setNewTypeCarName('');
            fetchTypeCars()
        } else {
            toast.error("มีบางอย่างไม่ถูกต้อง!")
        }
    };


    const handleUpdate = async () => {
        if (typeCarId !== 0 && newTypeCar) {
            const result = await updateTypeCar(typeCarId, newTypeCar);
            if (!result.error) {
                toast.success("อัปเดตประเภทรถเรียบร้อยแล้ว")
                setNewTypeCar("")
                fetchTypeCars()
            } else {
                toast.error(updateError)
            }
        } else {
            toast.error("มีบางอย่างไม่ถูกต้อง!")
        }
    };

    const handleDelete = async () => {
        if (typeCarId !== 0) {
            const result = await deleteTypeCar(typeCarId);
            if (!result.error) {
                toast.success("ลบสาขาเรียบร้อยแล้ว")
                setNewTypeCar("")
                fetchTypeCars()
            } else {
                toast.error(deleteError)
            }
        } else {
            toast.error("มีบางอย่างไม่ถูกต้อง!")
        }
    };

    const handleChange = (e: any) => setNewTypeCar(e.target.value);

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
                        <button onClick={handleBackClick} className={" p-2 bg-blue-50 rounded-full"}>
                            <ArrowLeftIcon className={"w-6 h-6  text-blue-600"} />
                        </button>
                        <h5 className="text-xl font-semibold flex items-center gap-2">หน้าแรก <ChevronRightIcon className={"h-5 w-5"} />  <span className={"text-blue-600"}>{branchName}</span></h5>
                    </Flex>
                    <Flex justify="between" align="center" gap="3">
                        <div className=""></div>
                        <div className="flex items-center gap-3">
                            <button onClick={toggleViewMode} className="bg-sky-50 p-1.5 rounded-lg">
                                {viewMode === 'grid' ? <QueueListIcon className={"w-6 h-6 text-sky-600"} /> : <Squares2X2Icon className={"w-6 h-6 text-sky-600"} />}
                            </button>

                            <Dialog.Root>
                                {(role === "superadmin" || role === "admin") && (
                                    <Dialog.Trigger>
                                        {/* @ts-ignore*/}
                                        <Button color="blue" variant="soft">
                                            <FolderPlusIcon className={"w-5 h-5"} />
                                            โฟลเดอร์ใหม่
                                        </Button>
                                    </Dialog.Trigger>
                                )}


                                <Dialog.Content maxWidth="450px">
                                    <Dialog.Title>สร้างประเภทรถ</Dialog.Title>

                                    <Flex direction="column" gap="3">
                                        <label>
                                            <Text as="div" size="2" mb="1" weight="bold">
                                                ประเภทรถ
                                            </Text>
                                            <input
                                                type="text"
                                                value={newTypeCarName}
                                                onChange={(e: any) => setNewTypeCarName(e.target.value)}
                                                placeholder="กรอกชื่อประเภทรถ"
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
                                            <button onClick={handleCreateTypeCar} className="w-16 h-8 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center">
                                                {loadingCreateTypeCar ? <Spinner size="3" /> : <span className={"font-semibold"}>สร้าง</span>}
                                            </button>
                                        </Dialog.Close>
                                    </Flex>
                                </Dialog.Content>
                            </Dialog.Root>
                        </div>
                    </Flex>



                    {/* Display TypeCars */}
                    <Flex direction={viewMode === 'grid' ? 'row' : 'column'} gap="2" wrap="wrap">
                        {loadingDataTypeCars ? (
                            <div className={"flex flex-col items-center justify-center w-full h-[35rem] gap-3"}>
                                <Spinner size={"3"} />
                                <p className={"font-sukhumvit font-semibold"}>กำลังโหลด...</p>
                            </div>
                        ) : (
                            <>
                                {dataTypeCars.length === 0 ? (
                                    <div className="text-center text-gray-500  w-full h-full mt-20 justify-center flex">
                                        <div className="flex flex-col items-center justify-center">
                                            <FaceFrownIcon className={"w-28 h-28 text-zinc-200"} />
                                            ไม่มีข้อมูล
                                        </div>
                                    </div>
                                ) : (
                                    dataTypeCars.map(typeCar => (
                                        <Box
                                            key={typeCar.id}
                                            onClick={() => handleTypeCarClick(typeCar.id, typeCar.car_type_name)} // เ
                                            className="relative cursor-pointer p-2 rounded-lg hover:bg-slate-50"
                                        >
                                            <div className={viewMode === 'grid' ? 'w-40 h-40 flex flex-col items-center justify-center' : 'w-full flex items-center'}>
                                                <img
                                                    src="https://gpamonnosfwdoxjvyrcw.supabase.co/storage/v1/object/public/media/FIleIcon/folder.png"
                                                    alt="iconfolder"
                                                    className={viewMode === 'grid' ? 'w-16 h-16 mb-4' : 'w-8 h-8 mr-4'}
                                                />
                                                <div className=" font-sukhumvit font-semibold line-clamp-2">
                                                    {typeCar.car_type_name}
                                                </div>
                                            </div>

                                            {(role === "superadmin" || role === "admin") && (
                                                <Flex gap="2" ml="3" className={`absolute  right-2 ${viewMode === 'grid' ? "top-2" : "top-3"} `}>

                                                    <DropdownMenu.Root>
                                                        <DropdownMenu.Trigger asChild>
                                                            <EllipsisVerticalIcon className="w-6 h-6 text-[#1a1a1a]" />
                                                        </DropdownMenu.Trigger>
                                                        <DropdownMenu.Content variant="soft" color="gray">
                                                            <DropdownMenu.Item onSelect={() => { setTypeCarId(typeCar.id); setOpenEdit(true); }}>
                                                                <div className="flex flex-row gap-5 items-center justify-between">
                                                                    <PencilIcon className="w-3 h-3" />
                                                                    <span className="font-medium">แก้ไข</span>
                                                                </div>
                                                            </DropdownMenu.Item>
                                                            <DropdownMenu.Separator />
                                                            <DropdownMenu.Item color="red" onSelect={() => { setTypeCarId(typeCar.id); setOpen(true); }}>
                                                                <div className="flex flex-row gap-5 items-center justify-between">
                                                                    <TrashIcon className="w-3 h-3 text-red-600" />
                                                                    <span className="font-medium">ลบ</span>
                                                                </div>
                                                            </DropdownMenu.Item>
                                                        </DropdownMenu.Content>
                                                    </DropdownMenu.Root>
                                                </Flex>
                                            )}


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
                                                                value={newTypeCar}
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
                                        </Box>
                                    ))
                                )}
                            </>
                        )}
                    </Flex>
                </Flex>
            </div>
        </FoldersContainer>
    );
}
