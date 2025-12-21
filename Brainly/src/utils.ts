export function randon(len:number){
    let options = "qwertyuiopasdfghjklzxcvbnm123456"
    let length = options.length

    let ans ="";
    for(let i = 0;i<len;i++){
        ans += options[Math.floor((Math.random()*length))]
    }
    return ans
}