import React, { useEffect, useState } from "react";
// import "./Register.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { notify } from "./toast";
import axios from "axios";

const Create = () => {

  const submitHandler = (event) => {
    event.preventDefault();
    
  };

  const [Otp, setOtp] = useState(0);
  const [email, setemail] = useState("");
  const [verifyClicked, setverifyClicked] = useState(false);
  const [btnname, setbtnname] = useState("Verify Email");
  const [userotp, setuserotp] = useState(1);


  const verifyEmail = async (e) => {
    e.preventDefault();
    // console.log(e.target.id === "Verify Email");
    if(e.target.id === "Verify Email") {
      const Otp = Math.floor(100000 + Math.random() * 900000);
      setOtp(Otp);
      const data = {'email': email, 'OTP': Otp}
      const response = await axios.post('/emailValidation', data);
      console.log(response.data[0].status);
      if(response.data[0].status){
          notify("Email sent Successfully, Please check", "success");
          setverifyClicked(true);
      } 
      else {
          notify("Error! Please try again", "error");
      }
    }
    

  }

  const validateOTP = ()=> {
    console.log(Otp);
    console.log(userotp);
    console.log(typeof(userotp));
    console.log(typeof(Otp));
    console.log(userotp == Otp);
    if(userotp == Otp) {
        notify("Valid OTP!", "success");
        setverifyClicked(false);
        setbtnname("submit");
    }
    else 
        notify("Invalid OTP!", "error");
  }

  return (
    <div className="container">
      <form className="Register" onSubmit={submitHandler} autoComplete="off">
        <h2>Register</h2>
        <div className="Reg-">
           <input type="text" placeholder="Unique IP Addrress"/> <br/>
           Which domain do you run?
           <div className="domain">
                <button type="submit">Single Domain</button>
                <button type="submit">Multi- Domain</button>
           </div>
           <input type="email" placeholder="Enter email" onChange = {(e)=>{ setemail(e.target.value);}}/>
            <button type="submit" onClick={verifyEmail} id ={btnname}>{btnname}</button> 
        </div>
        <>
            {
                verifyClicked && 
                <div>
                    <input type="text" placeholder="Enter OTP" onChange={(e)=>{ setuserotp(parseInt(e.target.value));}}/>
                    <button type="submit" onClick={validateOTP}>Check</button>
                </div>
            }
        </>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Create;
