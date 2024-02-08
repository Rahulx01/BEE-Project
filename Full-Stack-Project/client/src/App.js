import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useCookies } from 'react-cookie';

import Home from './components/home/home';
import Room from './components/room/room';

export default function App() {
  const [user, setUser] = useState(null);
  const [cookie, setCookie] = useCookies(null);

  useEffect(() => {
    try {
      fetch('http://localhost:8000/me', {
        method: "GET",
        credentials: 'include'
      }).then(async (res) => {
        if (res.ok) {
          res = await res.json();
          setUser({username: res.username});
        }
        // else console.log(res);
      }).catch((err) => {
        console.log("The error is ", err);
      });
    }
    catch (err) {
      console.log("error ", err);
    }
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home user={user} setUser={setUser} cookie={cookie} setCookie={setCookie}></Home>}></Route>
          <Route path='/room/:id' element={<Room></Room>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}
