import { Spinner } from '@radix-ui/themes';
import { useEffect, useState } from 'preact/hooks';

interface ImageFile {
    id: string;
    file_id: string;
    filename: string;
}

interface CustomGalleryModalProps {
    isOpen: boolean;
    onClose: () => void;
    imageFiles: ImageFile[];
    currentIndex: number;
}

export default function CustomGalleryModal({
    isOpen,
    onClose,
    imageFiles,
    currentIndex,
}: CustomGalleryModalProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setCurrentImageIndex(currentIndex);
        setLoading(true);  // Set loading to true when the modal opens
    }, [currentIndex]);

    const handleNextImage = () => {
        setLoading(true);
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageFiles.length);
    };

    const handlePrevImage = () => {
        setLoading(true);
        setCurrentImageIndex((prevIndex) => (prevIndex - 1 + imageFiles.length) % imageFiles.length);
    };

    const handleImageLoad = () => {
        setLoading(false);  // Set loading to false once the image has loaded
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
            onClick={onClose}  // Close modal when overlay is clicked
        >
            <div
                className="relative w-3/4 max-w-6xl max-h-[70vh] bg-black rounded-lg overflow-hidden shadow-lg"
                onClick={(e) => e.stopPropagation()} // Prevent overlay click when clicking inside the modal
            >
                {/* Close Button */}
                <button onClick={onClose} className="absolute top-4 right-4 p-3 text-white rounded-full bg-white bg-opacity-10">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                        <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                    </svg>
                </button>

                {/* Navigation Buttons */}
                <div className="absolute top-[45%] left-5 right-5 flex justify-between px-4 z-10">
                    <button onClick={handlePrevImage} className="text-white p-3 rounded-full bg-white bg-opacity-10">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                            <path fillRule="evenodd" d="M7.72 12.53a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 1 1 1.06 1.06L9.31 12l6.97 6.97a.75.75 0 1 1-1.06 1.06l-7.5-7.5Z" clipRule="evenodd" />
                        </svg>

                    </button>
                    <button onClick={handleNextImage} className="text-white p-3 rounded-full bg-white bg-opacity-10">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                            <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>

                {/* Image Display */}
                <div className="flex items-center justify-center w-full h-full">
                    {loading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 z-20">
                            <Spinner size={"3"} />
                        </div>
                    )}
                    {imageFiles[currentImageIndex] && imageFiles[currentImageIndex].filename ? (
                        <img
                            src={`https://res.cloudinary.com/dkm0oeset/image/upload/${imageFiles[currentImageIndex].file_id}.${imageFiles[currentImageIndex].filename.split('.').pop()}`}
                            alt="Enlarged view"
                            className="max-w-full max-h-full object-contain"
                            onLoad={handleImageLoad}
                        />
                    ) : (
                        <p className="text-white">No image available</p>
                    )}
                </div>

                {/* Thumbnails */}
                <div className="w-full h-[100px] mt-4 flex justify-center gap-2 overflow-x-auto absolute bottom-0 left-0 p-4 bg-black bg-opacity-75">
                    {imageFiles.map((file, index) => (
                        <img
                            key={file.id}
                            src={`https://res.cloudinary.com/dkm0oeset/image/upload/${file.file_id}.${file.filename.split('.').pop()}`}
                            alt={file.filename}
                            className={`w-20 h-20 object-cover cursor-pointer ${index === currentImageIndex ? 'border-2 border-blue-500' : ''}`}
                            onClick={() => {
                                setLoading(true);
                                setCurrentImageIndex(index);
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
