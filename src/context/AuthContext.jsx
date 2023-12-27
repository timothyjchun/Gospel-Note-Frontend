import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import dayjs from "dayjs";

import { useEffect } from "react";

const AuthContext = createContext();
export default AuthContext;

export const baseURL = "http://127.0.0.1:8000";

export const AuthProvier = ({ children }) => {
  const nav = useNavigate();
  const [authContext, setauthContext] = useState(
    localStorage.getItem("AuthTokens")
      ? localStorage.getItem("AuthTokens")
      : null
  );

  // trying to trigger effect to check if user is coming back after some time
  useEffect(() => {
    if (authContext != null) {
      const refreshToken = JSON.parse(authContext).refresh;
      const refreshTokenExp = jwt_decode(refreshToken).exp;
      const isTokenExpired = (unixTime) => {
        const expTime = dayjs.unix(unixTime);
        const now = dayjs();
        return expTime.diff(now, "second") <= 2;
      };
      isTokenExpired(refreshTokenExp)
        ? userLogout()
        : refreshTokens(refreshToken);
    }
  }, []);

  // 자꾸 black list 된 refresh token이 사용돼서 에러가 난다... 추측하기로는 어쩌다가 (너무 연속적인 refresh token 발급으로) 새로 발급 받은 refresh token이 반영이 안되는것
  // useEffect(() => {
  //   values.authContext = authContext;
  // }, [authContext]);

  // setting authentication tokens to state and localStorage
  const setAuthTokens = (authTokens) => {
    setauthContext(authTokens);
    localStorage.setItem("AuthTokens", authTokens);
  };

  const refreshTokens = async (refreshToken) => {
    const response = await fetch(`${baseURL}/api/token/refresh/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });
    if (response.status === 200) {
      const data = await response.json();
      setAuthTokens(JSON.stringify(data));
    }
  };

  const getAccessToken = (username, password) => {
    fetch(`${baseURL}/api/token/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setAuthTokens(JSON.stringify(data));
        nav("/");
      })
      .catch((err) => {
        alert("아이디 혹은 비밀번호가 틀립니다. 다시 시도하시기 바랍니다."); // 나중에 유저가 존재하는지 안하는지 등도 세분화해서 알려주자.
      });

    // if (response.status === 200) {
    //   const data = await response.json();
    //   setAuthTokens(JSON.stringify(data));
    //   nav("/");
    // } else {
    //   alert("아이디 혹은 비밀번호가 틀립니다. 다시 시도하시기 바랍니다."); // 나중에 유저가 존재하는지 안하는지 등도 세분화해서 알려주자.
    // }
  };

  const userLogin = (e) => {
    e.preventDefault();
    getAccessToken(e.target.username.value, e.target.password.value);
  };

  const userLogout = () => {
    // localStorage에 있으면 get.아니면 없으
    localStorage.removeItem("AuthTokens");
    setauthContext(null);
    nav("/");
  };

  const userRegister = async (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const username = e.target.username.value;
    const password = e.target.password.value;
    const data = {
      name: name,
      username: username,
      password: password,
    };
    // 비밀번호 check
    if (data.password != e.target.passwordCheck.value) {
      alert("비밀번호가 일치하지 않습니다!");
      return;
    }
    // 사용자 생성 API 보내기
    const response = await fetch(`${baseURL}/api/create_user/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    // 로그인 창으로 redirect
    if (response.status === 200) {
      alert("회원가입에 성공하였습니다! 로그인을 진행해주시기 바랍니다");
      nav("/login");
    } else {
      const errMessage = await response.json();
      alert(errMessage.message);
      return;
    }
  };

  let values = {
    authContext: authContext,
    setAuthTokens: setAuthTokens,
    userRegister: userRegister,
    userLogin: userLogin,
    userLogout: userLogout,
    username:
      authContext != null
        ? jwt_decode(JSON.parse(authContext).access).username
        : null,
    name:
      authContext != null
        ? jwt_decode(JSON.parse(authContext).access).name
        : null,
    baseURL: baseURL,
  };
  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};
