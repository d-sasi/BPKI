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
            "outputs": [],
            "stateMutability": "payable",
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
                    "name": "newCertificateHash",
                    "type": "string"
                }
            ],
            "name": "renewCertificate",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "message",
                    "type": "string"
                },
                {
                    "indexed": false,
                    "internalType": "bool",
                    "name": "status",
                    "type": "bool"
                }
            ],
            "name": "response",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "publicKeyHash",
                    "type": "string"
                }
            ],
            "name": "revokeCertificate",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        }
    ]
    
    const contractAddress = '0xdD66F0aDD37dD73f0e5A6A0ecbbB85767807ae03';
    const contract = new web3.eth.Contract(contractABI, contractAddress);

    const navigate = useNavigate();

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

    const sendAttachment = async (data, certificate_id) => {
        const {name, email, ipaddress, domain} = props.data;
        const data_ = {'email': email, 'certificate_id': certificate_id};
        const response = await axios.post('/sendAttachment', data_);
        if(response.data[0].status){
            notify(`${response.data[0].msg}`, "success");
        } 
        else {
            notify("Error! Please try again", "error");
        }
    }

    const checkData = async (url, data) => {
        const response = await axios.post(`/${url}`, data);
        console.log(response);
        if (response.data[0].status === 1) {
            if(url === 'signup') {
                notify(`${response.data[0].msg}`, "success")
                navigate('/login');
            }

            const publicKeyHash = response.data[0].public_key_hash;
            const certificateHash = response.data[0].certificate_hash;

            if(url === "Register") {
                web3.eth.getAccounts().then(accounts => {
                    contract.methods.registerCertificate(publicKeyHash, certificateHash).send({
                        from: accounts[0],
                        value: web3.utils.toWei("0.47", "ether"),
                        gas: 3000000
                    })
                    .on('receipt', function(receipt) {
                        console.log("Transaction receipt: ", receipt);
                        const res = receipt.events.response.returnValues;
                        if(res[1])
                            notify(`${res[0]}`, "success");
                        else
                            notify(`${res[0]}`, "error");
                    })
                    .on('error', function(error) {
                        console.error("Error occurred: ", error);
                        notify("Something went wrong, Please try again!", "error");
                    })
                });
            }

            if(url === "Renew") {
                web3.eth.getAccounts().then(accounts => {
                    contract.methods.renewCertificate(publicKeyHash, certificateHash).send({
                        from: accounts[0],
                        value: web3.utils.toWei("0.03", "ether"),
                        gas: 3000000
                    })
                    .on('receipt', function(receipt) {
                        console.log("Transaction receipt: ", receipt);
                        const res = receipt.events.response.returnValues;
                        if(res[1]) {
                            notify(`${res[0]}`, "success");
                            sendAttachment(props.data, response.data[0].certificate_id);
                        }
                        else
                            notify(`${res[0]}`, "error");
                    })
                    .on('error', function(error) {
                        console.error("Error occurred: ", error);
                        notify("Something went wrong, Please try again!", "error");
                    })
                });
            }

            if(url === "Revoke") {
                web3.eth.getAccounts().then(accounts => {
                    console.log(accounts);
                    contract.methods.revokeCertificate(publicKeyHash).send({
                        from: accounts[0],
                        value: web3.utils.toWei("1.83", "ether"),
                        gas: 3000000
                    })
                    .on('receipt', function(receipt) {
                        console.log("Transaction receipt: ", receipt);
                        const res = receipt.events.response.returnValues;
                        if(res[1])
                            notify(`${res[0]}`, "success");
                        else
                            notify(`${res[0]}`, "error");
                    })
                    .on('error', function(error) {
                        console.error("Error occurred: ", error);
                        notify("Something went wrong, Please try again!", "error");
                    })
                });
            }


        } 
        else {
            notify(`${response.data[0].msg}`, "error");
        }
        props.setverifyEmail(false);
        props.con.current.classList.remove("blur-effect");
        props.toast.current.classList.remove("remove-");
        props.setdata();
    };

    const handleSubmit = () => {
        if(otp === props.OTP) {
            if(props.url != "login")
                checkData(props.url, props.data);
            else {
                navigate('/home');
                props.setverifyEmail(false);
                props.con.current.classList.remove("blur-effect");
                props.toast.current.classList.remove("remove-");
                props.setdata();
            }
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