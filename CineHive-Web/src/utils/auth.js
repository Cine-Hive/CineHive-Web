import jwt_decode from 'jwt-decode';

export function isTokenExpired(token) {
    try {
        const decoded = jwt_decode(token);
        const currentTime = Date.now() / 1000;
        return decoded.exp < currentTime;
    } catch (e) {
        return true;
    }
}
