import { useEffect, useState } from 'react';
import supabase from '../utils/supabase';

export const useFetchBranchs = () => {
    const [dataBranchs, setDataBranchs] = useState<{ id: number, branch_name: string }[]>([]);
    const [loading, setLoading] = useState<boolean>(true); // เพิ่มสถานะ loading

    const fetchBranchs = async () => {
        setLoading(true); // เริ่มการโหลด
        const { data, error } = await supabase
            .from('branchs')
            .select('*')
            .order('id', { ascending: true });

        if (error) {
            console.error('Error fetching data from branchs:', error);
        } else {
            setDataBranchs(data);
        }
        setLoading(false); // สิ้นสุดการโหลด
    };

    useEffect(() => {
        fetchBranchs();

        const channel = supabase
            .channel('public:branchs')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'branchs' },
                (payload) => {
                    console.log('Change detected in branchs table:', payload);
                    fetchBranchs(); // Refresh data when a change is detected
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    return { dataBranchs, loading, fetchBranchs }; // ส่งค่า loading กลับไปด้วย
};
