import React, { useState, useEffect } from "react";

const Nav = ({ socket }) => {
  const [notification, setNotification] = useState("");

  //Listens after a product is added
  useEffect(() => {
    socket.on("addProductResponse", (data) => {
      setNotification(
        `@${data.owner} just added ${data.name} worth $${Number(
          data.price
        ).toLocaleString()}`
      );
    });
  }, [socket]);

  //Listens after a user places a bid
  useEffect(() => {
    socket.on("bidProductResponse", (data) => {
      setNotification(
        `@${data.last_bidder} just bid ${data.name} for $${Number(
          data.userInput
        ).toLocaleString()}`
      );
    });
  }, [socket]);

  return (
    <nav className="navbar">
      <div className="header">
        <h2>Bid Items</h2>
      </div>

      <div>
        <p style={{ color: "red" }}>{notification}</p>
      </div>
    </nav>
  );
};

export default Nav;
