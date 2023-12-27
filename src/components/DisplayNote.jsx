import { Link } from "react-router-dom";

import "./DisplayNote.scss";

const DisplayNote = ({
  generalTitle,
  passage,
  specifcTitle,
  url,
  userNoteId,
}) => {
  return (
    <Link
      className="DisplayNoteScaffold"
      to={
        userNoteId
          ? `/indi/?url=${url}&uNId=${userNoteId}`
          : `/indi/?url=${url}`
      }
    >
      <p>{generalTitle}</p>
      {passage || specifcTitle ? (
        <div className="sub">
          <p className="main"> {specifcTitle}</p>
          <p className="sub">{passage}</p>
        </div>
      ) : (
        <></>
      )}
    </Link>
  );
};

export default DisplayNote;
