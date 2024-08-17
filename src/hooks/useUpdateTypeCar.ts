import { useState } from 'react';
import supabase from '../utils/supabase';

export const useUpdateTypeCar = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const updateTypeCar = async (typeCarId: number, carTypeName: string) => {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
            .from('type_cars')
            .update({ car_type_name: carTypeName })
            .eq('id', typeCarId);

        if (error) {
            console.error('Error updating type car:', error);
            setError('Failed to update type car');
        }

        setLoading(false);
        return { data, error };
    };

    return { updateTypeCar, loading, error };
};
