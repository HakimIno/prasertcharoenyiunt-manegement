// GLOBAL - imports from npm
import { render } from '@testing-library/preact';
import '@testing-library/jest-dom/extend-expect';

// COMPONENTS
import Login from './Login';

describe('Login integration test', () => {
    it('Should render the Login component', () => {
        const { getByText } = render(<Login />);
        expect(getByText('LOGIN PAGE')).toBeInTheDocument();
    });
});