import React, { useState } from 'react';

export default function Signin(props) {
    const [user, setUser] = useState({
        uname: "", passwd: ""
    })

    function handleInputs(e) {
        setUser({ ...user, [e.target.name]: e.target.value });

    }

    const login = async (e) => {
        const { uname, passwd } = user;
        fetch(`${process.env.REACT_APP_API_KEY}/login`, {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                uname, passwd
            })
        }).then(res => {
            if (res.ok) {
                res.json()
                    .then((data) => {
                        props.setUser({ username: uname });
                        console.log(data.token);
                        props.setCookie('JWtoken', data.token, { path: '/' });
                        props.setShowLogin(false);

                    });
            }
        }).catch((err) => {
            console.log("Shit error occured ", err);
        });
    }

    return (
        <>
            <div className='d-flex'>
                <div className="p-2"><h5 >Log in</h5></div>
                <div className='btn btn-sml ms-auto p-2' onClick={() => props.setShowLogin(false)}><h4>x</h4></div>
            </div>
            <form method='POST'>
                <div className="mb-3">

                    <input className="form-control" id="exampleInputEmail1"
                        placeholder="username, or email"
                        onChange={(e) => handleInputs(e)}
                        name='uname'
                        value={user.uname}
                    />
                    {/* <div id="emailHelp" className="form-text">Enter your username or email to login</div> */}
                </div>
                <div className="mb-3">
                    <input type="password" className="form-control" id="exampleInputPassword1"
                        placeholder='password'
                        onChange={(e) => handleInputs(e)}
                        name='passwd'
                        value={user.passwd}
                    />
                </div>
                <div className='btn btn-primary my-3' onClick={() => login()}> Submit</div>
                {/* <button type="submit" className="btn btn-primary my-3" onClick={() => login()}>Submit</button> */}
                {/* <p>new user?<span className='mx-2 hover'></span></p> */}
                <b></b>

            </form>
            <span>new user?<button className='mx-1 btn' onClick={() => { props.forToogle() }}>Signup</button></span>
        </>
    )
}