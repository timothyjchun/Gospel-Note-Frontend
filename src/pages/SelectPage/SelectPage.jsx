import NavBar from "../../components/NavBar";
import DisplayNote from "../../components/DisplayNote";
import "./SelectPage.scss";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/AuthContext";

const SelectPage = () => {
  const [pageNotes, setPageNotes] = useState([{}, {}, {}]);
  const [notesNum, setNotesNum] = useState();
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const [displayNotes, setDisplayNotes] = useState([]);
  const [displayUserNoteNum, setDisplayUserNoteNum] = useState(0);
  const { baseURL } = useContext(AuthContext);

  useEffect(() => {
    const fetchGospelNotes = async () => {
      const response = await fetch(
        `${baseURL}/api/select_gnote/?page=${currentPageNum}`,
        {
          method: "GET",
        }
      );
      const data = await response.json();
      setPageNotes(data.results);
      setDisplayUserNoteNum(data.results.length);
      setNotesNum(data.count);
    };
    fetchGospelNotes();
  }, [currentPageNum]);

  useEffect(() => {
    displayGospelNotes();
  }, [pageNotes]);

  const displayGospelNotes = () => {
    let displayArr = [];
    if (displayUserNoteNum < 3) {
      for (let i = 0; i < displayUserNoteNum; i++) {
        displayArr.push(
          <DisplayNote
            generalTitle={pageNotes[i].general_title}
            passage={pageNotes[i].passage}
            specifcTitle={pageNotes[i].specific_title}
            url={pageNotes[i].url}
          />
        );
      }
    } else {
      for (let i = 0; i < 3; i++) {
        displayArr.push(
          <DisplayNote
            generalTitle={pageNotes[i].general_title}
            passage={pageNotes[i].passage}
            specifcTitle={pageNotes[i].specific_title}
            url={pageNotes[i].url}
          />
        );
      }
    }
    setDisplayNotes(displayArr);
  };

  return (
    <>
      <NavBar />
      <div className="SelectPageScaffold">
        <div
          key={(currentPageNum + 3).toString()}
          style={{
            height: "60vh",
            // border: "solid black 3px",
          }}
        >
          {/* <DisplayNote
            generalTitle={pageNotes[0].general_title}
            passage={pageNotes[0].passage}
            specifcTitle={pageNotes[0].specific_title}
            url={pageNotes[0].url}
          />
        </div>
        <div key={(currentPageNum + 6).toString()}>
          <DisplayNote
            generalTitle={pageNotes[1].general_title}
            passage={pageNotes[1].passage}
            specifcTitle={pageNotes[1].specific_title}
            url={pageNotes[1].url}
          />
        </div>
        <div key={(currentPageNum + 9).toString()}>
          <DisplayNote
            generalTitle={pageNotes[2].general_title}
            passage={pageNotes[2].passage}
            specifcTitle={pageNotes[2].specific_title}
            url={pageNotes[2].url}
          /> */}
          {...displayNotes}
        </div>
        <div className="pageNum">
          {currentPageNum > 1 ? (
            <>
              <button
                onClick={() => {
                  setCurrentPageNum(currentPageNum - 1);
                }}
              >
                {currentPageNum - 1}
              </button>
              ·
            </>
          ) : (
            <></>
          )}
          {
            <button
              onClick={() => {
                setCurrentPageNum(currentPageNum);
              }}
            >
              {currentPageNum}{" "}
            </button>
          }
          {currentPageNum < Math.ceil(notesNum / 3) - 1 ? (
            <>
              ·
              <button
                onClick={() => {
                  setCurrentPageNum(currentPageNum + 1);
                }}
              >
                {currentPageNum + 1}
              </button>
            </>
          ) : (
            <></>
          )}
          {currentPageNum === Math.ceil(notesNum / 3) - 1 ? (
            <>
              ·
              <button
                onClick={() => {
                  setCurrentPageNum(currentPageNum + 1);
                }}
              >
                {currentPageNum + 1}
              </button>
            </>
          ) : currentPageNum === Math.ceil(notesNum / 3) ? (
            <></>
          ) : (
            <>
              ···
              <button
                onClick={() => {
                  setCurrentPageNum(Math.ceil(notesNum / 3));
                }}
              >
                {Math.ceil(notesNum / 3)}
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default SelectPage;
