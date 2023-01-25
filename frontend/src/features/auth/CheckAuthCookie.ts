import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../app/hooks';
import { AppDispatch } from '../../app/store';
import { AuthData, AuthStatuses, selectAuthStatus, setAuthCookie } from './authSlice';

/**
 * Checks if user has previously logged in before. If so, extract token from cookie and 
 * set authentication state.
 */
function CheckAuthCookie() {
    const dispatch = useDispatch<AppDispatch>();
    const authStatus = useAppSelector(selectAuthStatus);

    const containsValidAuthCookie = document.cookie.split(';').some((item) => {
        return item.trim().startsWith('auth=') && item.trim().includes('user')
    })

    if (containsValidAuthCookie && authStatus !== AuthStatuses.LoggedIn) {
        try {
            const decodedCookie = JSON
                .parse(decodeURIComponent(document.cookie.trim().split("auth=")[1])) as AuthData;
            dispatch(setAuthCookie(decodedCookie));
        } catch {
            
        }

    }
}

export default CheckAuthCookie