import { useState } from 'react';
import supabase from "../utils/supabase";

type Response = {
    data: any | null;
    error: string | null;
};

export function useUserManagement() {
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState<string | null>(null);

    const addUser = async (
        email: string,
        password: string,
        firstname: string,
        lastname: string,
        role: string,
        phone: string
    ): Promise<Response | undefined> => {
        setLoading(true);
        try {
            // ส่งลิงก์ยืนยันอีเมลไปยังผู้ใช้
            const { data, error } = await supabase.auth.signUp({ email, password });
            if (error) throw error;

            const user = data.user;

            // ตรวจสอบว่าผู้ใช้ยืนยันอีเมลแล้วหรือยัง
            if (!user?.email_confirmed_at) {
                setNotification('กรุณายืนยันอีเมลของคุณก่อนดำเนินการต่อ');

                // Polling เพื่อตรวจสอบการยืนยันอีเมล
                const checkEmailConfirmed = async () => {
                    const { data: userData, error } = await supabase.auth.getUser();
                    if (error) throw error;

                    if (userData?.user?.email_confirmed_at) {
                        // ผู้ใช้ยืนยันอีเมลแล้ว
                        const { data: insertData, error: insertError } = await supabase.from('users').insert([
                            { id: user?.id, firstname, lastname, role, email, phone }
                        ]);
                        if (insertError) throw insertError;

                        setNotification('เพิ่มผู้ใช้งานสำเร็จ');
                        return { data: insertData, error: null };
                    } else {
                        // ทำ Polling ซ้ำทุก 5 วินาที
                        setTimeout(checkEmailConfirmed, 5000);
                    }
                };

                // เรียกฟังก์ชัน Polling
                checkEmailConfirmed();

                return { data: null, error: 'Email verification required' };
            }

            // ในกรณีที่ยืนยันอีเมลแล้วในทันที
            const { data: insertData, error: insertError } = await supabase.from('users').insert([
                { id: user?.id, firstname, lastname, role, email, phone }
            ]);
            if (insertError) throw insertError;

            setNotification('เพิ่มผู้ใช้งานสำเร็จ');
            return { data: insertData, error: null };

        } catch (error: any) {
            console.error('Error creating user:', error.message);
            return { data: null, error: error.message };
        } finally {
            setLoading(false);
        }
    };

    const editUser = async (
        userId: string,
        updates: Partial<{ firstname: string; lastname: string; role: string; phone: string }>
    ): Promise<Response> => {
        setLoading(true);
        try {
            const { data, error } = await supabase.from('users').update(updates).eq('id', userId);
            if (error) throw error;
            return { data, error: null };
        } catch (error: any) {
            console.error('Error editing user:', error.message);
            return { data: null, error: error.message };
        } finally {
            setLoading(false);
        }
    };

    const deleteUser = async (userId: string): Promise<Response> => {
        setLoading(true);
        try {
            const { error: deleteError } = await supabase.from('users').delete().eq('id', userId);
            if (deleteError) throw deleteError;

            return { data: null, error: null };
        } catch (error: any) {
            console.error('Error deleting user:', error.message);
            return { data: null, error: error.message };
        } finally {
            setLoading(false);
        }
    };

    return {
        addUser,
        editUser,
        deleteUser,
        loading,
        notification
    };
}
