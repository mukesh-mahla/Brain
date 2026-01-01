
import { Signin } from "./pages/signin";
import { BrowserRouter,Routes,Route } from "react-router-dom";

import { Signup } from "./pages/signup";
import { DashBoard } from "./pages/dashBoard";
import "./App.css"
import LandingPage from "./pages/LandingPage";
import { RAGpage } from "./pages/askAI";

function app(){
  return <BrowserRouter>
  <Routes>
    <Route path="/" element={<LandingPage/>}/>
    <Route path="/signup" element={<Signup/>}/>
    <Route path="/signin" element={<Signin/>}/>
    <Route path="/dashboard" element={<DashBoard/>}/>
    <Route path="/askai" element={<RAGpage/>}/>
  </Routes>
       </BrowserRouter> 
 
}

export default app