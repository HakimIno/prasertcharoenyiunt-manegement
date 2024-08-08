import { useEffect, useState } from 'react';
import supabase from '../utils/supabase';

export const useFetchIcons = () => {
    const [dataIcon, setDataIcon] = useState<{ icon_url: string; type: string }[]>([]);

    async function selectAllFromTable(tableName: string) {
        const { data, error } = await supabase
            .from(tableName)
            .select('*');

        if (error) {
            console.error(`Error fetching data from ${tableName}:`, error);
        } else {
            setDataIcon(data);
        }
    }

    useEffect(() => {
        selectAllFromTable("icon");
    }, []);

    return dataIcon;
};
