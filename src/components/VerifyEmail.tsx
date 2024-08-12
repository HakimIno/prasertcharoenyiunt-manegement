import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useEmailVerification } from '../context/EmailVerificationContext';

const VerifyEmail = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token');
    const email = searchParams.get('email');
    const { verifyEmail, isVerifying } = useEmailVerification();

    useEffect(() => {
        console.log("Email and Token:", { email, token }); // ตรวจสอบ email และ token
        if (email && token) {
            verifyEmail(email, token);
        }
    }, [email, token, verifyEmail]);

    return (
        <div>
            <h1>ยืนยันอีเมลของคุณ</h1>
            {isVerifying && <p>กำลังยืนยันอีเมล...</p>}
        </div>
    );
};

export default VerifyEmail;
