import { useState } from 'react';
import emailjs from 'emailjs-com';

export default function Support() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleChange = (e: any) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();

        emailjs.send(
            'YOUR_SERVICE_ID', // Replace with your service ID
            'YOUR_TEMPLATE_ID', // Replace with your template ID
            formData,
            'YOUR_USER_ID' // Replace with your user ID
        ).then((result) => {
            console.log('Email sent successfully:', result.text);
            alert('ข้อความของคุณถูกส่งเรียบร้อยแล้ว!');
        }, (error) => {
            console.error('Failed to send email:', error.text);
            alert('เกิดข้อผิดพลาดในการส่งข้อความ กรุณาลองอีกครั้ง');
        });
    };

    return (
        <div className="flex flex-col h-screen justify-center items-center bg-gray-100 p-4">
            <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-lg">
                <h1 className="text-2xl font-bold mb-4">ติดต่อเรา</h1>
                <p className="mb-4">
                    หากคุณมีคำถามหรือต้องการติดต่อเรา กรุณากรอกแบบฟอร์มด้านล่างนี้ หรือใช้ข้อมูลการติดต่อที่ให้ไว้
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                            ชื่อ
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="ชื่อของคุณ"
                            className="w-full px-3 py-2 border rounded-md"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            อีเมล
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="อีเมลของคุณ"
                            className="w-full px-3 py-2 border rounded-md"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="message">
                            ข้อความ
                        </label>
                        <textarea
                            id="message"
                            name="message"
                            placeholder="พิมพ์ข้อความของคุณที่นี่"
                            className="w-full px-3 py-2 border rounded-md"
                            rows={4}
                            value={formData.message}
                            onChange={handleChange}
                        />
                    </div>

                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    >
                        ส่งข้อความ
                    </button>
                </form>

                <div className="mt-6">
                    <h2 className="text-lg font-bold mb-2">ข้อมูลการติดต่อ</h2>
                    <p>86 ม.14 เมืองคง อำเภอ ราษีไศล ศรีสะเกษ 33160</p>
                    <p>โทรศัพท์: 085 104 5653</p>
                    <p>อีเมล: prasertjarernyonte@gmail.com</p>
                </div>
            </div>
        </div>
    );
}

Support.propTypes = {};

Support.defaultProps = {};
