// GLOBAL - imports from npm
import { render } from '@testing-library/preact';
import '@testing-library/jest-dom/extend-expect';

// COMPONENTS
import Dashboard from './Dashboard';

describe('Dashboard integration test', () => {
    it('Should render the Dashboard component', () => {
        const { getByText } = render(<Dashboard />);
        expect(getByText('Dashboard')).toBeInTheDocument();
    });
});