import NavBar from "../../components/NavBar";
import "./IndiNotePage.scss";
import useAxios from "../../utils/useAxios";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import AuthContext from "../../context/AuthContext";

const IndiNotePage = () => {
  const api = useAxios();
  const nav = useNavigate();
  const [url, setUrl] = useState("");
  const [UNID, setUNID] = useState(0);
  const [userNoteData, setUserNoteData] = useState({});
  const location = useLocation();

  const { baseURL, refreshTokens, authContext, isValidAuth } =
    useContext(AuthContext);

  // useEffect(() => {
  //   const getUrl = async () => {
  //     const searchParams = new URLSearchParams(location.search);

  //   };
  //   getUrl();
  // }, []);

  useEffect(() => {
    const getUrlandIndivisualUserNote = async () => {
      const searchParams = new URLSearchParams(location.search);
      if (isValidAuth(authContext)) {
        refreshTokens(JSON.parse(authContext).refresh);
      }
      if (searchParams.get("url")) {
        setUrl(searchParams.get("url"));
      } else {
        const response = await fetch(`${baseURL}/api/recent_gnote/`, {
          method: "GET",
        });
        if (response.status === 200) {
          const data = await response.json();
          setUrl(data.url);
        }
      }
      const uNID = searchParams.get("uNId");
      if (uNID) {
        const response = await api.get(
          `/api/get_indivisual_usernote/?id=${uNID}`
        );
        if (response.status === 401) {
          alert("권한이 없습니다");
          nav(-1);
        } else if (response.status === 200) {
          const data = await response.data;
          setUserNoteData(data);
          setUNID(uNID);
        }
      }
    };
    getUrlandIndivisualUserNote();
  }, []);

  const sendNote = async (e) => {
    e.preventDefault();
    const response = await api.post("/api/save_note/", {
      firstQuestion: e.target.question1.value,
      secondQuestion: e.target.question2.value,
      thirdQuestion: e.target.question3.value,
      url: url,
    });
    if (response.status === 200) {
      alert("성공적으로 복음노트를 저장하였습니다!");
      nav("/");
    } else {
      alert("문제가 생겼습니다.");
    }
  };
  return (
    <>
      <NavBar />
      <div className="IndiNoteScaffold">
        <iframe src={`https://www.youtube.com/embed/${url}`} />

        <form action="" className="questionSection" onSubmit={sendNote}>
          <div className="animation firstquestion">
            <p>1. 하나님은 어떤분이시며 어떤 구원의 역사를 행하십니까?</p>
            <textarea
              name="question1"
              key={UNID}
              defaultValue={userNoteData.first_question}
            ></textarea>
          </div>
          <div className="animation secondquestion">
            <p>2. 나에게 주신 하나님의 말씀은 무엇입니까?</p>
            <textarea
              name="question2"
              key={UNID}
              defaultValue={userNoteData.second_question}
            ></textarea>
          </div>
          <div className="animation thirdquestion">
            <p>3. 감사와 기도</p>
            <textarea
              name="question3"
              key={UNID}
              defaultValue={userNoteData.third_question}
            ></textarea>
          </div>

          <button type="submit">복음노트 저장하기</button>
        </form>
      </div>
    </>
  );
};

export default IndiNotePage;
