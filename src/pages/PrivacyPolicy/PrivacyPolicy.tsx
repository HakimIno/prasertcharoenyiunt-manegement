import { useState } from 'react';

type Language = 'th' | 'en';

interface Content {
    title: string;
    intro: string;
    sections: {
        title: string;
        content: string;
    }[];
    companyName: string;
    email: string;
    phone: string;
    items: string[];
    purposes: string[];
}

const PrivacyPolicy = () => {
    // Type the content object
    const content: Record<Language, Content> = {
        th: {
            title: "นโยบายความเป็นส่วนตัว",
            intro: "บริษัทประเสริฐเจริญยนต์ เคารพความเป็นส่วนตัวของคุณ และขอแจ้งนโยบายความเป็นส่วนตัวสำหรับการเก็บรวบรวม, ใช้งาน, และเปิดเผยข้อมูลส่วนบุคคลที่คุณให้แก่เรา ผ่านการใช้แอป ประเสริฐเจริญยนต์ เพื่อให้คุณมั่นใจว่า ข้อมูลที่คุณให้แก่เราจะถูกจัดการอย่างเหมาะสมและปลอดภัย",
            sections: [
                {
                    title: "1. การเก็บข้อมูลส่วนบุคคล",
                    content: "ข้อมูลส่วนบุคคลที่เราทำการเก็บรวบรวมจากผู้ใช้ภายในองค์กร อาจประกอบด้วย:"
                },
                {
                    title: "2. การใช้ข้อมูลส่วนบุคคล",
                    content: "บริษัทใช้ข้อมูลส่วนบุคคลของคุณเพื่อ:"
                },
                {
                    title: "3. การรักษาความปลอดภัยของข้อมูล",
                    content: "บริษัทมีการป้องกันข้อมูลส่วนบุคคลของคุณอย่างเคร่งครัด โดยใช้มาตรการรักษาความปลอดภัยทั้งในเชิงกายภาพและเชิงเทคนิค เพื่อป้องกันการเข้าถึง, การใช้, หรือการเปิดเผยข้อมูลที่ไม่ได้รับอนุญาต"
                },
                {
                    title: "4. การเข้าถึงและแก้ไขข้อมูลส่วนบุคคล",
                    content: "คุณมีสิทธิ์ในการเข้าถึงและแก้ไขข้อมูลส่วนบุคคลของคุณ หากคุณต้องการทำการแก้ไขข้อมูลใด ๆ กรุณาติดต่อเราโดยตรง"
                },
                {
                    title: "5. การเปลี่ยนแปลงนโยบายความเป็นส่วนตัว",
                    content: "บริษัทขอสงวนสิทธิ์ในการเปลี่ยนแปลงนโยบายความเป็นส่วนตัวนี้ตามความเหมาะสม การเปลี่ยนแปลงใด ๆ จะถูกประกาศให้ทราบผ่านทางแอปของเรา"
                },
                {
                    title: "6. การติดต่อเรา",
                    content: "หากคุณมีคำถามหรือต้องการข้อมูลเพิ่มเติมเกี่ยวกับนโยบายความเป็นส่วนตัวนี้ กรุณาติดต่อเราที่:"
                }
            ],
            companyName: "ชื่อบริษัท: ประเสริฐเจริญยนต์",
            email: "อีเมล: prasertjarernyonte@gmail.com",
            phone: "เบอร์โทรศัพท์: 082 923 7369",
            items: ["ชื่อ-นามสกุล", "อีเมล", "เบอร์โทรศัพทร์", "ข้อมูลการเข้าสู่ระบบ (เช่น email และ password)"],
            purposes: ["การจัดการและควบคุมการเข้าถึงระบบภายในองค์กร", "การสื่อสารและติดต่อภายในองค์กร", "การจัดเก็บข้อมูลการใช้งานของแอปเพื่อการปรับปรุงและพัฒนา"]
        },
        en: {
            title: "Privacy Policy",
            intro: "Prasert Charoenyont Co., Ltd. respects your privacy and provides this privacy policy for the collection, use, and disclosure of personal information that you provide to us through the use of the Prasert Charoenyont app, ensuring that the information you provide to us is handled appropriately and securely.",
            sections: [
                {
                    title: "1. Collection of Personal Information",
                    content: "The personal information we collect from users within the organization may include:"
                },
                {
                    title: "2. Use of Personal Information",
                    content: "The company uses your personal information to:"
                },
                {
                    title: "3. Security of Personal Information",
                    content: "The company strictly protects your personal information by employing both physical and technical security measures to prevent unauthorized access, use, or disclosure."
                },
                {
                    title: "4. Access and Correction of Personal Information",
                    content: "You have the right to access and correct your personal information. If you wish to make any corrections, please contact us directly."
                },
                {
                    title: "5. Changes to the Privacy Policy",
                    content: "The company reserves the right to change this privacy policy as appropriate. Any changes will be announced through our app."
                },
                {
                    title: "6. Contact Us",
                    content: "If you have any questions or need further information regarding this privacy policy, please contact us at:"
                }
            ],
            companyName: "Company Name: Prasert Charoenyont Co., Ltd.",
            email: "Email: prasertjarernyonte@gmail.com",
            phone: "Phone: 082 923 7369",
            items: ["Full Name", "Email", "Phone Number", "Login Information (e.g., email and password)"],
            purposes: ["Managing and controlling access to internal systems", "Internal communication and contact", "Storing app usage data for improvement and development"]
        }
    };

    const [language, setLanguage] = useState<Language>('th'); // กำหนดชนิดของ state เป็น Language

    const currentContent = content[language];

    return (
        <div className="bg-gray-50 text-blue-600 min-h-screen p-6">
            <div className="max-w-3xl mx-auto bg-white text-gray-800 p-6 rounded-lg shadow-lg">
                <div className="flex justify-end mb-4">


                    {language === "th" ? (
                        <button
                            className={`px-2 flex  items-center  rounded-lg ${language === 'th' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-blue-600'}`}
                            onClick={() => setLanguage('en')}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m10.5 21 5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 0 1-3.827-5.802" />
                            </svg>
                            ภาษาไทย
                        </button>
                    ) : (
                        <button
                            className={`ml-2 px-2 flex items-center  rounded-lg ${language === 'en' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-blue-600'}`}
                            onClick={() => setLanguage('th')}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m10.5 21 5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 0 1-3.827-5.802" />
                            </svg>
                            English
                        </button>
                    )}

                </div>

                <h1 className="text-xl font-bold mb-4 text-center text-blue-600">{currentContent.title}</h1>

                <p className="mb-4 leading-relaxed text-sm">
                    {currentContent.intro}
                </p>

                {currentContent.sections.map((section, index) => (
                    <div key={index}>
                        <h2 className="text-md font-semibold mb-3">{section.title}</h2>
                        <p className="mb-4 leading-relaxed text-sm">
                            {section.content}
                        </p>
                        {index === 0 && (
                            <ul className="list-disc list-inside text-gray-700 mb-4 pl-4 text-sm">
                                {currentContent.items.map((item, idx) => (
                                    <li key={idx}>{item}</li>
                                ))}
                            </ul>
                        )}
                        {index === 1 && (
                            <ul className="list-disc list-inside text-gray-700 mb-4 pl-4 text-sm">
                                {currentContent.purposes.map((purpose, idx) => (
                                    <li key={idx}>{purpose}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                ))}

                <ul className="list-disc list-inside text-gray-700 mb-4 pl-4 text-sm">
                    <li>{currentContent.companyName}</li>
                    <li>{currentContent.email}</li>
                    <li>{currentContent.phone}</li>
                </ul>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
