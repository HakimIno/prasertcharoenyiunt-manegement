export interface Icon {
    icon_url: string;
}

export interface User {
    id: number;
    name: string;
    role: string;
};

export type File = {
    id: number;
    filename: string;
    creationdate: string; // หรือ Date ถ้าคุณต้องการใช้ object ของ Date
    owner: string;
    icon: { icon_url: string }[];
    branchs: {
        id: number,
        branch_name: string
    }
};