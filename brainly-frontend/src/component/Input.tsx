interface Inputprops{
    placeholder:string,
    ref?:any,
    type?:string
}

export function Input({ref,placeholder,type}:Inputprops){
    return <div>
        <input ref={ref} placeholder={placeholder} type={type } className="px-4 py-2 border rounded m-2"  />
        </div>
}