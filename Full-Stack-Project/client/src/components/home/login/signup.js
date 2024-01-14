import React, { useState } from 'react';

export default function Signup(props) {
    const [user, setUser] = useState({
        email: "", uname: "", passwd: ""
    })
    const ProfilePic = 'images/mitr.jpg';
    function handleInputs(e) {
        setUser({ ...user, [e.target.name]: e.target.value });
    }
    // function convertImageToBase64(file) {
    //     return new Promise((resolve, reject) => {
    //         const reader = new FileReader();
    //         reader.onloadend = () => {
    //             if (reader.readyState === 2) {
    //                 resolve(reader.result);
    //             } else {
    //                 reject(new Error('Failed to read the file.'));
    //             }
    //         };
    //         reader.readAsDataURL(file);
    //     });
    // }
    async function register() {
        // var ProfilePic = document.getElementById('inputGroupFile02').files[0];
        // await convertImageToBase64(ProfilePic)
        // .then((imageString) =>{
        //     ProfilePic = imageString;
        // })
        // .catch((error) => {
        //     ProfilePic = null;
        //     console.log("There is error converting image to base64");
        // })
        const { email, uname, passwd } = user;
        fetch("http://localhost:8000/Yudhister", {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                email, uname, passwd
            })
        })
            .then(async (res) => {
                if (res.ok) {
                    res = await res.json();
                    props.setUser(res.user);
                    props.setCookie('JWtoken', res.user.token, { path: '/' });
                    props.setShowLogin(false);
                }
            })
            .catch((err) => {
                console.log("Shit the error occured ", err);
            })

        // const res = await res.json();

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
                        <img className="rounded-circle" src={ProfilePic} alt="Static" />
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