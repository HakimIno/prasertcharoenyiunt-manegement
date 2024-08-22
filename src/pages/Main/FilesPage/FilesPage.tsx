import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Box, Button, Dialog, DropdownMenu, Flex, Spinner, Text } from '@radix-ui/themes';
import { FoldersContainer } from '../Folders/Folders.styles';
import { useFetchFiles } from '../../../hooks/useFetchFile';
import { ArrowLeftIcon, ChevronRightIcon, EllipsisVerticalIcon, FaceFrownIcon, PencilIcon, PlusCircleIcon, TrashIcon, } from '@heroicons/react/24/solid';
import { QueueListIcon, Squares2X2Icon } from '@heroicons/react/24/solid';
import { useState } from 'preact/hooks';
import DialogInput from '../../../components/Dialog';
import { useUpdateFile } from '../../../hooks/useUpdateFile';
import { useDeleteFile } from '../../../hooks/useDeleteFile';
import { useGlobalState } from '../../../context/GlobalStateProvider';
import { useAuth } from '../../../context/AuthContext';
import toast, { Toaster } from 'react-hot-toast';
import CustomGalleryModal from '../../../components/CustomGalleryModal';
import PDFViewer from '../../../components/PDFViewer';

export default function FilesPage() {
    const { branchId, typeCarId } = useParams(); // รับ branchId และ typeCarId จาก URL
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const branchName = queryParams.get('branchName'); // ดึง branchName จาก query parameters
    const typeCarName = queryParams.get('typeCarName'); // ดึง typeCarName จาก query parameters

    const { session } = useAuth()

    const [open, setOpen] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [fileItem, setFileItem] = useState<{ filename: string, file_id: string, storage_provider: string }>({ filename: '', file_id: '', storage_provider: '' })
    const [newFilename, setNewFilename] = useState('');

    const handleFilenameChange = (e: any) => setNewFilename(e.target.value);

    const { handleUpdateFile, loading: updateLoading } = useUpdateFile();

    const { handleDelete, loading: deleteLoading } = useDeleteFile();


    const { files: dataFiles, loading: loadingDataFiles, fetchFilesWithIcons } = useFetchFiles('', Number(branchId), Number(typeCarId)); // ดึงข้อมูล Files พร้อมกรองด้วย branchId และ typeCarId

    const { viewMode, toggleViewMode } = useGlobalState();
    const { role } = useAuth();

    const handleDeleteClick = async () => {
        if (selectedId !== null) {
            try {
                const result = await handleDelete(Number(selectedId), fileItem?.file_id, fileItem?.storage_provider);
                if (result) {
                    toast.success("ลบไฟล์เรียบร้อยแล้ว");
                    setSelectedId(null);
                    setFileItem({ filename: '', file_id: '', storage_provider: '' });
                    fetchFilesWithIcons()
                } else {
                    toast.error("การลบไฟล์ล้มเหลว");
                }
            } catch (error) {
                toast.error("เกิดข้อผิดพลาดในการลบไฟล์");
            }
        } else {
            toast.error("มีบางอย่างไม่ถูกต้อง!");
        }
    };


    const handleUpdateClick = async () => {
        if (selectedId !== null) {
            try {
                const updatedFilename = `${newFilename}.${fileItem.filename.split('.').pop()}`;

                const result = await handleUpdateFile(Number(selectedId), updatedFilename);

                if (result) {
                    toast.success("อัปเดตชื่อไฟล์เรียบร้อยแล้ว");
                    setSelectedId(null);
                    setFileItem({ filename: '', file_id: '', storage_provider: '' });
                    fetchFilesWithIcons()
                } else {
                    toast.error("การอัปเดตชื่อไฟล์ล้มเหลว");
                }
            } catch (error) {
                toast.error("เกิดข้อผิดพลาดในการอัปเดตชื่อไฟล์");
                console.error("Error updating file:", error);
            }
        } else {
            toast.error("มีบางอย่างไม่ถูกต้อง!");
        }
    };


    const navigate = useNavigate(); // สร้าง hook navigate สำหรับการนำทาง
    const handleBackClick = () => {
        navigate(-1); // นำทางกลับไปหน้าก่อนหน้านี้
    };


    const [selectedFile, setSelectedFile] = useState<string>("");
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [isPDFOpen, setIsPDFOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];

    // Filter image files
    const imageFiles = dataFiles.filter(file => {
        const fileExtension = file.filename.split('.').pop().toLowerCase();
        return imageExtensions.includes(fileExtension);
    });

    const handleFileClick = (index: number) => {
        setCurrentImageIndex(index);
        setIsGalleryOpen(true);
    };

    const onClose = () => {
        setIsGalleryOpen(false)
        setCurrentImageIndex(0)
    }


    return (
        <FoldersContainer className="w-full h-full flex justify-center bg-slate-50">
            <Toaster
                position="top-right"
                reverseOrder={false}
            />
            <div className="max-w-screen-2xl w-full flex flex-col bg-white my-5 p-10 rounded-xl">
                <Flex direction="column">
                    <Flex align={'center'} gap={"3"}>
                        <button onClick={handleBackClick} className={" p-2 bg-blue-50 rounded-full"}>
                            <ArrowLeftIcon className={"w-6 h-6 text-blue-600"} />
                        </button>
                        <h5 className="text-xl font-semibold flex items-center gap-2">หน้าแรก  <ChevronRightIcon className={"h-5 w-5"} /> {branchName} <ChevronRightIcon className={"h-5 w-5"} />  <span className={"text-blue-600"}>{typeCarName}</span></h5>
                    </Flex>
                    <Flex direction="row" justify="between" align="center" gap="3">
                        <div className=""></div>
                        <div className="flex items-center gap-3">
                            <button onClick={toggleViewMode} className="bg-zinc-100 p-1.5 rounded-lg">
                                {viewMode === 'grid' ? <QueueListIcon className={"w-6 h-6 text-gray-800"} /> : <Squares2X2Icon className={"w-6 h-6 text-gray-800"} />}
                            </button>

                            {(role === "superadmin" || role === "admin") && (
                                <DialogInput
                                    trigger={
                                        <button className="p-1.5 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center gap-2">
                                            <PlusCircleIcon className={"w-4 h-4 text-white"} />
                                            <span className={"font-medium"}>เพิ่มไฟล์</span>
                                        </button>
                                    }
                                    title='เพิ่มไฟล์'
                                    branchId={Number(branchId)}
                                    typeCarId={Number(typeCarId)}
                                    fetchFilesWithIcons={fetchFilesWithIcons}
                                />
                            )}
                        </div>
                    </Flex>

                    <Flex direction={viewMode === 'grid' ? 'row' : 'column'} gap="2" wrap="wrap">
                        {loadingDataFiles ? (
                            <div className={"flex flex-col items-center justify-center w-full h-[35rem] gap-3"}>
                                <Spinner size={"3"} />
                                <p className={"font-sukhumvit font-semibold"}>กำลังโหลด...</p>
                            </div>
                        ) : (
                            <>
                                {dataFiles.length === 0 ? (
                                    <div className="text-center text-gray-500  w-full h-full mt-20 justify-center flex">
                                        <div className="flex flex-col items-center justify-center">
                                            <FaceFrownIcon className={"w-28 h-28 text-zinc-200"} />
                                            ไม่มีข้อมูล
                                        </div>
                                    </div>
                                ) : (
                                    dataFiles.map((file) => {
                                        const fileExtension = file.filename.split('.').pop().toLowerCase();

                                        return (
                                            <Box
                                                key={file.id}
                                                className="relative cursor-pointer p-2 rounded-lg hover:bg-slate-50"
                                                onClick={() => {
                                                    if (imageExtensions.includes(fileExtension)) {
                                                        const imageIndex = imageFiles.findIndex(imgFile => imgFile.id === file.id);
                                                        handleFileClick(imageIndex);
                                                    } else {
                                                        setSelectedFile(file?.file_id);
                                                        setIsPDFOpen(true)
                                                    }
                                                }}
                                            >
                                                <div className={viewMode === 'grid' ? 'w-40 h-40 flex flex-col items-center justify-center' : 'w-full flex items-center'}>
                                                    {file?.storage_provider === "cloudinary" ? (
                                                        <img
                                                            src={`https://res.cloudinary.com/dkm0oeset/image/upload/${file?.file_id}.${file.filename.split('.').pop()}`}
                                                            alt="iconfolder"
                                                            className={viewMode === 'grid' ? 'w-1/2 h-1/2 mb-4 rounded-lg' : 'w-14 h-14 mr-4 rounded-lg'}
                                                        />
                                                    ) : (
                                                        <img
                                                            src="https://gpamonnosfwdoxjvyrcw.supabase.co/storage/v1/object/public/media/FIleIcon/file.png"
                                                            alt="iconfolder"
                                                            className={viewMode === 'grid' ? 'w-16 h-16 mb-4' : 'w-14 h-14 mr-4'}
                                                        />
                                                    )}
                                                    <div className="font-sukhumvit font-semibold line-clamp-2 whitespace-normal break-words text-center">
                                                        {file.filename}
                                                    </div>
                                                </div>

                                                {(role === "superadmin" || role === "admin") && (
                                                    <Flex gap="2" ml="3" className={`absolute  right-2 ${viewMode === 'grid' ? "top-2" : "top-5"} `}>
                                                        <DropdownMenu.Root>
                                                            <DropdownMenu.Trigger asChild>
                                                                <EllipsisVerticalIcon className="w-6 h-6 text-gray-400" />
                                                            </DropdownMenu.Trigger>
                                                            <DropdownMenu.Content variant="soft" color="gray">
                                                                <DropdownMenu.Item onSelect={() => { setSelectedId(file.id); setFileItem(file); setOpenEdit(true); }}>
                                                                    <div className="flex flex-row gap-5 items-center justify-between">
                                                                        <PencilIcon className="w-3 h-3" />
                                                                        <span className="font-medium">แก้ไข</span>
                                                                    </div>
                                                                </DropdownMenu.Item>
                                                                <DropdownMenu.Separator />
                                                                <DropdownMenu.Item color="red" onSelect={() => { setSelectedId(file.id); setFileItem(file); setOpen(true); }}>
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

                                        )
                                    })
                                )
                                }
                            </>
                        )}
                    </Flex>
                </Flex>
            </div>

            {/* Delete Dialog */}
            <Dialog.Root open={open} onOpenChange={setOpen}>
                <Dialog.Content maxWidth="450px">
                    <Dialog.Title>
                        <div className="font-semibold font-sukhumvit">
                            คุณแน่ใจว่าต้องการลบไฟล์นี้หรือไม่?
                        </div>
                    </Dialog.Title>
                    <Dialog.Description>
                        <div className="font-medium font-sukhumvit">
                            หากคุณลบไฟล์นี้ จะไม่สามารถกู้คืนได้
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
                            <button onClick={handleDeleteClick} className="w-16 h-8 bg-blue-600 text-white rounded-md hover:bg-blue-700 items-center flex justify-center">
                                {deleteLoading ? <Spinner size="2" /> : <span className={"font-semibold font-sukhumvit"}>ตกลง</span>}
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
                            แก้ไขชื่อไฟล์
                        </div>
                    </Dialog.Title>
                    <Flex direction="column" gap="3">
                        <label>
                            <Text as="div" size="2" mb="1" weight="bold">
                                ชื่อไฟล์
                            </Text>
                            <input
                                className="w-full p-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="กรอกชื่อไฟล์ใหม่ ไม่ต้องใส่ .png หรือ . อื่นๆ"
                                value={newFilename}
                                onChange={handleFilenameChange}
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
                            <button onClick={handleUpdateClick} className="w-16 h-8 bg-blue-600 text-white rounded-md hover:bg-blue-700 items-center flex justify-center">
                                {updateLoading ? <Spinner size="2" /> : <span className={"font-semibold font-sukhumvit"}>ตกลง</span>}
                            </button>
                        </Dialog.Close>
                    </Flex>
                </Dialog.Content>
            </Dialog.Root>


            {/* Image Gallery Dialog */}
            <CustomGalleryModal
                isOpen={isGalleryOpen}
                onClose={onClose}
                imageFiles={imageFiles}
                currentIndex={currentImageIndex}
            />


            {isPDFOpen && selectedFile && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
                    onClick={() => setIsPDFOpen(false)}
                >
                    <div
                        className="relative max-w-[50%] max-h-[95vh] bg-black rounded-lg overflow-hidden shadow-lg"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className=" overflow-hidden flex justify-center items-center">
                            <PDFViewer fileId={selectedFile ?? ""} accessToken={session?.access_token ?? ""} refreshToken={session?.refresh_token ?? ""} />
                        </div>
                    </div>

                    <svg class="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    </svg>
                </div>
            )}
        </FoldersContainer>
    );
}
