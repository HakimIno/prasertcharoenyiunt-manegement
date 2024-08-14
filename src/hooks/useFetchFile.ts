import { useState, useEffect } from 'react';
import supabase from '../utils/supabase';

export const useFetchFiles = (searchQuery = '') => {
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
                icon (
                    id,
                    icon_url
                ),
                branchs (
                    id,
                    branch_name
                )
            `).order('creationdate', { ascending: false });

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

        setTimeout(() => {
            setLoading(false);
        }, 1000);
    };

    useEffect(() => {
        fetchFilesWithIcons();

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
    }, [searchQuery]);

    return { files: loading ? cachedFiles : files, loading };
};
