import React, { useState } from 'react';
import './login.css';
import Signup from './signup';
import Signin from './signin';

export default function Login(props) {
    const [member, setLogin] = useState(true);

    const memberToogle = () => setLogin(!member);
    return (
        <>
                <div className="login-overlay">
                    <div className="login-form-container">
                        {
                            member ? <Signin setUser={props.setUser} setCookie={props.setCookie} forToogle={memberToogle} setShowLogin={props.setShowLogin}/>
                                : <Signup setUser={props.setUser}  forToogle={memberToogle} setShowLogin={props.setShowLogin} setCookie={props.setCookie}/>
                        }
                    </div>
                </div>
        </>
    )
}