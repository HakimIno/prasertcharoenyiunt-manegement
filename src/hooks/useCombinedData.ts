import { useMemo } from 'react';
import { useFetchBranchs } from './useFetchBranchs';
import { useFetchTypeCar } from './useFetchTypeCar';
import { useFetchFiles } from './useFetchFile';

type FolderType = {
    type: 'folder';
    id: number;
    branch_name?: string;
    car_type_name?: string;
    folderName: string;
    type_in: string;
};

// Combined type
type CombinedDataType = FolderType;

export const useCombinedData = (searchQuery = "") => {
    const { dataBranchs } = useFetchBranchs();
    const { dataTypeCarAll } = useFetchTypeCar(null);
    const { files, fetchFilesWithIcons } = useFetchFiles("", null, null);

    //@ts-ignore
    const combinedData: CombinedDataType[] = useMemo(() => {
        const searchQueryLowerCase = searchQuery.toLowerCase();

        // ตรวจสอบว่า `files` ถูกดึงมาอย่างถูกต้อง
        if (!files || files.length === 0) {
            console.log("No files data found");
            return [];
        }

        // กรองไฟล์ตามชื่อไฟล์ที่ตรงกับ searchQuery
        const filteredFiles = files.filter(file =>
            file.filename.toLowerCase().includes(searchQueryLowerCase)
        );

        // ตรวจสอบว่า `filteredFiles` ได้รับค่าถูกต้อง
        if (filteredFiles.length === 0) {
            console.log("No matching files found");
            return [];
        }

        // หาโฟลเดอร์ที่มีไฟล์ที่ตรงกับ searchQuery
        const branchFoldersWithMatchingFiles = dataBranchs
            .filter(branch =>
                filteredFiles.some(file => file.branch_id === branch.id)
            )
            .map(branch => ({
                id: branch.id,
                type: 'folder',
                folderName: branch.branch_name,
                branch_name: branch.branch_name,
                type_in: "branch"
            }));

        const typeCarFoldersWithMatchingFiles = dataTypeCarAll
            .filter(typeCar =>
                filteredFiles.some(file => file.type_car_id === typeCar.id)
            )
            .map(typeCar => {
                // ค้นหา branch ที่เชื่อมโยงกับ typeCar นี้
                const associatedBranch = dataBranchs.find(branch => branch.id === typeCar.branch_id);
                return {
                    id: typeCar.id,
                    type: 'folder',
                    folderName: typeCar.car_type_name,
                    car_type_name: typeCar.car_type_name,
                    branch_name: associatedBranch?.branch_name || "Unknown Branch",
                    type_in: "typeCar",
                    branch_id: associatedBranch?.id
                };
            });

        // รวมผลลัพธ์โฟลเดอร์จากทั้ง Branch และ TypeCar
        const combinedFolders = [...branchFoldersWithMatchingFiles, ...typeCarFoldersWithMatchingFiles];

        // ตรวจสอบว่ามีโฟลเดอร์ที่ตรงกับการค้นหาหรือไม่
        if (combinedFolders.length === 0) {
            console.log("No matching folders found");
            return [];
        }

        // กรองโฟลเดอร์ที่ซ้ำกันออก
        const uniqueFolders = combinedFolders.filter((item, index, self) =>
            index === self.findIndex((t) => (
                t.folderName === item.folderName && t.type === item.type
            ))
        );

        // จัดเรียงผลลัพธ์ตามลำดับที่ต้องการ (โฟลเดอร์)
        uniqueFolders.sort((a, b) => {
            if (a.folderName < b.folderName) return 1;
            if (a.folderName > b.folderName) return -1;
            return 0;
        });

        return uniqueFolders;
    }, [dataBranchs, searchQuery, dataTypeCarAll, files]);

    return {
        combinedData,
        fetchFilesWithIcons,
        searchQuery,
    };
};
