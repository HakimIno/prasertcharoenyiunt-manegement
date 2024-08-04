import { StateUpdater, useState } from 'preact/hooks';
import { LoginContainer } from './Login.styles';
import supabase from '../../../utils/supabase';
import { Button } from '@radix-ui/themes';
export default function Login() {


    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const handleLogin = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) alert(error.message);
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
        <LoginContainer>
            <div className="">
                <form onSubmit={handleLogin} className="max-w-md mx-auto mt-10 p-4 border rounded-md shadow-md">
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
                    <Button
                        type="submit"
                        className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                        Login
                    </Button>
                </form>
            </div>
        </LoginContainer>
    );
}

Login.propTypes = {};

Login.defaultProps = {};