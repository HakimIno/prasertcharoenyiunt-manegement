
export default function Page404() {

    return (
        <div className="flex flex-col h-screen justify-center items-center bg-gray-100">
            <div className="flex flex-col items-center">
                <h1 className="text-[120px] font-extrabold text-gray-700">404</h1>
                <p className="text-2xl font-medium text-gray-600 mb-6">Page Not Found</p>
                <p className="text-lg font-normal text-gray-500 mb-6">The page you requested was not found.</p>
                <a href="/user"
                    className="px-4 py-2 font-medium text-white bg-[#AB182C] rounded-md hover:bg-red-900 transition-all duration-200 ease-in-out">
                    กลับหน้าหลัก
                </a>
            </div>
        </div>
    )
}

Page404.propTypes = {};

Page404.defaultProps = {};