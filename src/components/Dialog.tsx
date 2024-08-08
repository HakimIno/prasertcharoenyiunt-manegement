import { Button, Dialog, Flex } from "@radix-ui/themes";
import React, { useState } from "preact/compat";
import { formatFileSize } from "../utils/formatFileSize";

interface Props {
    trigger: React.ReactNode,
    title: string,
    dataIcon: any
}

const DialogInput = ({ trigger, title, dataIcon }: Props) => {

    const [file, setFile] = useState<{ name: string, size: number }>();
    const [inputValue, setInputValue] = useState('');

    const handleFileChange = (event: any) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);
        if (selectedFile) {
            setInputValue(`        ${selectedFile.name}`);
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
                                onChange={handleFileChange}
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
                        <Dialog.Close>
                            <Button variant="soft" color="gray">
                                ยกเลิก
                            </Button>
                        </Dialog.Close>
                        <Button type="submit">
                            ยืนยัน
                        </Button>
                    </Flex>
                </Flex>
            </Dialog.Content>
        </Dialog.Root>
    )
}

export default DialogInput