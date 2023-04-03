import React, {useState, useEffect} from "react";
import  "./popup.css";
import axios from "axios";
import {useNavigate } from "react-router-dom";
import { notify } from "./toast";
import { ToastContainer } from "react-toastify";
import Web3 from 'web3';


const Popup = (props) => {

    const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));

    const contractABI = [
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "name": "certificates",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "publicKeyHash",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "certificateHash",
                    "type": "string"
                },
                {
                    "internalType": "bool",
                    "name": "isRevoked",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "publicKeyHash",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "certificateHash",
                    "type": "string"
                }
            ],
            "name": "registerCertificate",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "x",
                    "type": "string"
                },
                {
                    "internalType": "bool",
                    "name": "y",
                    "type": "bool"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ]


    const contractAddress = '0x16267b87e65e9092E4d1fB4748875c03AB6eC685';
    const contract = new web3.eth.Contract(contractABI, contractAddress);

    const navigate = useNavigate();

    const toBytes = (string) => web3.utils.toHex(Buffer.from(string, 'utf8'));

    const [otp, setOtp] = useState('');
    const [focus, setFocus] = useState(0);

    useEffect(() => {
        const inputFields = document.querySelectorAll('.otp-input');
        if(focus < 6 && inputFields) {
            inputFields[focus].focus();
        }
    }, [focus]);

    const handleChange = (e, index) => {
        const value = e.target.value;
        if (value.length === 1) {
            setFocus(index + 1);
        }
        const otpArray = [...otp];
        otpArray[index] = value;
        setOtp(otpArray.join(''));
    };

    const checkData = async (url, data) => {
        const response = await axios.post(`/${url}`, data);
        console.log(response);
        if (response.data[0].status === 1) {
            if(url === 'login')
                navigate('/home');
            if(url === 'signup') {
                notify(`${response.data[0].msg}`, "success")
                navigate('/login');
            }

            const publicKeyHash = response.data[0].public_key_hash;
            const certificateHash = response.data[0].certificate_hash;

            // console.log(publicKeyHash);
            // console.log(certificateHash);

            contract.methods.registerCertificate(publicKeyHash, certificateHash).call().then(result => {
                console.log(result);
            });
        } 
        else {
            notify(`${response.data[0].msg}`, "error");
            props.setverifyEmail(false);
            props.con.current.classList.remove("blur-effect");
            props.toast.current.classList.remove("remove-");
        }
    };

    const handleSubmit = () => {
        if(otp === props.OTP) {
            checkData(props.url, props.data);
        }
        else {
            notify("Incorrect OTP!", "error");
        }
    }

    console.log(props.OTP);
    console.log(props.url);
    const popup = (
        <div className="popup">
            <div className="popup-container">
                <div className="title-">
                    <svg style={{color: "white"}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="50px" width="50px"> <g> <path fill="none" d="M0 0h24v24H0z"></path> <path d="M6 8V7a6 6 0 1 1 12 0v1h2a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h2zm13 2H5v10h14V10zm-8 5.732a2 2 0 1 1 2 0V18h-2v-2.268zM8 8h8V7a4 4 0 1 0-8 0v1z" fill="white"></path> </g> </svg>
                    <h1>Verification</h1>
                </div>
                <div className="msg">
                    <span className="span-">Please enter the code sent to your email</span>
                </div>
                <div className="otp-container">
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                        <input
                            key={i}
                            type="text"
                            className="otp-input"
                            maxLength={1}
                            value={otp[i] || ''}
                            onChange={(e) => handleChange(e, i)}
                            autoComplete="off"
                        />
                    ))}
                </div>
                <div className="footer">   
                    <button className="btn" onClick={handleSubmit}>Confirm OTP</button>
                    <span>Didn't recieve the OTP?  <a className="anchor-">RESEND OTP</a> </span>
                </div>
            </div>
            <ToastContainer />
        </div>
    );

    return (
        popup
    )
};

export default Popup;