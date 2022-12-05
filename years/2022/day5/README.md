# Other Solutions
Just for "fun" I tried to write the solution for the day as short and unreadable as possible. I'm not sure if I succeeded, but I'm proud of the result anyway.

```js
console.log((v=>{return[v,v]})((require("fs").readFileSync("./input.txt","utf8").split("\n").reduce(([D,R],L,I)=>(I<8?[[...D,L],R]:I>9?[D,[...R,L]]:[D,R]),[[],[]])).map((v,i)=>{return i==0?(D=>{return new Array(9).fill(0).map((_,I)=>{return D.map(R=>R.split("").filter((_,i)=>i%4==1)).reverse().map(R=>R[I]).filter((e)=>e!=" ")})})(v):v.map(E=>E.replace("\r","").split(" ")).map(E=>[+E[1],+E[3],+E[5]])})).map(([y,u],i)=>{return i==0?((s,m)=>{S=s.map(q=>[...q]);M=m.map(q=>[...q]);M.forEach(h=>{[a,f,t]=h;for(i=0;i<a;i++){S[t-1].push(S[f-1].pop())}});return S.map(q=>q[q.length-1]).join("")})(y,u):((s,m)=>{S=s.map(q=>[...q]);M=m.map(q=>[...q]);M.forEach(h=>{[a,f,t]=h;c=[];for(i=0;i<a;i++){c.push(S[f-1].pop())}c.reverse().forEach(g=>S[t-1].push(g))});return S.map(q=>q[q.length-1]).join("")})(y,u)}));
```

Or in prettier format...
<img src="../../../assets/2022/day5/carbon.svg">

Not sure if I'll do this again, but it was fun to try.
