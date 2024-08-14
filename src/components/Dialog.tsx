import { Button, Dialog, Flex, Spinner } from "@radix-ui/themes";
import React, { useRef, useState } from "preact/compat";
import { formatFileSize } from "../utils/formatFileSize";
import { useFileUpload } from "../hooks/useUploadFile";
import DropdownSelected from "./DropdownSelected";
import { useFetchBranchs } from "../hooks/useFetchBranchs";
import { useFetchTypeCar } from "../hooks/useFetchTypeCar";

interface Props {
    trigger: React.ReactNode,
    title: string,
}

const DialogInput = ({ trigger, title }: Props) => {

    const { handleFileChange, file, handleUpload, handleSelection, handleSelectionTypeCars, loading } = useFileUpload();

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

    const handleSubmit = async () => {
        await handleUpload();
        closeDialogRef.current?.click();
    };

    const dataBranchs = useFetchBranchs();
    const dataTypeCar = useFetchTypeCar();

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
                            {file?.size && <span className={"text-sm font-medium text-gray-400"}>ขนาดไฟล์: {formatFileSize(file?.size)}</span>}
                        </div>


                    </label>

                    <label>
                        <div className="relative w-full flex flex-row justify-between gap-2">
                            {/* <DropdownSelected
                                options={dataBranchs.map(branch => ({ id: branch.id, name: branch.branch_name }))}
                                onSelect={handleSelection}
                                placeholder="สาขา"
                            /> */}
                            <select
                                id="branch"
                                className="bg-blue-50 border border-blue-600 text-blue-600 font-semibold font-sukhumvit text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                //@ts-ignore
                                onChange={(e) => handleSelection(parseInt(e.target.value))}
                            >
                                <option value="" disabled selected>เลือกสาขา</option>
                                {dataBranchs.map(branch => (
                                    <option key={branch.id} value={branch.id}>
                                        {branch.branch_name}
                                    </option>
                                ))}
                            </select>

                            {/* <DropdownSelected
                                options={dataTypeCar.map(typeCar => ({ id: typeCar.id, name: typeCar.car_type_name }))}
                                onSelect={handleSelectionTypeCars}
                                placeholder="ประเภทรถ"
                            /> */}
                            <select
                                id="type_cars"
                                className="bg-blue-50 border border-blue-600 text-blue-600 font-semibold font-sukhumvit text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                //@ts-ignore
                                onChange={(e) => handleSelectionTypeCars(parseInt(e.target.value))}
                            >
                                <option value="" disabled selected cla>เลือกสาขา</option>
                                {dataTypeCar.map(type_car => (
                                    <option key={type_car.id} value={type_car.id}>
                                        {type_car.car_type_name}
                                    </option>
                                ))}
                            </select>
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