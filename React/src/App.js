import Login from "./components/Login"
import Home from "./components/Home";
import R from "./components/R";
import Register from "./components/Register";
import MetaMaskAuth from "./components/metamask-auth";
import {Route, Routes} from "react-router-dom";


function App() {
  return (
    <>  
        <Routes >
          <Route path="/" element= {<MetaMaskAuth onAddressChanged={address => {}}/>} />
          <Route path="/login" element= {<Login />} />
          <Route path="/home" element={<Home />}/>
          <Route path="/Register" element={<Register title="Register"/>}/>
          <Route path="/Renew" element={<R title="Renew" />}/>
          <Route path="/Revoke" element={<R title="Revoke" />}/>
        </Routes> 
      
    </>
  );
}

export default App;
