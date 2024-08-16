import { useEffect, useState, useCallback } from 'react';
import supabase from '../../../../utils/supabase';
import { User } from '../../../../types';

interface UseUsersResult {
    users: User[];
    loading: boolean;
    error: string | null;
    fetchUsers: any
}

export const useUsers = (): UseUsersResult => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('users')
                .select('*');

            if (error) {
                throw new Error(error.message);
            }

            setUsers(data || []);
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('An unexpected error occurred');
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    return { users, loading, error, fetchUsers };
};
