import React, { createContext, useContext, useState, ReactNode } from 'react';
import supabase from '../utils/supabase';

interface EmailVerificationContextProps {
    verifyEmail: (email: string, token: string) => Promise<void>;
    isVerifying: boolean;
}

const EmailVerificationContext = createContext<EmailVerificationContextProps | undefined>(undefined);

interface EmailVerificationProviderProps {
    children: ReactNode;
}

export const EmailVerificationProvider: React.FC<EmailVerificationProviderProps> = ({ children }) => {
    const [isVerifying, setIsVerifying] = useState<boolean>(false);

    const verifyEmail = async (email: string, token: string) => {
        console.log("Starting email verification", { email, token }); // ตรวจสอบอีเมลและโทเค็น
        setIsVerifying(true);
        try {
            const { error } = await supabase.auth.verifyOtp({
                type: 'signup',
                email: email,
                token: token,
            });

            if (error) {
                console.error('Error verifying email:', error.message);
                alert('การยืนยันอีเมลล้มเหลว');
            } else {
                console.log('Email verified successfully');
                alert('อีเมลได้รับการยืนยันเรียบร้อยแล้ว');
            }
        } catch (error) {
            console.error('Unexpected error:', error);
        } finally {
            setIsVerifying(false);
        }
    };

    return (
        <EmailVerificationContext.Provider value={{ verifyEmail, isVerifying }}>
            {children}
        </EmailVerificationContext.Provider>
    );
};

export const useEmailVerification = (): EmailVerificationContextProps => {
    const context = useContext(EmailVerificationContext);
    if (!context) {
        throw new Error('useEmailVerification must be used within an EmailVerificationProvider');
    }
    return context;
};
