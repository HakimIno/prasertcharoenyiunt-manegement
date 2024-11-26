import { useState, useEffect } from 'react';
import { Dialog, Button, Flex, Spinner } from '@radix-ui/themes';
import { ArrowRightIcon, BuildingOfficeIcon, ExclamationTriangleIcon, DocumentIcon, FolderIcon } from '@heroicons/react/24/solid';
import supabase from '../utils/supabase';
import toast from 'react-hot-toast';

// Types
interface Branch {
    id: number;
    branch_name: string;
}

interface TypeCar {
    id: number;
    car_type_name: string;
    branch_id: number;
}

interface FileDetails {
    id: number;
    filename: string;
    branch_id: number;
    type_car_id: number;
    branchs: {
        id: number;
        branch_name: string;
    };
    type_cars: {
        id: number;
        car_type_name: string;
    };
}


interface MoveFileDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    selectedFile: FileDetails | null;
    onMoveSuccess: () => void;
}

// Custom Hook สำหรับย้ายไฟล์
const useMoveFile = () => {
    const [moving, setMoving] = useState(false);

    const moveFile = async (fileId: number, newBranchId: number, newTypeCarId: number) => {
        setMoving(true);
        try {
            const { error } = await supabase
                .from('files')
                .update({
                    branch_id: newBranchId,
                    type_car_id: newTypeCarId
                })
                .eq('id', fileId);

            if (error) throw error;
            return { error: null };
        } catch (error) {
            console.error('Error moving file:', error);
            return { error };
        } finally {
            setMoving(false);
        }
    };

    return { moveFile, moving };
};

// Main Component
export const MoveFileDialog: React.FC<MoveFileDialogProps> = ({
    open,
    setOpen,
    selectedFile,
    onMoveSuccess
}) => {
    const [selectedBranch, setSelectedBranch] = useState<number | null>(null);
    const [selectedTypeCar, setSelectedTypeCar] = useState<number | null>(null);
    const [isSameBranch, setIsSameBranch] = useState(false);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [typeCars, setTypeCars] = useState<TypeCar[]>([]);
    const [loading, setLoading] = useState(true);
    const { moveFile, moving } = useMoveFile();

    // Reset states เมื่อเปิด dialog
    useEffect(() => {
        if (open && selectedFile) {
            setSelectedBranch(selectedFile.branch_id);
            setSelectedTypeCar(null);
            setIsSameBranch(true);
        }
    }, [open, selectedFile]);

    // โหลดข้อมูลสาขา
    useEffect(() => {
        const fetchBranches = async () => {
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('branchs')
                    .select('id, branch_name')
                    .order('branch_name');

                if (error) throw error;
                setBranches(data || []);
            } catch (error) {
                toast.error('เกิดข้อผิดพลาดในการโหลดข้อมูลสาขา');
                console.error('Error fetching branches:', error);
            } finally {
                setLoading(false);
            }
        };

        if (open) {
            fetchBranches();
        }
    }, [open]);

    // โหลดข้อมูลประเภทรถตามสาขา
    useEffect(() => {
        const fetchTypeCars = async () => {
            if (!selectedBranch) {
                setTypeCars([]);
                return;
            }

            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('type_cars')
                    .select('id, car_type_name')
                    .eq('branch_id', selectedBranch)
                    .neq('id', selectedFile?.type_car_id) // ไม่เอาประเภทรถปัจจุบัน
                    .order('car_type_name');

                if (error) throw error;
                setTypeCars(data || []);
            } catch (error) {
                toast.error('เกิดข้อผิดพลาดในการโหลดข้อมูลประเภทรถ');
                console.error('Error fetching type cars:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTypeCars();
    }, [selectedBranch, selectedFile]);

    const handleMove = async () => {
        if (!selectedFile?.id || !selectedBranch || !selectedTypeCar) {
            toast.error('กรุณาเลือกสาขาและประเภทรถที่ต้องการย้ายไป');
            return;
        }

        try {
            const { error } = await moveFile(selectedFile.id, selectedBranch, selectedTypeCar);

            if (error) throw error;

            toast.success('ย้ายไฟล์เรียบร้อยแล้ว');
            onMoveSuccess();
            setOpen(false);
        } catch (error) {
            toast.error('เกิดข้อผิดพลาดในการย้ายไฟล์');
            console.error('Error moving file:', error);
        }
    };


    // จัดการการเปลี่ยนสาขา
    const handleBranchChange = (branchId: number) => {
        const isSame = branchId === selectedFile?.branch_id;
        setIsSameBranch(isSame);
        setSelectedBranch(branchId);
        setSelectedTypeCar(null);
    };

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Content
                className="relative overflow-hidden"
                style={{
                    maxWidth: "550px",
                    background: "linear-gradient(to bottom, #ffffff, #f8fafc)"
                }}
            >
                {/* ... Header Section ... */}

                <div className="space-y-6">
                    {/* Current Location */}
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                        <h3 className="text-sm font-medium text-gray-900 mb-3">ตำแหน่งปัจจุบัน</h3>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <DocumentIcon className="w-4 h-4 text-gray-500" />
                                <p className="text-sm text-gray-600">{selectedFile?.filename}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <BuildingOfficeIcon className="w-4 h-4 text-blue-500" />
                                <p className="text-sm text-gray-600">{selectedFile?.branchs.branch_name}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <FolderIcon className="w-4 h-4 text-yellow-500" />
                                <p className="text-sm text-gray-600">{selectedFile?.type_cars.car_type_name}</p>
                            </div>
                        </div>
                    </div>

                    {/* Move Options */}
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-4 mb-4">
                            <button
                                onClick={() => setIsSameBranch(true)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
                                    ${isSameBranch
                                        ? 'bg-blue-50 text-blue-600 ring-2 ring-blue-600'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            >
                                ย้ายภายในสาขาเดียวกัน
                            </button>
                            <button
                                onClick={() => setIsSameBranch(false)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
                                    ${!isSameBranch
                                        ? 'bg-blue-50 text-blue-600 ring-2 ring-blue-600'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            >
                                ย้ายไปสาขาอื่น
                            </button>
                        </div>

                        {!isSameBranch && (
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                    เลือกสาขาปลายทาง
                                </label>
                                <select
                                    value={selectedBranch || ''}
                                    onChange={(e) => handleBranchChange(Number(e.target.value))}
                                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 
                                        bg-gray-50 transition-all duration-200 outline-none text-sm"
                                    disabled={moving}
                                >
                                    <option value="">เลือกสาขา</option>
                                    {branches.map((branch) => (
                                        <option
                                            key={branch.id}
                                            value={branch.id}
                                        >
                                            {branch.branch_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Type Car Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                เลือกประเภทรถปลายทาง
                            </label>
                            {loading ? (
                                <div className="flex justify-center py-4">
                                    <Spinner size="3" />
                                </div>
                            ) : (
                                <select
                                    value={selectedTypeCar || ''}
                                    onChange={(e) => setSelectedTypeCar(Number(e.target.value))}
                                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 
                                        bg-gray-50 transition-all duration-200 outline-none text-sm"
                                    disabled={moving}
                                >
                                    <option value="">เลือกประเภทรถ</option>
                                    {typeCars.map((typeCar) => (
                                        <option
                                            key={typeCar.id}
                                            value={typeCar.id}
                                        >
                                            {typeCar.car_type_name}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>
                    </div>

                    {/* Warning Message */}
                    <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                        <div className="flex gap-3">
                            <ExclamationTriangleIcon className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-amber-800">
                                    {isSameBranch
                                        ? 'การย้ายประเภทรถภายในสาขาเดียวกัน'
                                        : 'การย้ายไปสาขาอื่น'}
                                </p>
                                <p className="text-sm text-amber-700">
                                    การย้ายไฟล์จะเปลี่ยนตำแหน่งของไฟล์ในระบบ กรุณาตรวจสอบให้แน่ใจก่อนดำเนินการ
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <Flex gap="3" mt="6" justify="end">
                    <Dialog.Close asChild>
                        <Button variant="soft" color="gray">
                            <span className="font-sukhumvit font-medium">ยกเลิก</span>
                        </Button>
                    </Dialog.Close>
                    <button
                        onClick={handleMove}
                        disabled={!selectedTypeCar || moving || loading}
                        className={`px-6 h-9 rounded-lg flex items-center justify-center gap-2 transition-all duration-200
                            ${(!selectedTypeCar || moving || loading)
                                ? 'bg-gray-300 cursor-not-allowed'
                                : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'} 
                            text-white font-medium shadow-sm`}
                    >
                        {moving ? (
                            <Spinner size="2" className="text-white" />
                        ) : (
                            <>
                                <ArrowRightIcon className="w-4 h-4" />
                                <span className="font-sukhumvit">ย้ายไฟล์</span>
                            </>
                        )}
                    </button>
                </Flex>
            </Dialog.Content>
        </Dialog.Root>
    );
};