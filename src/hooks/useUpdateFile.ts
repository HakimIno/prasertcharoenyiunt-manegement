import { useState } from 'react';
import supabase from "../utils/supabase";

export const useUpdateFile = () => {
    const [loading, setLoading] = useState<boolean>(false);

    const handleUpdateFile = async (id: number, newFilename: string) => {
        setLoading(true); // เริ่มการโหลด

        const { data, error } = await supabase
            .from('files')  // ชื่อตาราง
            .update({ filename: newFilename })  // ข้อมูลที่ต้องการแก้ไข
            .eq('id', id);  // ใช้ 'file_id' แทน 'id'

        if (error) {
            console.error('Error updating filename:', error);
        } else {
            console.log('Filename updated successfully:', data);
        }

        setLoading(false); // สิ้นสุดการโหลด
    };

    return {
        handleUpdateFile,
        loading  // ส่งสถานะการโหลดออกไปให้ใช้งานในคอมโพเนนต์ที่เรียกใช้
    };
};
