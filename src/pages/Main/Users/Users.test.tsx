// GLOBAL - imports from npm
import { render } from '@testing-library/preact';
import '@testing-library/jest-dom/extend-expect';

// COMPONENTS
import Users from './Users';

describe('Users integration test', () => {
    it('Should render the Users component', () => {
        const { getByText } = render(<Users />);
        expect(getByText('Users')).toBeInTheDocument();
    });
});