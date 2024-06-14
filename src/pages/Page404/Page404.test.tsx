// GLOBAL - imports from npm
import { render } from '@testing-library/preact';
import '@testing-library/jest-dom/extend-expect';

// COMPONENTS
import Page404 from './Page404';

describe('Page404 integration test', () => {
    it('Should render the Page404 component', () => {
        const { getByText } = render(<Page404 />);
        expect(getByText('PAGE 404')).toBeInTheDocument();
    });
});