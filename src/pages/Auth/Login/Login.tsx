import { LoginContainer } from './Login.styles';
export default function Login() {

    // const [idToken, setIdToken] = useState("");
    // const [displayName, setDisplayName] = useState("");
    // const [userId, setUserId] = useState("");

    // const initLine = () => {
    //     liff.init({ liffId: '2005618139-mAer5ZOK' }, () => {
    //         if (liff.isLoggedIn()) {
    //             runApp();
    //         } else {
    //             liff.login();
    //         }
    //     }, err => console.error(err));
    // }

    // const runApp = () => {
    //     const idToken = liff.getIDToken();
    //     setIdToken(String(idToken));
    //     liff.getProfile().then(profile => {
    //         console.log(profile);
    //         setDisplayName(profile.displayName);
    //         setUserId(profile.userId);
    //     }).catch(err => console.error(err));
    // }



    return <LoginContainer>
        <div className="">
            Login
        </div>

    </LoginContainer>;
}

Login.propTypes = {};

Login.defaultProps = {};