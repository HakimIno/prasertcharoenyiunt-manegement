
export const formatFileSize = (size: number) => {
    if (size < 1024) return `${size} Bytes`;
    else if (size >= 1024 && size < 1048576) return `${(size / 1024).toFixed(2)} KB`;
    else if (size >= 1048576 && size < 1073741824) return `${(size / 1048576).toFixed(2)} MB`;
    else return `${(size / 1073741824).toFixed(2)} GB`;
};