import NavBar from "../../components/NavBar";
import { useState, useEffect, useContext } from "react";
import AuthContext from "../../context/AuthContext";

import "./RegisterPage.scss";

const RegisterPage = () => {
  const [password, setPassword] = useState("");
  const [passwordCheck, setpasswordCheck] = useState();
  const [isCorrect, setisCorrect] = useState(0);

  const { userRegister } = useContext(AuthContext);

  useEffect(() => {
    if (password === passwordCheck) {
      setisCorrect(1);
    } else setisCorrect(0);
  }, [password, passwordCheck]);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handlePasswordCheckChange = (e) => {
    setpasswordCheck(e.target.value);
  };

  return (
    <>
      <NavBar />
      <div className="ResgisterPageScaffold">
        <div className="container">
          <form onSubmit={userRegister}>
            <input type="text" name="name" placeholder="이름" />
            <input type="text" name="username" placeholder="아이디" />
            <input
              type="password"
              name="password"
              placeholder="비밀번호"
              onChange={handlePasswordChange}
            />
            <div className="checkPassword">
              <input
                type="password"
                name="passwordCheck"
                placeholder="비밀번호 확인"
                onChange={handlePasswordCheckChange}
              />

              {isCorrect ? (
                <svg
                  width="28"
                  height="25"
                  viewBox="0 0 28 25"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <line
                    x1="2.12092"
                    y1="11.9586"
                    x2="12.7224"
                    y2="22.1543"
                    stroke="#02C410"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <path
                    d="M13 22L26 2"
                    stroke="#02C410"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              ) : (
                <svg
                  width="23"
                  height="28"
                  viewBox="0 0 23 28"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 2.00098L20.731 25.7269"
                    stroke="#EC0000"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <path
                    d="M2.26855 25.7256L20.9995 1.99956"
                    stroke="#EC0000"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </div>
            <button type="submit">가입완료</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
