import React, { useState } from 'react';

export default function Signup(props) {
    const [user, setUser] = useState({
        email: "", uname: "", passwd: ""
    })
    const ProfilePic = 'images/mitr.jpeg';
    function handleInputs(e) {
        setUser({ ...user, [e.target.name]: e.target.value });
    }
    async function register() {
        const { email, uname, passwd } = user;
        fetch(`${process.env.REACT_APP_API_KEY}/register`, {
            method: "POST",
            credentials: "include",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                email, uname, passwd
            })
        }).then((res) => {
            if (res.ok) {
                props.setUser({ username: uname });
                props.setShowLogin(false);
            }
        })
            .catch((err) => {
                console.log("the error occured ", err);
            })

    }

    return (
        <>
            <div className='d-flex'>
                <div className="p-2"><h5 >Sign up</h5></div>
                <div className='btn btn-sml ms-auto p-2' onClick={() => props.setShowLogin(false)}><h4>x</h4></div>
            </div>
            <br></br>
            <form>
                <div className="container">
                    <div className="d-flex flex-column align-items-center">
                        <img className="rounded-circle" src={ProfilePic} alt="Static" style={{ maxWidth: '100%', maxHeight: '200px' }} />
                        <br></br>
                        <div className="input-group mb-3">
                            <input type="file" className="form-control" id="inputGroupFile02" ></input>
                        </div>
                        <br></br>
                    </div>
                </div>
                <div className="mb-3">
                    <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"
                        placeholder="Email"
                        onChange={(e) => handleInputs(e)}
                        name='email'
                        value={user.email}
                    />
                </div>
                <div className="mb-3">
                    <input className="form-control"
                        placeholder="Username"
                        onChange={(e) => handleInputs(e)}
                        name='uname'
                        value={user.uname}
                    />
                </div>
                <div className="mb-3">
                    <input type="password" className="form-control" id="exampleInputPassword1"
                        placeholder='password'
                        onChange={(e) => handleInputs(e)}
                        name='passwd'
                        value={user.passwd}
                    />
                </div>
                <div className='btn btn-primary my-3' onClick={() => register()}> Submit</div>
                <b></b>
            </form>
            <span>Already have Account?<button className='mx-1 btn' onClick={() => { props.forToogle() }}>Login</button></span>
        </>
    )
}