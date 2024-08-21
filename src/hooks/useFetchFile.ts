import { useState, useEffect } from 'react';
import supabase from '../utils/supabase';

export const useFetchFiles = (searchQuery = '', branchId: number | null, typeCarId: number | null) => {
    const [files, setFiles] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [cachedFiles, setCachedFiles] = useState<any[]>([]);

    const fetchFilesWithIcons = async () => {
        setLoading(true);

        let query = supabase
            .from('files')
            .select(`
                id,
                file_id,
                filename,
                creationdate,
                owner,
                storage_provider,
                file_id,
                branch_id,
                type_car_id,
                icon (
                    id,
                    icon_url
                ),
                branchs (
                    id,
                    branch_name
                ),
                type_cars (
                    id,
                    car_type_name
                )
            `).order('creationdate', { ascending: false });

        // เพิ่มเงื่อนไขสำหรับ branch_id และ type_cars_id
        if (branchId !== null) {
            query = query.eq('branch_id', branchId); // ตรวจสอบว่า column ชื่อ branch_id
        }
        if (typeCarId !== null) {
            query = query.eq('type_car_id', typeCarId); // ตรวจสอบว่า column ชื่อ type_car_id
        }

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching files with icons:', error);
            setLoading(false);
            return;
        }

        let filteredData = data || [];
        if (searchQuery) {
            const searchQueryLower = searchQuery.toLowerCase();
            filteredData = filteredData.filter(file =>
                file.filename.toLowerCase().includes(searchQueryLower)
            );
        }

        setCachedFiles(filteredData);
        setFiles(filteredData);

        setLoading(false);
    };

    useEffect(() => {
        fetchFilesWithIcons();

        const channel = supabase
            .channel('custom-all-channel')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'files' },
                (_payload) => {
                    fetchFilesWithIcons();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [searchQuery, branchId, typeCarId]);

    return { files: loading ? cachedFiles : files, loading, fetchFilesWithIcons, searchQuery };
};
