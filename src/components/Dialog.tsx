import { Badge, Button, Dialog, Flex, Spinner } from "@radix-ui/themes";
import React, { useRef, useState } from "preact/compat";
import { formatFileSize } from "../utils/formatFileSize";
import { useFileUpload } from "../hooks/useUploadFile";
import { XMarkIcon } from "@heroicons/react/24/solid";
import toast, { Toaster } from "react-hot-toast";

interface Props {
    trigger: React.ReactNode;
    title: string;
    branchId: number;   // รับ branchId จาก props
    typeCarId: number;  // รับ typeCarId จาก props
    fetchFilesWithIcons: any
}

const DialogInput = ({ trigger, title, branchId, typeCarId, fetchFilesWithIcons }: Props) => {
    const { files, handleUpload, loading, setFiles } = useFileUpload();
    const closeDialogRef = useRef<HTMLButtonElement>(null);
    const [allFileSize, setAllFileSize] = useState(0)

    const maxFiles = 10;
    const maxFileSize = 10 * 1024 * 1024; // 10 MB in bytes

    const handleRemoveFile = (index: number) => {
        const newFiles = [...files];
        newFiles.splice(index, 1);
        setFiles(newFiles);
    };

    const handleFileSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement; // แคสต์ e.target เป็น HTMLInputElement
        if (target.files) {
            const selectedFiles = Array.from(target.files) as File[];
            const totalSize = selectedFiles.reduce((acc, file) => acc + file.size, 0) + files.reduce((acc, file) => acc + file.size, 0);
            setAllFileSize(totalSize)
            if (files.length + selectedFiles.length > maxFiles) {
                toast.error(`คุณสามารถเลือกไฟล์ได้สูงสุด ${maxFiles} ไฟล์`)
                return;
            }

            if (totalSize > maxFileSize) {
                toast.error("ขนาดไฟล์รวมต้องไม่เกิน 10 MB")
                return;
            }

            setFiles([...files, ...selectedFiles]);
        }
    };


    const handleSubmit = async () => {
        if (files.length > 0) {
            await handleUpload(branchId, typeCarId);
            closeDialogRef.current?.click();
            toast.success("อัปโหลดไฟล์เรียบร้อย")
            fetchFilesWithIcons()
        } else {
            toast.error("กรุณาเลือกไฟล์ก่อนทำการอัปโหลด")
        }
    };

    return (
        <Dialog.Root>
            <Toaster
                position="top-right"
                reverseOrder={false}
            />
            <Dialog.Trigger>
                {trigger}
            </Dialog.Trigger>

            <Dialog.Content maxWidth="600px">
                <Dialog.Title>{title}</Dialog.Title>
                <Flex direction="column" gap="2" style={{ maxHeight: "400px", overflowY: "auto" }}>

                    <label>
                        <Badge color="blue">คุณสามารถเลือกไฟล์ได้สูงสุด 10 ไฟล์ ขนาดไฟล์รวมกันห้ามเกิน 10 MB</Badge>
                    </label>

                    <label>
                        <div className="relative w-full">
                            <input
                                type="text"
                                className="w-full px-3 py-2 mb-1 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                placeholder={files.length === 0 ? "เลือกไฟล์" : "เพิ่มไฟล์อีกไหม"}
                                readOnly
                            />
                            <input
                                type="file"
                                multiple
                                onChange={handleFileSelection} // ใช้ handleFileSelection แทน handleFileChange
                                className="absolute top-0 right-0 opacity-0 w-full h-full cursor-pointer"
                            />
                        </div>
                    </label>

                    {allFileSize !== 0 ? <label >
                        <Badge color="green">{formatFileSize(allFileSize)}</Badge>
                    </label> : null}


                    {files.length > 0 && (
                        <div className="grid grid-cols-3 gap-4 mt-2">
                            {files.map((file, index) => (
                                <div key={index} className="relative border p-2 rounded-md">
                                    {/* ปุ่มลบรูป (x) */}
                                    <button
                                        onClick={() => handleRemoveFile(index)}
                                        className="absolute top-2 right-2 text-white bg-red-500 rounded-full p-1 hover:bg-red-600"
                                    >
                                        <XMarkIcon className={"h-5 w-5"} />
                                    </button>
                                    {file.type.startsWith('image/') && (
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt={file.name}
                                            className="w-full h-32 object-cover rounded-md"
                                        />
                                    )}
                                    <div className="mt-2 text-sm font-medium text-gray-800 break-words">
                                        {file.name}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {formatFileSize(file.size)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <Flex gap="3" mt="4" justify="end">
                        <Dialog.Close ref={closeDialogRef}>
                            {/*@ts-ignore */}
                            <Button variant="soft" color="gray">
                                ยกเลิก
                            </Button>
                        </Dialog.Close>
                        <button
                            onClick={handleSubmit}
                            className="w-16 h-8 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center"
                            disabled={loading} // ป้องกันการคลิกซ้ำขณะอัปโหลด
                        >
                            {loading ? <Spinner size="3" /> : <span className={"font-semibold"}>ยืนยัน</span>}
                        </button>
                    </Flex>
                </Flex>
            </Dialog.Content>
        </Dialog.Root>
    );
}

export default DialogInput;
