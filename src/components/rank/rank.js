import React from "react";

const Rank = ({name, entries}) => {
  return (
    <div>
      <div className="white f2">
        {`${name}, selamat yes kamu sekarang urutan ...`}
      </div>
      <div className="white f1">{entries}</div>
    </div>
  );
};

export default Rank;
