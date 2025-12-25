import Jwt  from "jsonwebtoken";
import { JWT_USER_SECRET } from ".";



export function userAuth(req:any,res:any,next:any):any{
try{const token = req.cookies.token
const decode = Jwt.verify(token,JWT_USER_SECRET) 
//@ts-ignore
 req.userId = decode.id
 
 next()
}catch(err){
    console.log(err);
    res.json({msg:"token not found or something went wrong"})
 }
}