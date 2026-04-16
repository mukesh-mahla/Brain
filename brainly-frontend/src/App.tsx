
import { Signin } from "./pages/signin";
import { BrowserRouter,Routes,Route } from "react-router-dom";

import { Signup } from "./pages/signup";
import { DashBoard } from "./pages/dashBoard";
import "./App.css"
import LandingPage from "./pages/LandingPage";
import { RAGpage } from "./pages/askAI";
import { ShareBrain } from "./pages/shareBrain";
import { RequireAuth, RequireUnAuth } from "./utils/auth";

function app(){
  return <BrowserRouter>
  <Routes>
    <Route path="/" element={<LandingPage/>}/>
    <Route path="/signup" element={<Signup/>}/>
    <Route path="/signin" element={<RequireUnAuth><Signin/></RequireUnAuth>}/>
    <Route path="/dashboard" element={<RequireAuth><DashBoard/></RequireAuth>}/>
    <Route path="/askai" element={<RAGpage/>}/>
    <Route path="/brain/:shareLink" element={<ShareBrain />} />
  </Routes>
       </BrowserRouter> 
 
}

export default app