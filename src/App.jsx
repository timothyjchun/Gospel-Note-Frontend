import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage/MainPage";
import SelectPage from "./pages/SelectPage/SelectPage";
import IndiNotePage from "./pages/IndiNotePage/IndiNotePage";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import PersonalPage from "./Pages/PersonalPage/PersonalPage";

import { AuthProvier } from "./context/AuthContext";

function App() {
  return (
    <>
      <BrowserRouter>
        <AuthProvier>
          <Routes>
            <Route path="/" element={<MainPage />} exact />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/indi" element={<IndiNotePage />} />
            <Route path="/select" element={<SelectPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/personal" element={<PersonalPage />} />
          </Routes>
        </AuthProvier>
      </BrowserRouter>
    </>
  );
}

export default App;
