import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useCookies } from 'react-cookie';

import Home from './components/home/home';

export default function App() {
  const [user, setUser] = useState(null);
  const [cookie, setCookie] = useCookies(null);

  useEffect(() => {
    try {
      fetch('http://localhost:8000/', {
        method: "GET",
        credentials: 'include'
      }).then(async (res) => {
        if (res.ok) {
          res = await res.json();
          setUser(res.user);
        }
      }).catch((err) => {
        console.log("The error is ", err);
      });
    }
    catch (err) {
      console.log("shit error ", err);
    }
  }, []);

  useEffect(() => {
    console.log("WS connection established",user);
  },[user]);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home user={user} setUser={setUser} cookie={cookie} setCookie={setCookie}></Home>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}
