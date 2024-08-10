import { getTokens } from '../utils/getTokens';
import { endpoint } from '../utils/http';
import supabase from '../utils/supabase';

export const useDeleteFile = () => {

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
        try {
            await deleteFileToGoogleDrive(fileId);

            const { data, error } = await supabase
                .from('files')
                .delete()
                .eq('id', id);

            if (error) {
                console.error('Error deleting file from Supabase:', error);
                return false;
            }

            console.log('File deleted successfully from Supabase:', data);
            return true;
        } catch (error) {
            console.error('Error in handleDelete:', error);
            return false;
        }
    };

    return {
        handleDelete,
    };
};
