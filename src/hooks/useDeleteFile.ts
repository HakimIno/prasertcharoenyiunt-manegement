import { useState } from 'react';
import { getTokens } from '../utils/getTokens';
import { endpoint } from '../utils/http';
import supabase from '../utils/supabase';

export const useDeleteFile = () => {
    const [loading, setLoading] = useState(false);

    const deleteFileToGoogleDrive = async (fileId: string) => {
        const { accessToken, refreshToken } = await getTokens();

        const response = await endpoint.delete(
            'delete',
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'x-refresh-token': refreshToken
                },
                data: { fileId }
            }
        );

        if (response.status !== 200) {
            throw new Error(`Failed to delete file from Google Drive: ${response.statusText}`);
        }
    };

    const handleDelete = async (id: number, fileId: string) => {
        setLoading(true);
        try {
            await deleteFileToGoogleDrive(fileId);

            const { data, error } = await supabase
                .from('files')
                .delete()
                .eq('id', id);

            if (error) {
                console.error('Error deleting file from Supabase:', error);
                setLoading(false);
                return false;
            }

            console.log('File deleted successfully from Supabase:', data);
            setLoading(false);
            return true;
        } catch (error) {
            console.error('Error in handleDelete:', error);
            setLoading(false);
            return false;
        }
    };

    return {
        handleDelete,
        loading, // เพิ่ม state loading เพื่อให้คุณสามารถใช้ใน UI ได้
    };
};
