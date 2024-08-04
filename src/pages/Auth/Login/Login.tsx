import { useState } from 'preact/hooks';
import { LoginContainer } from './Login.styles';
import supabase from '../../../utils/supabase';
import { Spinner } from '@radix-ui/themes';
export default function Login() {


    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        setLoading(false);
        if (error) {
            alert(error.message);
        } else {
            // Handle successful login, e.g., redirect to a different page
        }
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target) {
            //@ts-ignore
            setEmail(e.target.value);
        }
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target) {
            //@ts-ignore
            setPassword(e.target.value);
        }
    };


    return (
        <LoginContainer className="flex items-center justify-center w-screen h-screen">
            <div className="w-full max-w-md">
                <form onSubmit={handleLogin} className="bg-white p-6 rounded-md shadow-md">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email:</label>
                        <input
                            id="email-adress"
                            name="email"
                            type="email"
                            autocomplete="email"
                            required
                            class="w-full text-base px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                            placeholder="mail@gmail.com"
                            onChange={handleEmailChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autocomplete="current-password"
                            required
                            onChange={handlePasswordChange}
                            class="w-full content-center text-base px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                            placeholder="Enter your password"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full  h-10 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center"
                    >
                        {/* @ts-ignore */}
                        {loading ? <Spinner size="3" /> : "Login"}
                    </button>
                </form>
            </div>
        </LoginContainer>
    );
}

Login.propTypes = {};

Login.defaultProps = {};