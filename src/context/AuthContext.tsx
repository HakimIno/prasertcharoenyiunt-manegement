import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import supabase from '../utils/supabase';
import { Spinner } from '@radix-ui/themes';

interface AuthContextType {
    user: any;
    role: string | null;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    role: null,
    loading: true,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<any>(null);
    const [role, setRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserRole = async (userId: string) => {
            try {
                const { data, error } = await supabase
                    .from('users')
                    .select('role')
                    .eq('id', userId)
                    .single();

                if (error) {
                    throw new Error(error.message);
                }

                setRole(data?.role ?? null);
            } catch (error) {
                console.error('Error fetching user role:', error);
                setRole(null);
            }
        };

        const getSession = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                const currentUser = session?.user ?? null;
                setUser(currentUser);

                if (currentUser) {
                    await fetchUserRole(currentUser.id);
                }
            } catch (error) {
                console.error('Error fetching session:', error);
            } finally {
                setLoading(false);
            }
        };

        getSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
            const currentUser = session?.user ?? null;
            setUser(currentUser);
            setLoading(true);
            if (currentUser) {
                fetchUserRole(currentUser.id).then(() => setLoading(false));
            } else {
                setRole(null);
                setLoading(false);
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const contextValue = useMemo(() => ({ user, role, loading }), [user, role, loading]);

    return (
        <AuthContext.Provider value={contextValue}>
            {!loading ? children : <LoadingScreen />}
        </AuthContext.Provider>
    );
};

const LoadingScreen: React.FC = () => {
    return (
        <div className="h-screen w-full flex flex-col justify-center items-center gap-2">
            <Spinner size="3" />
            <div className="text-md font-medium">Loading...</div>
        </div>
    );
};

export const useAuth = () => useContext(AuthContext);
