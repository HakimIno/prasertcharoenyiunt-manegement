export interface Icon {
    icon_url: string;
}

export interface File {
    id: number;
    filename: string;
    opened: string;
    owner: string;
    icon: Icon[];
}

export interface User {
    id: number;
    name: string;
    role: string;
};