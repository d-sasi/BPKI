import Login from "./components/Login"
import Home from "./components/Home";
import Revoke from "./components/Revke";
import Register from "./components/Register";
import Renew from "./components/Renew";
import {Route, Routes} from "react-router-dom";


function App() {
  return (
    <>  
        <Routes >
          <Route path="/" element= {<Login />} />
          <Route path="/login" element= {<Login />} />
          <Route path="/home" element={<Home />}/>
          <Route path="/Register" element={<Register title="Register"/>}/>
          <Route path="/Renew" element={<Renew />}/>
          <Route path="/Revoke" element={<Revoke title="Revoke" />}/>
        </Routes> 
      
    </>
  );
}

export default App;
