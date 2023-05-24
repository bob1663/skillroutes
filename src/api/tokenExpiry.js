import jwtDecode from "jwt-decode";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./token";
import { getFromLocalStorage} from "./tokenStorage";

function checkIsTokenExpiry() {
  const accessToken = getFromLocalStorage('ACCESS_TOKEN');
  const refreshToken = getFromLocalStorage('REFRESH_TOKEN');
  if (!accessToken || !refreshToken) {
    return {
      accessToken: true,
      refreshToken: true,
    };
  }
  const decodedAccess = jwtDecode(accessToken);
  const decodedRefresh = jwtDecode(refreshToken);
  const ACCESS_TOKEN_EXPIRATION_TIME_IN_SECONDS = 15 * 24 * 60 * 60;
  const REFRESH_TOKEN_EXPIRATION_TIME_IN_SECONDS = 30 * 24 * 60 * 60;
  const isExpiredAccess =
    decodedAccess.exp <
    Date.now() / 1000 - ACCESS_TOKEN_EXPIRATION_TIME_IN_SECONDS;
  const isExpiredRefresh =
    decodedRefresh.exp <
    Date.now() / 1000 - REFRESH_TOKEN_EXPIRATION_TIME_IN_SECONDS;
  return {
    accessToken: isExpiredAccess,
    refreshToken: isExpiredRefresh,
  };
}

export default checkIsTokenExpiry;
