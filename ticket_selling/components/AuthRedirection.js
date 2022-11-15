import { useRouter } from 'next/router';
import { server } from '../config';


const AuthRedirection = () => {
    const router = useRouter();
    const publicPages = ['login', 'signup', ''];
    const curPage = router.asPath;

    async function isLoggedIn(callback) {
        const loggedin_user_res = await fetch(`${server}/api/me`)
        const data = await loggedin_user_res.json()
        callback(data && data.email);
    }
    
    isLoggedIn(function (signedIn) {
        console.log('logged in: ' + signedIn)
        if (!signedIn && !publicPages.includes(curPage)) {
            router.push('/login');    
        }
    });
    
}

export default AuthRedirection