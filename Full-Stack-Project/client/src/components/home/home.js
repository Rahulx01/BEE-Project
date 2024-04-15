import React, { useState, useEffect } from "react";
import Header from "./header/header";
import Login from "./login/login";
import Main from "./main/main";

export default function Home(props) {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    try {
      fetch(`${process.env.REACT_APP_API_KEY}/me`, {
        method: "GET",
        credentials: "include",
      })
        .then(async (res) => {
          if (res.ok) {
            res = await res.json();
            setUser({ username: res.username });
          }
          // else console.log(res);
        })
        .catch((err) => {
          console.log("The error is ", err);
        });
    } catch (err) {
      console.log("error ", err);
    }
  }, []);

  return (
    <>
      {showLogin && (
        <Login
          showLogin={showLogin}
          setShowLogin={setShowLogin}
          setUser={setUser}
        />
      )}
      <Header
        showLogin={showLogin}
        setShowLogin={setShowLogin}
        user={user}
        setUser={setUser}
      />
      <div className="container-fluid ">
        <Main user={user} setUser={setUser} setShowLogin={setShowLogin}></Main>
      </div>
    </>
  );
}