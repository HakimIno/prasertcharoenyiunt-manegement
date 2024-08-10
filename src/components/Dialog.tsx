import { Button, Dialog, Flex, Spinner } from "@radix-ui/themes";
import React, { useRef, useState } from "preact/compat";
import { formatFileSize } from "../utils/formatFileSize";
import { useFileUpload } from "../hooks/useUploadFile";

interface Props {
    trigger: React.ReactNode,
    title: string,
    dataIcon: any
}

const DialogInput = ({ trigger, title, dataIcon }: Props) => {

    const { handleFileChange, file, handleUpload, loading } = useFileUpload();

    const closeDialogRef = useRef<HTMLButtonElement>(null);

    const [inputValue, setInputValue] = useState('');

    const onFileChange = (event: any) => {
        handleFileChange(event);
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setInputValue(`${selectedFile.name}`);
        } else {
            setInputValue('');
        }
    };

    const getIconUrl = (fileName: any) => {
        const fileExtension = fileName.split('.').pop().toLowerCase();
        const matchedIcon = dataIcon.find((item: { type: string; }) => item.type === fileExtension);
        const noIcon = dataIcon.find((item: { type: string; }) => item.type === "file");
        return matchedIcon ? matchedIcon?.icon_url : noIcon?.icon_url;
    };


    const handleSubmit = async () => {
        await handleUpload();
        closeDialogRef.current?.click();
    };


    return (
        <Dialog.Root>
            <Dialog.Trigger>
                {trigger}
            </Dialog.Trigger>

            <Dialog.Content maxWidth="450px">
                <Dialog.Title>{title}</Dialog.Title>
                <Flex direction="column" gap="3">
                    <label>
                        <div className="relative w-full">
                            <input
                                type="text"
                                className="w-full px-3 py-2 mb-1 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                placeholder="เลือกไฟล์..."
                                value={inputValue}
                                readOnly
                            />
                            <input
                                type="file"
                                onChange={onFileChange} // Changed to use the hook's handler
                                className="absolute top-0 right-0 opacity-0 w-full h-full cursor-pointer"
                            />

                            {file?.name && (
                                <img
                                    className={"absolute top-2 left-2"}
                                    style={{ width: '26px', height: '26px' }}
                                    src={getIconUrl(file?.name)}
                                />
                            )}
                            {file?.size && <span className={"text-sm font-medium text-gray-400"}>ขนาดไฟล์: {formatFileSize(file?.size)}</span>}
                        </div>
                    </label>
                    <Flex gap="3" mt="4" justify="end">
                        <Dialog.Close ref={closeDialogRef}>
                            {/* @ts-ignore */}
                            <Button variant="soft" color="gray">
                                ยกเลิก
                            </Button>
                        </Dialog.Close>
                        {/* @ts-ignore */}
                        <button onClick={handleSubmit} loading className="w-16 h-8 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center">
                            {loading ? <Spinner size="3" /> : <span className={"font-semibold"}>ยืนยัน</span>}
                        </button>
                    </Flex>
                </Flex>
            </Dialog.Content>
        </Dialog.Root>
    )
}

export default DialogInput