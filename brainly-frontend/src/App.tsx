
import { Signin } from "./pages/signin";
import { BrowserRouter,Routes,Route } from "react-router-dom";

import { Signup } from "./pages/signup";
import { DashBoard } from "./pages/dashBoard";
import "./App.css"

function app(){
  return <BrowserRouter>
  <Routes>
    <Route path="/signup" element={<Signup/>}/>
    <Route path="/signin" element={<Signin/>}/>
    <Route path="/dashboard" element={<DashBoard/>}/>
  </Routes>
       </BrowserRouter> 
 
}

export default app