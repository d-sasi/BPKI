import React, {useState, useEffect, useRef} from "react";
import axios from "axios";
import styled from "styled-components";
import { notify } from "./toast";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import Popup from "./popup";
import  "./Login.css";

const Login = () => {

    const para = styled.p`
        font-size: 14px;
        font-weight: 100;
        line-height: 20px;
        letter-spacing: 0.5px;
        margin: 20px 0 30px;
    `

    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        confirmpassword: "",
    });
        
    const [Otp, setOtp] = useState("");

    const [url, seturl] = useState("");

    const containerRef = useRef(null);

    const toast_con = useRef(null);

    const [signIn, setSignin] = useState(false);

    const [signUp, setSignup] = useState(false);

    const validate = (event) => {
        event.preventDefault();
        seturl(event.target.id);
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        setOtp(otp);

        const type = event.target.id;

        if(type === "login") {
            setSignin(true);
        }

        let list = 0;
        if(!data.email) {
            notify("Email is Required!", "error")
            list += 1;
        } 
        else if(!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(String(data.email).toLowerCase())) {
           notify("Email address is invalid!", "error")
           list += 1;
        } 

        if (!data.password) {
            notify("Password is Required!", "error")
            list += 1;
        }
        else if (!(data.password.length >= 6)) {
            notify("Password needs to be greater than 6 characters", "error")
            list += 1;
        }
        

        if (type === "signup") {
            setSignup(true);
            if (!data.name.trim()) {
                notify("Username is Required!", "error")
                list += 1;
            }
            if (!data.confirmpassword) {
                notify("Confirm the Password", "error")
                list += 1;
            } 
            else if (!(data.confirmpassword === data.password)) {
                notify("Password's do not match!", "error")
                list += 1;
            }
        }
        return list;
    };

    const sendOtp = async (obj) => {
        const {name, email, password} = obj;
        const data_ = {'email': email, 'OTP': Otp};
        const response = await axios.post('/emailValidation', data_);
        console.log(response.data[0].status);
        if(response.data[0].status){
        } 
        else {
            notify("Error! Please try again", "error");
        }
    }

    const submitHandler = (e) => {
        if(validate(e) === 0) {
            containerRef.current.classList.add("blur-effect");
            toast_con.current.classList.add("remove-");
            sendOtp(data);
            setverifyEmail(true);
        }
    };

    const changeHandler = (event) => {
        setSignup(false);
        setSignin(false);
        setData({ ...data, [event.target.name]: event.target.value });
    };

    const setDataNull = () => {
        setData({
            name: "",
            email: "",
            password: "",
            confirmpassword: "",
        });
    };

    const inputref = useRef(null);

    const signUpButtton = () => {
        setSignin(false);
        setDataNull();
        containerRef.current.classList.add("right-panel-active");
    };

    const signInButtton = () => {
        setSignup(false);
        setDataNull();
        containerRef.current.classList.remove("right-panel-active");
    };

    const [verifyEmail, setverifyEmail] = useState(false);

    const login = (
        <div class="logsin" id="container" ref={containerRef}>
                <div class="form-container sign-in-container">
                    <form className = "submit-form" onSubmit={(e) => submitHandler(e)} id="login">
                        <h1>Sign In</h1>
                        <input type="email" placeholder="Email" value={data.email} onChange={changeHandler} name="email" autoComplete="off"/>
                        <input type="password" placeholder="Password" value={data.password} onChange={changeHandler} name="password" autoComplete="off"/>
                        <a className="anchor">Forgot your password?</a>
                        <button className="btn" id="validate" name="signin">Sign In</button>
                    </form>

                </div>
                <div class="form-container sign-up-container">
                    <form className = "submit-form" onSubmit={(e) => submitHandler(e)} id="signup">
                        <h1>Create Account</h1>
                        <input id="input" type="text" placeholder="Name" name = "name"  value={data.name} onChange={(e) => setData({ ...data, [e.target.name]: e.target.value })} autoComplete="off"/>
                        <input id="input" type="email" placeholder="Email" name = "email" value={data.email} onChange={changeHandler} autoComplete="off"/>
                        <input id="input" type="password" placeholder="Password" name = "password" value={data.password} onChange={changeHandler} autoComplete="off"/>
                        <input id="input" type="password" placeholder="Confirm Password" name="confirmpassword" value={data.confirmpassword} onChange={changeHandler} autoComplete="off"/>
                        <button className="btn" id="validate" name="signUp">Sign Up</button>
                    </form>
                </div>
                
                <div class="overlay-container">
                    <div class="overlay">
                        <div class="overlay-panel overlay-left">
                            <h1>Hello again!</h1>
                            <p className="para"> login into your account </p>
                            <button className="ghost" id="signIn" onClick={signInButtton}>Sign In</button>
                        </div>
                        <div class="overlay-panel overlay-right">
                            <h1>Hello!</h1>
                            <p className="para">Don't have an account?</p>
                            <button className="ghost" id="signUp" onClick={signUpButtton}>Sign Up</button>
                        </div>
                    </div>
                </div>
                <div className="toast-con" ref={toast_con}>
                    <ToastContainer />
                </div>
        </div>
    );

    return (
        <> 
            {login}
            {verifyEmail && <Popup OTP={Otp} data={data} url={url} setverifyEmail={setverifyEmail} con={containerRef} toast={toast_con}/>}
        </>
    );
};

export default Login;