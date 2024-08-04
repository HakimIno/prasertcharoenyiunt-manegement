import { useEffect, useState } from 'react';
import supabase from '../../../../utils/supabase';

// Define a type for user data
interface User {
    id: string;
    email: string;
    // Add other user fields as needed
}

interface UseUsersResult {
    users: User[];
    loading: boolean;
    error: string | null;
}

export const useUsers = (): UseUsersResult => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
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
        };

        fetchUsers();
    }, []);

    return { users, loading, error };
};
