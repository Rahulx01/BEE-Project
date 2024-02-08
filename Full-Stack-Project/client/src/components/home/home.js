import React, {useState} from 'react';
import Header from './header/header';
import Login from './login/login';
import Main from './main/main';

export default function Home(props){
    const [showLogin, setShowLogin] = useState(false);
    return (
        <>
            {showLogin && (<Login showLogin={showLogin} setShowLogin={setShowLogin} setUser={props.setUser} setCookie={props.setCookie}/>)}
            <Header showLogin={showLogin} setShowLogin={setShowLogin} user={props.user} setCookie={props.setCookie} setUser={props.setUser}/>
            <Main user={props.user} setUser={props.setUser} setShowLogin={setShowLogin}></Main>
        </>
    )
}