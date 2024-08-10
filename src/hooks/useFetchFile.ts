import { useState, useEffect } from 'react';
import supabase from '../utils/supabase';
import { File } from '../types';

export const useFetchFiles = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [cachedFiles, setCachedFiles] = useState<File[]>([]);

    const fetchFilesWithIcons = async () => {
        setLoading(true);

        const { data, error } = await supabase
            .from('files')
            .select(`
                id,
                file_id,
                filename,
                creationdate,
                owner,
                icon:icon (
                    icon_url
                )
            `);

        if (error) {
            console.error('Error fetching files with icons:', error);
            setLoading(false);
            return;
        }

        if (data && JSON.stringify(data) !== JSON.stringify(cachedFiles)) {
            setFiles(data);
            setCachedFiles(data);
        }

        setTimeout(() => {
            setLoading(false);
        }, 1000);
    };

    useEffect(() => {
        // ตรวจสอบว่าถ้ามี cachedFiles อยู่แล้วไม่ต้องโหลดใหม่
        if (cachedFiles.length === 0) {
            fetchFilesWithIcons();
        } else {
            setLoading(false);
        }

        const channel = supabase
            .channel('custom-all-channel')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'files' },
                (payload) => {
                    console.log('Change received!', payload);
                    fetchFilesWithIcons();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [cachedFiles]);

    return { files, loading };
};
