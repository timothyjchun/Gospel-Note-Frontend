import axios from "axios";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import jwt_decode from "jwt-decode";

const useAxios = () => {
  const { authContext, setAuthTokens, userLogout, baseURL } =
    useContext(AuthContext);
  const nav = useNavigate();

  const abortController = new AbortController();

  const isTokenExpired = (unixTime) => {
    const expTime = dayjs.unix(unixTime);
    const now = dayjs();
    return expTime.diff(now, "second") <= 2;
  };

  const instance = axios.create({
    baseURL: baseURL,
    header: {
      "Content-Type": "application/json",
    },
  });

  instance.interceptors.request.use(async (req) => {
    if (authContext === null) {
      // 아예 authContext 조차 없는 경우 (로그인 조차 안되어 있는 유저)
      nav("/login");
      abortController.abort();
      return abortController.signal;
      // return;
    }
    const accessT = JSON.parse(authContext).access;
    const refreshT = JSON.parse(authContext).refresh;
    const accessTokenExp = jwt_decode(accessT).exp;
    const refreshTokenExp = jwt_decode(refreshT).exp;

    if (isTokenExpired(accessTokenExp)) {
      // access token expired
      if (isTokenExpired(refreshTokenExp)) {
        // refresh token expired -> user came back in a long time
        userLogout();
        abortController.abort();
        return abortController.signal;
        // return;
      } else {
        // refresh token not expired
        // await axios
        //   .post(
        //     `${baseURL}/api/token/refresh/`,
        //     {
        //       refresh: refreshT,
        //     },
        //     {
        //       headers: { "Content-Type": "application/json" },
        //     }
        //   )
        //   .then((res) => {
        //     const jsonData = res.data;
        //     setAuthTokens(JSON.stringify(jsonData));
        //     req.headers["Authorization"] = `Bearer ${jsonData.access}`; //authContext가 그렇게 까지? 빠르게 없데이트가 안되나보다...?
        //     return req;
        //   })
        //   .catch((err) => alert(err));

        const { data } = await axios.post(
          `${baseURL}/api/token/refresh/`,
          {
            refresh: refreshT,
          },
          {
            headers: { "Content-Type": "application/json" },
          }
        ); // problem -> token is blacklisted | 어딘선가 다른 곳에서..
        setAuthTokens(JSON.stringify(data));
        req.headers["Authorization"] = `Bearer ${data.access}`;
        return req;
      }
    }
    req.headers["Authorization"] = `Bearer ${JSON.parse(authContext).access}`;
    return req;
  });

  return instance;
};

export default useAxios;
