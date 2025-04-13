import jwtDecode from 'jwt-decode';

export const useAuth = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
        const decoded = jwtDecode(token);
        return {
            username: decoded.sub,
        };
    } catch (e) {
        return null;
    }
};