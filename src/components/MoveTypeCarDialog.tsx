import { useState, useEffect } from 'react';
import { Dialog, Button, Flex, Spinner } from '@radix-ui/themes';
import supabase from '../utils/supabase';
import toast from 'react-hot-toast';
import { ArrowRightIcon, BuildingOfficeIcon, ExclamationTriangleIcon, FolderIcon } from '@heroicons/react/24/solid';


const useMoveTypeCar = () => {
    const [moving, setMoving] = useState(false);

    const moveTypeCar = async (typeCarId: number, newBranchId: number) => {
        setMoving(true);
        try {
            const { error: typeCarError } = await supabase
                .from('type_cars')
                .update({ branch_id: newBranchId })
                .eq('id', typeCarId);

            if (typeCarError) throw typeCarError;

            const { error: filesError } = await supabase
                .from('files')
                .update({ branch_id: newBranchId })
                .eq('type_car_id', typeCarId);

            if (filesError) throw filesError;

            return { error: null };
        } catch (error) {
            console.error('Error moving type car:', error);
            return { error };
        } finally {
            setMoving(false);
        }
    };

    return { moveTypeCar, moving };
};

// Component สำหรับ Dialog ย้าย TypeCar
interface MoveTypeCarDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    typeCarId: number | null;
    currentBranchId: number;
    currentBranchName: string | null;
    onMoveSuccess: () => void;
    selectedTypeCarName?: string;
}

export const MoveTypeCarDialog: React.FC<MoveTypeCarDialogProps> = ({
    open,
    setOpen,
    typeCarId,
    currentBranchId,
    currentBranchName,
    onMoveSuccess,
    selectedTypeCarName
}) => {
    const [selectedBranch, setSelectedBranch] = useState<number | null>(null);
    const [branches, setBranches] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { moveTypeCar, moving } = useMoveTypeCar();

    // โหลดข้อมูลสาขาทั้งหมด (ยกเว้นสาขาปัจจุบัน)
    useEffect(() => {
        const fetchBranches = async () => {
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('branchs')
                    .select('id, branch_name')
                    .neq('id', currentBranchId)
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
            setSelectedBranch(null);
        }
    }, [open, currentBranchId]);

    const handleMove = async () => {
        if (!typeCarId || !selectedBranch) {
            toast.error('กรุณาเลือกสาขาที่ต้องการย้ายไป');
            return;
        }

        try {
            const { error } = await moveTypeCar(typeCarId, selectedBranch);

            if (error) {
                throw error;
            }

            toast.success('ย้ายโฟลเดอร์เรียบร้อยแล้ว');
            onMoveSuccess();
            setOpen(false);
        } catch (error) {
            toast.error('เกิดข้อผิดพลาดในการย้ายโฟลเดอร์');
            console.error('Error in handleMove:', error);
        }
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
                {/* Header Section */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-blue-600" />

                <Dialog.Title>
                    <div className="font-sukhumvit flex items-center gap-3 pb-2 mb-4 border-b">
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <ArrowRightIcon className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">ย้ายโฟลเดอร์</h2>
                            <p className="text-sm text-gray-500">ย้ายโฟลเดอร์และไฟล์ทั้งหมดไปยังสาขาอื่น</p>
                        </div>
                    </div>
                </Dialog.Title>

                <div className="space-y-6">
                    {/* Current Location Card */}
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                        <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                            <BuildingOfficeIcon className="w-4 h-4 text-gray-500" />
                            ตำแหน่งปัจจุบัน
                        </h3>
                        <div className="ml-6 space-y-2">
                            <div className="flex items-center gap-2">
                                <FolderIcon className="w-4 h-4 text-yellow-500" />
                                <p className="text-sm text-gray-600">{selectedTypeCarName}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <BuildingOfficeIcon className="w-4 h-4 text-blue-500" />
                                <p className="text-sm text-gray-600">{currentBranchName}</p>
                            </div>
                        </div>
                    </div>

                    {/* Branch Selection */}
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                        <label className="block">
                            <span className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                                <BuildingOfficeIcon className="w-4 h-4 text-gray-500" />
                                เลือกสาขาปลายทาง
                            </span>
                            {loading ? (
                                <div className="flex justify-center py-8">
                                    <Spinner size="3" />
                                </div>
                            ) : (
                                <div className="mt-3">
                                    <select
                                        value={selectedBranch || ''}
                                        onChange={(e: any) => setSelectedBranch(Number(e.target.value))}
                                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                            bg-gray-50 transition-all duration-200 outline-none text-sm"
                                        disabled={moving}
                                    >
                                        <option value="">เลือกสาขาที่ต้องการย้ายไป</option>
                                        {branches.map((branch) => (
                                            <option key={branch.id} value={branch.id}>
                                                {branch.branch_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </label>
                    </div>

                    {/* Warning Message */}
                    <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                        <div className="flex gap-3">
                            <ExclamationTriangleIcon className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-amber-800">
                                    คำเตือนสำหรับการย้ายโฟลเดอร์
                                </p>
                                <p className="text-sm text-amber-700">
                                    การย้ายโฟลเดอร์จะย้ายไฟล์ทั้งหมดในโฟลเดอร์ไปยังสาขาใหม่ด้วย กรุณาตรวจสอบให้แน่ใจก่อนดำเนินการ
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <Flex gap="3" mt="6" justify="end">
                    <Dialog.Close asChild>
                        <Button
                            //@ts-ignore
                            variant="soft"
                            className="px-4 h-9 bg-gray-100 hover:bg-gray-200 transition-colors"
                        >
                            <span className="font-sukhumvit font-medium">ยกเลิก</span>
                        </Button>
                    </Dialog.Close>
                    <button
                        onClick={handleMove}
                        disabled={!selectedBranch || moving || loading}
                        className={`px-6 h-9 rounded-lg flex items-center justify-center gap-2 transition-all duration-200
                            ${(!selectedBranch || moving || loading)
                                ? 'bg-gray-300 cursor-not-allowed'
                                : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'} 
                            text-white font-medium shadow-sm`}
                    >
                        {moving ? (
                            <Spinner size="2" className="text-white" />
                        ) : (
                            <>
                                <ArrowRightIcon className="w-4 h-4" />
                                <span className="font-sukhumvit">ย้ายโฟลเดอร์</span>
                            </>
                        )}
                    </button>
                </Flex>
            </Dialog.Content>
        </Dialog.Root>
    );
};