import { useState } from 'react';
import supabase from '../utils/supabase';

export const useDeleteTypeCar = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const deleteFilesByTypeCarId = async (typeCarId: number) => {
        const { data, error } = await supabase
            .from('files')
            .delete()
            .eq('type_car_id', typeCarId);

        if (error) {
            console.error('Error deleting files associated with typeCarId:', error);
            throw new Error('Failed to delete files associated with typeCarId');
        }

        return data;
    };

    const deleteTypeCar = async (typeCarId: number) => {
        setLoading(true);
        setError(null);

        try {
            // ลบไฟล์ที่เกี่ยวข้องกับ typeCarId ก่อน
            await deleteFilesByTypeCarId(typeCarId);

            // ลบ typeCar
            const { data, error } = await supabase
                .from('type_cars')
                .delete()
                .eq('id', typeCarId);

            if (error) {
                console.error('Error deleting type car:', error);
                setError('Failed to delete type car');
            }

            setLoading(false);
            return { data, error };
        } catch (err: any) {
            console.error('Error in deleteTypeCar:', err);
            setError('Failed to delete type car and its associated files');
            setLoading(false);
            return { error: err.message };
        }
    };

    return { deleteTypeCar, loading, error };
};
