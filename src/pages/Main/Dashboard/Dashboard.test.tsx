// GLOBAL - imports from npm
import { render } from '@testing-library/preact';
import '@testing-library/jest-dom/extend-expect';

// COMPONENTS
import Eslip from './Dashboard';

describe('Eslip integration test', () => {
    it('Should render the Eslip component', () => {
        const { getByText } = render(<Eslip />);
        expect(getByText('Eslip')).toBeInTheDocument();
    });
});