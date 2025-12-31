export function randon(len:number){
    let options = "qwertyuiopasdfghjklzxcvbnm123456"
    let length = options.length

    let ans ="";
    for(let i = 0;i<len;i++){
        ans += options[Math.floor((Math.random()*length))]
    }
    return ans
}

export function buildContext(contents: any[]) {
  return contents
    .map(
      (c, i) =>
        `${i + 1}. ${c.title}\nLink: ${c.link}`
    )
    .join("\n\n");
}