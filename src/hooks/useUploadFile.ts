import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import supabase from '../utils/supabase';
import { getTokens } from '../utils/getTokens';
import { endpoint } from '../utils/http';

export const useFileUpload = () => {
    const [file, setFile] = useState<File | null>(null);
    const [seleteBranch, setSeleteBranch] = useState<number>(1);

    const [loading, setLoading] = useState<boolean>(false);
    const { user } = useAuth();

    const handleSelection = (option: number) => {
        setSeleteBranch(option);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        //@ts-ignore
        setFile(e.target.files?.[0] || null);
    };

    const fetchUserData = async () => {
        const { data: userData, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single();

        if (error) throw new Error('Error fetching user data');
        return userData;
    };

    const fetchIconData = (fileType: string): number => {
        const fileTypeToIconId: Record<string, number> = {
            msword: 1,
            jpeg: 3,
            jpg: 3,
            png: 3,
            mp4: 4,
            pdf: 5,
            'vnd.adobe.photoshop': 6,
            'vnd.openxmlformats-officedocument.spreadsheetml.sheet': 7,
            'vnd.ms-powerpoint': 8,
            'vnd.ms-excel': 9,
        };

        return fileTypeToIconId[fileType] || 11;
    };

    const checkFilenameExists = async (filename: string, owner: string) => {
        try {
            const { data, error } = await supabase
                .from('files')
                .select('filename')
                .eq('filename', filename)
                .eq('owner', owner)
                .single();

            if (error && error.code === 'PGRST116') {
                return false;
            }

            return data !== null;
        } catch (err) {
            console.error('Error checking filename:', err);
            throw new Error('Error checking filename in the database');
        }
    };

    const generateUniqueFilename = async (filename: string, owner: string): Promise<string> => {
        let newFilename = filename;
        let count = 1;

        const fileExtension = filename.substring(filename.lastIndexOf('.'));
        const baseName = filename.substring(0, filename.lastIndexOf('.'));

        try {
            while (await checkFilenameExists(newFilename, owner)) {
                newFilename = `${baseName}(${count})${fileExtension}`;
                count++;
            }
        } catch (err) {
            console.error('Error generating unique filename:', err);
            throw new Error('Error generating unique filename');
        }

        return newFilename;
    };

    const insertFileData = async (
        filename: string,
        owner: string,
        fileType: string,
        iconId: number,
        fileId: string
    ) => {
        try {
            const uniqueFilename = await generateUniqueFilename(filename, owner);

            const { error } = await supabase.from('files').insert([
                {
                    filename: uniqueFilename,
                    owner,
                    type: fileType,
                    creationdate: new Date(),
                    icon_id: iconId,
                    file_id: fileId,
                    branch_id: seleteBranch
                },
            ]);

            if (error) {
                throw new Error('Error inserting file data into database');
            }
        } catch (err) {
            console.error('Error in insertFileData:', err);
            throw new Error('Error inserting file data');
        }
    };

    const uploadFileToGoogleDrive = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file);
        const { accessToken, refreshToken } = await getTokens();

        const response = await endpoint.post('upload', formData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'x-refresh-token': refreshToken,
            },
        });

        return response.data.id; // Assume that the response contains the fileId
    };

    const handleUpload = async () => {
        if (!file) return;

        setLoading(true);

        try {
            const fileId = await uploadFileToGoogleDrive(file);

            if (fileId) {
                const userData = await fetchUserData();
                const iconId = fetchIconData(file.type.split('/')[1]);

                await insertFileData(
                    file.name,
                    `${userData.firstname} ${userData.lastname}`,
                    file.type,
                    iconId,
                    fileId
                );
            }
        } catch (error) {
            console.error('Error during file upload process:', error);
        } finally {
            setLoading(false);
        }
    };

    return {
        file,
        loading,
        handleFileChange,
        handleUpload,
        handleSelection
    };
};
