// GLOBAL - imports from npm
// STYLES
import { Text } from '@radix-ui/themes';
import { DashboardContainer } from './Dashboard.styles';

export default function Dashboard() {
    return (
        <DashboardContainer className=" bg-slate-50 w-full h-full justify-center items-center">
            <Text className={"text-xl font-bold "}>อยู่ในระหว่างพัฒนา</Text>
        </DashboardContainer>
    )
}

Dashboard.propTypes = {};

Dashboard.defaultProps = {};