import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import supabase from '../utils/supabase';
import { getTokens } from '../utils/getTokens';
import { endpoint } from '../utils/http';

export const useFileUpload = () => {
    const [files, setFiles] = useState<File[]>([]); // เก็บไฟล์หลายไฟล์ใน array
    const [loading, setLoading] = useState<boolean>(false);
    const { user } = useAuth();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        //@ts-ignore
        if (e.target.files) {
            //@ts-ignore
            setFiles(Array.from(e.target.files));
        }
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
        fileId: string,
        storage_provider: string,
        branchId: number,
        typeCarId: number
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
                    branch_id: branchId,
                    type_car_id: typeCarId,
                    storage_provider
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

    const uploadFileToCloudinary = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'prasert');

        const response = await fetch('https://api.cloudinary.com/v1_1/dkm0oeset/upload', {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();
        return data.public_id; // Assume that the response contains the fileId
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

    const handleUpload = async (branchId: number, typeCarId: number) => {
        if (files.length === 0) return;

        setLoading(true);

        try {
            const userData = await fetchUserData();

            for (let file of files) {
                let fileId;
                const fileType = file.type.split('/')[1];
                let storage_provider = "";

                if (['jpeg', 'jpg', 'png'].includes(fileType)) {
                    fileId = await uploadFileToCloudinary(file);
                    storage_provider = "cloudinary";
                } else {
                    fileId = await uploadFileToGoogleDrive(file);
                    storage_provider = "google_drive";
                }

                if (fileId && storage_provider) {
                    const iconId = fetchIconData(fileType);

                    await insertFileData(
                        file.name,
                        `${userData.firstname} ${userData.lastname}`,
                        file.type,
                        iconId,
                        fileId,
                        storage_provider,
                        branchId,
                        typeCarId
                    );
                }
            }
        } catch (error) {
            console.error('Error during file upload process:', error);
        } finally {
            setLoading(false);
            setFiles([]); // ล้างไฟล์หลังจากอัปโหลดเสร็จ
        }
    };

    return {
        files,
        loading,
        handleFileChange,
        handleUpload,
        setFiles
    };
};
