import { useState } from 'react';
import supabase from '../utils/supabase';

export const useDeleteBranch = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const deleteBranch = async (branchId: number) => {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
            .from('branchs')
            .delete()
            .eq('id', branchId);

        if (error) {
            console.error('Error deleting branch:', error);
            setError('Failed to delete branch');
        }

        setLoading(false);
        return { data, error };
    };

    return { deleteBranch, loading, error };
};
