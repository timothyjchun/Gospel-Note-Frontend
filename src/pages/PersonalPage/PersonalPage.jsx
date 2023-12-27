import NavBar from "../../components/NavBar";
import DisplayNote from "../../components/DisplayNote";
import { useContext, useState, useEffect } from "react";
import AuthContext from "../../context/AuthContext";
import dayjs from "dayjs";

import "./PersonalPage.scss";
import useAxios from "../../utils/useAxios";

const PersonalPage = () => {
  const { username, name, baseURL } = useContext(AuthContext);

  const [year, setYear] = useState(dayjs().$y);
  const [calendar, setCalendar] = useState([]);
  const [yearOptions, setYearOptions] = useState(() => {
    const arr = [];
    for (let i = dayjs().$y; i > 2020; i--) arr.push(i);
    return arr;
  });
  const [showYearSelect, setShowYearSelect] = useState(false);

  const [userNotes, setUserNotes] = useState([]);
  const [userNoteNum, setUserNoteNum] = useState(0);
  const [displayUserNoteNum, setDisplayUserNoteNum] = useState(0);
  const [displayNotes, setDisplayNotes] = useState([]);
  const [currentPageNum, setCurrentPageNum] = useState(1);

  const api = useAxios();

  // Fetching User Note useEffect
  useEffect(() => {
    const getUserNotes = async () => {
      const response = await api.get(
        `/api/get_usernote/?page=${currentPageNum}`
      );
      const data = await response.data;
      setUserNoteNum(data.count);
      setDisplayUserNoteNum(data.results.length);
      setUserNotes(data.results);
    };
    getUserNotes();

    // console.log(displayNotes.length);
  }, [currentPageNum]);

  // Display User Notes When userNotes Change
  useEffect(() => {
    // console.log(userNotes);
    displayUserNotes();
  }, [userNotes]);

  useEffect(() => {
    fetchProgressCalendar(year);
    setYearOptions(restoreYearOptionsAndRemove(year));
  }, [year]);

  const yearChange = (year) => {
    setYear(year);
  };

  const restoreYearOptionsAndRemove = (year) => {
    let arr = [];
    for (let i = dayjs().$y; i > 2020; i--) {
      arr.push(i);
    }
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === year) {
        arr.splice(i, 1);
      }
    }
    return arr;
  };

  const fetchProgressCalendar = async (year) => {
    const res = await api.get("/api/create_progress_cal/", {
      params: { year: year },
    });
    let data = res.data["calendar"];
    createProgressCalendarGrid(data);
  };

  const createProgressCalendarGrid = (cal) => {
    // 1. frekin state
    // 2. 바로 대입 X new data
    let newCalendar = [[], [], [], [], [], [], []];
    for (let column = 0; column < 53; column++) {
      for (let row = 0; row < 7; row++) {
        let indi_data = cal[row][column];
        if (typeof indi_data === "number")
          newCalendar[row].push(
            <ProgressCalendarIndivisualGrid
              key={((row + 1) * (column + 1) * year).toString()}
              date={false}
              color={"#E4E4E"}
            />
          );
        else {
          newCalendar[row].push(
            <ProgressCalendarIndivisualGrid
              key={((row + 1) * (column + 1) * year).toString()}
              date={indi_data[0]}
              color={indi_data[1]}
              progress={indi_data[2]?.progress_color}
              first_question={indi_data[2]?.first_question}
              second_question={indi_data[2]?.second_question}
              third_question={indi_data[2]?.third_question}
              is_created_on_time={indi_data[2]?.is_created_on_time}
            />
          );
        }
      }
    }
    setCalendar(newCalendar);
  };

  const displayUserNotes = () => {
    let displayArr = [];
    if (displayUserNoteNum < 4) {
      for (let i = 0; i < displayUserNoteNum; i++) {
        displayArr.push(
          <DisplayNote
            generalTitle={userNotes[i].general_title}
            passage={userNotes[i].passage}
            specifcTitle={userNotes[i].specific_title}
            url={userNotes[i].url}
            userNoteId={userNotes[i].id}
          />
        );
      }
    } else {
      for (let i = 0; i < 4; i++) {
        displayArr.push(
          <DisplayNote
            generalTitle={userNotes[i].general_title}
            passage={userNotes[i].passage}
            specifcTitle={userNotes[i].specific_title}
            url={userNotes[i].url}
            userNoteId={userNotes[i].id}
          />
        );
      }
    }
    setDisplayNotes(displayArr);
  };

  return (
    <>
      <NavBar />
      <div
        className="PersonalPageScaffold"
        style={{ height: displayNotes.length > 0 ? "185vh" : "90vh" }}
      >
        <div className="personalInfoScaffold">
          <div className="personalInfo">
            <div className="personalInfoCard name">{name}</div>
            <div className="personalInfoCard id">{username}</div>
            <div className="personalInfoCard yearSelection">
              <button
                className="yearSelect"
                onClick={() => {
                  setShowYearSelect(!showYearSelect);
                }}
              >
                {year}
              </button>
              <div
                className="yearSelectDropdownMenu"
                style={{
                  visibility: showYearSelect ? "visible" : "hidden",
                }}
              >
                {yearOptions.map((year, index) => {
                  return (
                    <button
                      key={index}
                      className="year"
                      onClick={() => {
                        yearChange(year);
                        setShowYearSelect(!showYearSelect);
                      }}
                    >
                      {year}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="progressCalendarContainer">{calendar}</div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignContent: "center",
            visibility: displayNotes.length > 0 ? "visible" : "hidden",
          }}
        >
          <div
            className="personalDisplayNoteScaffold"
            key={currentPageNum.toString()}
          >
            {...displayNotes}
          </div>
          <div
            className="pageNum"
            // style={{
            //   visibility: displayNotes.length > 0 ? "visible" : "hidden",
            // }}
          >
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
                {currentPageNum}
              </button>
            }
            {currentPageNum < Math.ceil(userNoteNum / 4) - 1 ? (
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
            {currentPageNum === Math.ceil(userNoteNum / 4) - 1 ? (
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
            ) : currentPageNum === Math.ceil(userNoteNum / 4) ? (
              <></>
            ) : (
              <>
                ···
                <button
                  onClick={() => {
                    setCurrentPageNum(Math.ceil(userNoteNum / 4));
                  }}
                >
                  {Math.ceil(userNoteNum / 4)}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const ProgressCalendarIndivisualGrid = ({
  date,
  color,
  progress,
  first_question,
  second_question,
  third_question,
  is_created_on_time,
}) => {
  const [progressDaySelect, setProgressDaySelect] = useState(false);
  const [progressColor, setProgressColor] = useState(
    progress ? progress : "29"
  );

  return (
    <div
      onClick={() => {
        setProgressDaySelect(!progressDaySelect);
      }}
      style={{
        width: "20px",
        height: "20px",
        border: "none",
        borderRadius: "3px",
        backgroundColor:
          parseInt(progressColor) % 2 == 0 ? color : color + "29",
        // backgroundColor: color,
      }}
    >
      <div
        onClick={() => {
          setProgressDaySelect(!progressDaySelect);
        }}
        className="showDate"
        style={{
          visibility: progressDaySelect && date && "visible",
          backgroundColor: color + "99",
        }}
      >
        <p>
          {date} {progressColor === "29" ? 0 : progressColor}%
        </p>
        {/* <br /> */}
        <p>
          1.{first_question ? "✅" : "❌"}
          2.{second_question ? "✅" : "❌"}
          3.{third_question ? "✅" : "❌"}
          4.{is_created_on_time ? "✅" : "❌"}
        </p>
      </div>
    </div>
  );
};

export default PersonalPage;
