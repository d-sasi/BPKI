import React, {useState, useEffect} from "react";
import  "./ether_popup.css";
import axios from "axios";
import {useNavigate } from "react-router-dom";
import { notify } from "./toast";
import { ToastContainer } from "react-toastify";
import Web3 from 'web3';


const Etherpopup = (props) => {

    const handleSubmit = (e) => {
        if(e.target.id === "1") {
            props.setether(false);
            props.con.current.classList.remove("blur-effect");
            props.toast.current.classList.remove("remove-");
            props.setdata();
        }
        else {
            props.setether(false);
            props.setverifyEmail(true);
        }
    }

    const popup = (
        <div className="popup">
            <div className="popup-container-">
                <div className="-title-">
                    <img src="https://img.icons8.com/color/48/null/ethereum.png" height="100px" width="100px"/>
                </div>
                <div className="-msg-">
                    <span className="-span-">This process charges {props.eth} eth. Proceed to futher steps?</span>
                </div>
                <div className="footer-">   
                    <button className="btn" onClick={(e) => {handleSubmit(e)}} style={{backgroundColor: "#9FA8DA"}} id="1">Cancel</button> 
                    <button className="btn" onClick={(e) => {handleSubmit(e)}} style={{backgroundColor: "#9FA8DA"}} id="2">Confirm</button>
                </div>
            </div>
        </div>
    );

    return (
        popup
    )
};

export default Etherpopup;