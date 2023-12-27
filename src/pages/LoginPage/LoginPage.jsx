import "./LoginPage.scss";
import NavBar from "../../components/NavBar";
import { useContext } from "react";
import AuthContext from "../../context/AuthContext";

import { Link } from "react-router-dom";

const LoginPage = () => {
  const { userLogin } = useContext(AuthContext);
  return (
    <>
      <NavBar />
      <div className="LoginPageScaffold">
        <div className="container">
          <form onSubmit={userLogin}>
            <input type="text" name="username" placeholder="아이디" />
            <input type="password" name="password" placeholder="비밀번호" />
            <button type="submit">로그인</button>
            <p>계정이 없으신가요?</p>
            <Link to="/register" id="toRegister">
              계정 만들기 →
            </Link>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
