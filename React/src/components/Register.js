import React, {useState, useEffect, useRef} from "react";
import  "./Register.css";
import MetaMaskAuth from "./metamask-auth";
import { notify } from "./toast";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Popup from "./popup";
import axios from "axios";
import Etherpopup from "./ether_popup";

const Register = (props) => {

    const [verifyEmail, setverifyEmail] = useState(false);

    const [Otp, setOtp] = useState("");

    const [url, seturl] = useState("");

    const containerRef = useRef(null);

    const toast_con = useRef(null);

    const [ether, setether] = useState(false);

    const [data, setData] = useState({
        name: "",
        email: "",
        ipaddress: "",
        domain: "",
    });

    const [selectedButton, setSelectedButton] = useState(null);

    const handleButtonClick = (event) => {
        event.preventDefault();
        setSelectedButton(event.target.id);
    };

    async function checkIfWalletIsConnected() {
        if (window.ethereum) {
            const accounts = await window.ethereum.request({
                method: "eth_accounts",
            });

            if(accounts.length > 0) {
                return 1;
            }
            else {
                return 0;
            }
        }
    }

    const sendOtp = async (obj, otp) => {
        const {name, email, password} = obj;
        const data_ = {'email': email, 'OTP': otp};
        const response = await axios.post('/emailValidation', data_);
        if(response.data[0].status){
        } 
        else {
            notify("Error! Please try again", "error");
        }
    }

    const validate = (event) => {
        event.preventDefault();
        seturl(event.target.id);

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        setOtp(otp);
        sendOtp(data, otp);

        let list = 0;
        if(!data.email) {
            notify("Email is Required!", "error")
            list += 1;
        } 
        else if(!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(String(data.email).toLowerCase())) {
            notify("Email address is invalid!", "error")
            list += 1;
        } 

        if(!data.name) {
            notify("Domain name is required", "error")
            list += 1;
        }

        if(!selectedButton) {
            notify("Domain type is required", "error")
            list += 1;
        }
        else {
            if(selectedButton === "1")
                data.domain = "Single Domain"
            else if(selectedButton === "2")
                data.domain = "Multi Domain"
        }

        if(!data.ipaddress) {
            notify("Domain type is required", "error")
            list += 1;
        }

        return list;
    };

    const submitHandler = (e) => {
        if(validate(e) === 0) {
            checkIfWalletIsConnected().then(value => {
                console.log(value);
                if (value === 1) {
                    containerRef.current.classList.add("blur-effect");
                    toast_con.current.classList.add("remove-");
                    setether(true);
                } 
                else {
                    notify("Wallet is not connected or no Ethereum account is available", "error");
                }
            });
        }
    }

    const setDataNull = () => {
        setData({
            name: "",
            email: "",
            ipaddress: "",
            domain: "",
        });
    };

    const changeHandler = (event) => {
        setData({ ...data, [event.target.name]: event.target.value });
    };

    const Register = (
        <div className="R-container-1" ref={containerRef}>
            <div className="R-title">
                <h1>{props.title}</h1>
            </div>
            <div className="Details">
                <form onSubmit={(e) => {submitHandler(e)}} id={props.title}>
                    <div className="D">
                        <span>Name of the Domain:  </span> 
                        <input type="text" value={data.name} onChange={changeHandler} name="name" autoComplete="off"></input>
                    </div>
                    <div className="D1">
                        <span>Which domain do you run?</span> 
                        <div className="opt">
                            <button id="1"
                                style={selectedButton === '1' ? { backgroundColor: 'lightblue' } : {}}
                                onClick={(e) => handleButtonClick(e)}
                            >
                                Single Domain
                            </button>
                            <button id="2"
                                style={selectedButton === '2' ? { backgroundColor: 'lightblue' } : {}}
                                onClick={(e) => handleButtonClick(e)}
                            >
                                Multi Domain
                            </button>
                        </div>
                    </div>
                    <div className="D">
                        <span>Website's IP address:  </span> 
                        <input type="text" value={data.ipaddress} onChange={changeHandler} name="ipaddress" autoComplete="off"/>
                    </div>
                    <div className="D">
                        <span>Email:  </span> 
                        <input type="email" placeholder="example@gmail.com"  value={data.email} onChange={changeHandler} name="email" autoComplete="off"></input>
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
            {Register}
            <MetaMaskAuth onAddressChanged={address => {}}/>
            {ether && <Etherpopup setether={setether} con={containerRef} toast={toast_con} setverifyEmail = {setverifyEmail} setdata={setDataNull} eth="0.47"/> }
            {verifyEmail && <Popup OTP={Otp} data={data} url={url} setverifyEmail={setverifyEmail} con={containerRef} toast={toast_con} setdata={setDataNull}/>}
        </>
    );
};

export default Register;