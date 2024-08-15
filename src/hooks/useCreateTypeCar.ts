import { useState } from 'react';
import supabase from '../utils/supabase';

export function useCreateTypeCar() {
    const [loading, setLoading] = useState(false);

    const createTypeCar = async (carTypeName: string) => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('type_cars')
                .insert([
                    { car_type_name: carTypeName },
                ]);

            if (error) throw error;

            return data;
        } catch (error) {
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { createTypeCar, loading };
}
