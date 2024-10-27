// client/src/Player.js
import React, { useState, useEffect, useMemo } from "react";
import io from "socket.io-client";

const Player = ({ user }) => {
  const apiUrl = process.env.REACT_APP_API_URL;

  const socket = useMemo(() => {
    return io(`${apiUrl}`);
  }, []);

  const [clickCount, setClickCount] = useState(0);
  const [animation, setAnimation] = useState(false);

  const handleBananaClick = () => {
    socket.emit("bananaClick", user._id);
    setAnimation((prev) => !prev);
  };

  useEffect(() => {
    socket.on("updateRanking", ({ userId, clickCount }) => {
      if (userId === user._id) {
        setClickCount(clickCount);
      }
    });
  }, [clickCount, handleBananaClick]);

  useEffect(() => {
    setClickCount(user.clickCount);
  }, [user]);

  return (
    <div className="flex flex-col justify-center items-center">
      <h2 className="text-5xl text-center text-black">Banana Clicker</h2>

      <p className="text-4xl mt-12">
        Your Click Count:{" "}
        <span className="text-purple-800 font-medium">{clickCount}</span>
      </p>
      <img
        src="./banana.jpg"
        alt="banana"
        className={
          animation
            ? "w-4/12 h-4/12 -translate-y-2 scroll-smooth mix-blend-multiply"
            : "w-4/12 h-4/12 translate-y-2 scroll-smooth mix-blend-multiply"
        }
      />
      <button
        onClick={handleBananaClick}
        className="px-16 py-4 mt-4 text-white bg-purple-800 text-4xl text-center rounded-lg "
      >
        🍌 Click Banana
      </button>
    </div>
  );
};

export default Player;
