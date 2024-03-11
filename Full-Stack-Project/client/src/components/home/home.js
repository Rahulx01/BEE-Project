import React, { useState, useEffect } from "react";
import Header from "./header/header";
import Login from "./login/login";
import Main from "./main/main";
import { useCookies } from "react-cookie";
export default function Home(props) {
  const [user, setUser] = useState(null);
  const [cookie, setCookie] = useCookies(null);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    try {
      console.log("This is from home.js", document.cookie);
      fetch("http://localhost:8000/me", {
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
          setCookie={setCookie}
        />
      )}
      <Header
        showLogin={showLogin}
        setShowLogin={setShowLogin}
        user={user}
        setCookie={setCookie}
        setUser={setUser}
      />
      <div className="container-fluid min-vh-100">
        <Main user={user} setUser={setUser} setShowLogin={setShowLogin}></Main>
      </div>
    </>
  );
}
