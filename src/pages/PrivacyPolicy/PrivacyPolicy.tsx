const PrivacyPolicy = () => {
    return (
        <div className="bg-gray-50 text-blue-600 min-h-screen p-6">
            <div className="max-w-3xl mx-auto bg-white text-gray-800 p-6 rounded-lg shadow-lg">
                <h1 className="text-xl font-bold mb-4 text-center text-blue-600">นโยบายความเป็นส่วนตัว</h1>

                <p className="mb-4 leading-relaxed text-sm">
                    บริษัท<span className="font-semibold">ประเสริฐเจริญยนต์</span> เคารพความเป็นส่วนตัวของคุณ และขอแจ้งนโยบายความเป็นส่วนตัวสำหรับการเก็บรวบรวม, ใช้งาน, และเปิดเผยข้อมูลส่วนบุคคลที่คุณให้แก่เรา ผ่านการใช้แอป <span className="font-semibold">ประเสริฐเจริญยนต์</span> เพื่อให้คุณมั่นใจว่า ข้อมูลที่คุณให้แก่เราจะถูกจัดการอย่างเหมาะสมและปลอดภัย
                </p>

                <h2 className="text-md font-semibold mb-3">1. การเก็บข้อมูลส่วนบุคคล</h2>
                <p className="mb-4 leading-relaxed text-sm">
                    ข้อมูลส่วนบุคคลที่เราทำการเก็บรวบรวมจากผู้ใช้ภายในองค์กร อาจประกอบด้วย:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 pl-4 text-sm">
                    <li>ชื่อ-นามสกุล</li>
                    <li>อีเมล</li>
                    <li>เบอร์โทรศัพทร์</li>
                    <li>ข้อมูลการเข้าสู่ระบบ (เช่น email และ password)</li>
                </ul>

                <h2 className="text-md font-semibold mb-3">2. การใช้ข้อมูลส่วนบุคคล</h2>
                <p className="mb-4 leading-relaxed text-sm">
                    บริษัทใช้ข้อมูลส่วนบุคคลของคุณเพื่อ:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 pl-4 text-sm">
                    <li>การจัดการและควบคุมการเข้าถึงระบบภายในองค์กร</li>
                    <li>การสื่อสารและติดต่อภายในองค์กร</li>
                    <li>การจัดเก็บข้อมูลการใช้งานของแอปเพื่อการปรับปรุงและพัฒนา</li>
                </ul>

                <h2 className="text-md font-semibold mb-3">3. การรักษาความปลอดภัยของข้อมูล</h2>
                <p className="mb-4 leading-relaxed text-sm">
                    บริษัทมีการป้องกันข้อมูลส่วนบุคคลของคุณอย่างเคร่งครัด โดยใช้มาตรการรักษาความปลอดภัยทั้งในเชิงกายภาพและเชิงเทคนิค เพื่อป้องกันการเข้าถึง, การใช้, หรือการเปิดเผยข้อมูลที่ไม่ได้รับอนุญาต
                </p>

                <h2 className="text-md font-semibold mb-3">4. การเข้าถึงและแก้ไขข้อมูลส่วนบุคคล</h2>
                <p className="mb-4 leading-relaxed text-sm">
                    คุณมีสิทธิ์ในการเข้าถึงและแก้ไขข้อมูลส่วนบุคคลของคุณ หากคุณต้องการทำการแก้ไขข้อมูลใด ๆ กรุณาติดต่อเราโดยตรง
                </p>

                <h2 className="text-md font-semibold mb-3">5. การเปลี่ยนแปลงนโยบายความเป็นส่วนตัว</h2>
                <p className="mb-4 leading-relaxed text-sm">
                    บริษัทขอสงวนสิทธิ์ในการเปลี่ยนแปลงนโยบายความเป็นส่วนตัวนี้ตามความเหมาะสม การเปลี่ยนแปลงใด ๆ จะถูกประกาศให้ทราบผ่านทางแอปของเรา
                </p>

                <h2 className="text-md font-semibold mb-3">6. การติดต่อเรา</h2>
                <p className="leading-relaxed text-sm">
                    หากคุณมีคำถามหรือต้องการข้อมูลเพิ่มเติมเกี่ยวกับนโยบายความเป็นส่วนตัวนี้ กรุณาติดต่อเราที่:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 pl-4 text-sm">
                    <li>ชื่อบริษัท: ประเสริฐเจริญยนต์</li>
                    <li>อีเมล: prasertjarernyonte@gmail.com</li>
                    <li>เบอร์โทรศัพท์: 085 104 5653</li>
                </ul>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
