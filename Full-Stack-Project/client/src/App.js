import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import Home from './components/home/home';
import Room from './components/room/room';
import { io } from 'socket.io-client';
export default function App() {
  const [user, setUser] = useState(null);
  const [cookie, setCookie] = useCookies(null);
  const [socket, setSocket] = useState(null);
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
  useEffect(() => {
    if(user) {
      const WS_URL = "ws://localhost:9000";
      setSocket(io(WS_URL));
      console.log(socket);
    }
  }, [user])
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home user={user} setUser={setUser} cookie={cookie} setCookie={setCookie}></Home>}></Route>
          <Route path='/room/:id' element={<Room socket={socket}></Room>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}
