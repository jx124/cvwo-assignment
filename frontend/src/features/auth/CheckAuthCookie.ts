import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../app/hooks';
import { AppDispatch } from '../../app/store';
import { AuthData, AuthStatuses, selectAuthData, selectAuthStatus, setAuthCookie } from './authSlice';

function CheckAuthCookie() {
    const dispatch = useDispatch<AppDispatch>();
    const authData = useAppSelector(selectAuthData);
    const authStatus = useAppSelector(selectAuthStatus);

    console.log("auth data before dispatch: ", authData);

    const containsValidAuthCookie = document.cookie.split(';').some((item) => {
        return item.trim().startsWith('auth=') && item.trim().includes('user')
    })

    if (containsValidAuthCookie && authStatus !== AuthStatuses.LoggedIn) {
        try {
            const decodedCookie = JSON
                .parse(decodeURIComponent(document.cookie.trim().split("auth=")[1])) as AuthData;
                console.log("auth data after dispatch: ", dispatch(setAuthCookie(decodedCookie)));
        } catch {
            
        }

    }
}

export default CheckAuthCookie