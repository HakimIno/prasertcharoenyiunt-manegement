import { useState } from 'react';
import supabase from '../utils/supabase';

export const useUpdateBranch = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const updateBranch = async (branchId: number, branchName: string) => {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
            .from('branchs')
            .update({ branch_name: branchName })
            .eq('id', branchId);

        if (error) {
            console.error('Error updating branch:', error);
            setError('Failed to update branch');
        }

        setLoading(false);
        return { data, error };
    };

    return { updateBranch, loading, error };
};
