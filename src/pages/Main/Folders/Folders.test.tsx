// GLOBAL - imports from npm
import { render } from '@testing-library/preact';
import '@testing-library/jest-dom/extend-expect';

// COMPONENTS
import Folders from './Folders';

describe('Folders integration test', () => {
    it('Should render the Folders component', () => {
        const { getByText } = render(<Folders />);
        expect(getByText('Folders')).toBeInTheDocument();
    });
});