import { Link } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

import "./NavBar.scss";

const NavBar = () => {
  const { authContext, userLogout } = useContext(AuthContext);
  return (
    <div className="navbarScaffold">
      <Link className="navbar title" to="/">
        <p id="title">Gospel Note</p>
      </Link>
      <div className="userInfo">
        {authContext != null ? (
          <>
            <Link className="navbar register" to="/personal">
              <p id="animate">MyHome</p>
            </Link>
            <p> | </p>
            <button className="logoutBtn" onClick={userLogout}>
              <p id="animate">Logout</p>
            </button>
          </>
        ) : (
          <>
            <Link className="navbar login" to="/login">
              <p id="animate">Login</p>
            </Link>
            <p> | </p>
            <Link className="navbar register" to="/register">
              <p id="animate">Register</p>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default NavBar;
