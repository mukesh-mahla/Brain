import type { ReactElement } from "react"

interface ButtonProps{
    varient:"primary" | "secondary",
    size:"sm"|"md"|"lg",
    text:string,
    startIcon?:ReactElement,
    endIcon?:ReactElement,
    onClick?:()=>void,
    fullWidth?:boolean,
    loading?:boolean
}
const varientStyle = {
    "primary":"bg-purple-600 text-white flex",
    "secondary":"bg-purple-200 text-purple-600 flex"
}

const sizeStyle = {
    "sm":"p-2  rounded-md font-normal",
    "md":"p-3  rounded-md font-normal",
    "lg":"p-4  rounded-md font-normal"
}


export const Button = ({varient,size,text,startIcon,endIcon,onClick,fullWidth,loading}:ButtonProps)=>{
    return <button   onClick={onClick} className={`${varientStyle[varient]} ${sizeStyle[size]} ${fullWidth ? " w-full flex justify-center items-centre" : null} ${loading ? "opacity-45" : null}`} > {startIcon ? <div className="px-2 flex justify-center items-center">{startIcon}</div> : null} {<p>{text}</p>} {endIcon ? <div className="px-2 flex justify-center items-center">{endIcon}</div> : null}</button>
}