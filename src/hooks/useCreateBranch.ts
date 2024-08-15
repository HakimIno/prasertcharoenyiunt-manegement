import { useState } from 'react';
import supabase from '../utils/supabase';


export function useCreateBranch() {
    const [loading, setLoading] = useState(false);

    const createBranch = async (branchName: string) => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('branchs')
                .insert([
                    {
                        branch_name: branchName
                    },
                ]);

            if (error) throw error;

            return data;
        } catch (error) {
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { createBranch, loading };
}
