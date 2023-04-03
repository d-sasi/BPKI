import React, {useState, useEffect, useRef} from "react";
import  "./R.css";
import { notify } from "./toast";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Popup from "./popup";

const R = (props) => {

    const [verifyEmail, setverifyEmail] = useState(false);

    const [Otp, setOtp] = useState("");

    const [url, seturl] = useState("");

    const containerRef = useRef(null);

    const toast_con = useRef(null);

    const [data, setData] = useState({
        name: "",
        sha_256: "",
        sha_1: "",
        email: ""
    });

    const validate = (event) => {
        event.preventDefault();
        seturl(event.target.id);

        console.log(event);

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        setOtp(otp);

        let list = 0;
        if(!data.email) {
            notify("Email is Required!", "error")
            list += 1;
        } 
        else if(!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(String(data.email).toLowerCase())) {
            notify("Email address is invalid!", "error")
            list += 1;
        } 

        if (!data.sha_256) {
            notify("SHA - 256 is required", "error")
            list += 1;
        }

        if (!data.sha_1) {
            notify("SHA - 1 is required", "error")
            list += 1;
        }
        
        if(!data.name) {
            notify("Domain name is required", "error")
            list += 1;
        }

        return list;
    };

    const submitHandler = (e) => {
        if(validate(e) === 0) {
            containerRef.current.classList.add("blur-effect");
            toast_con.current.classList.add("remove-");
            setverifyEmail(true);
        }
    }

    const changeHandler = (event) => {
        setData({ ...data, [event.target.name]: event.target.value });
    };

    const R = (
        <div className="R-container" ref={containerRef}>
            <div className="R-title">
                <h1>{props.title}</h1>
            </div>
            <div className="Details">
                <form onSubmit={(e) => {submitHandler(e)}} id={props.title}>
                    <div className="D">
                        <span>Name of the Domain:  </span> 
                        <input type="text" onChange={changeHandler} name="name"></input>
                    </div>
                    <div className="D">
                        <span>SHA-256 Key:  </span> 
                        <textarea rows="10" cols="60" onChange={changeHandler} name="sha_256"></textarea>
                    </div>
                    <div className="D">
                        <span>SHA-1 Key:  </span> 
                        <textarea rows="10" cols="60" onChange={changeHandler} name="sha_1"></textarea>
                    </div>
                    <div className="D">
                        <span>Email:  </span> 
                        <input type="email" placeholder="example@gmail.com" onChange={changeHandler} name="email"></input>
                    </div>
                    <div className="btn-con" id = {props.title}>
                        <button>Submit</button>
                    </div>
                </form>
            </div>
            <div ref={toast_con}>
                <ToastContainer />
            </div>
        </div>
        
    );

    return (
        <> 
            {R}
            {verifyEmail && <Popup OTP={Otp} data={data} url={url} setverifyEmail={setverifyEmail} con={containerRef} toast={toast_con}/>}
        </>
    );
};

export default R;