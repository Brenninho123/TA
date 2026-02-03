import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import fs from "fs";

const app=express();
app.use(cors());
app.use(express.json());

const memoryFile="./memory.json";

function loadMemory(){
  if(!fs.existsSync(memoryFile))return [];
  return JSON.parse(fs.readFileSync(memoryFile));
}
function saveMemory(m){
  fs.writeFileSync(memoryFile,JSON.stringify(m,null,2));
}

app.post("/chat",async(req,res)=>{
  const {message,mode}=req.body;
  const memory=loadMemory();

  let systemPrompt={
    friendly:"You are a friendly advanced AI.",
    evil:"You are a dark, sarcastic super AI.",
    professional:"You are a serious professional AI."
  }[mode];

  memory.push({role:"user",content:message});
  saveMemory(memory);

  // 🔌 OPENAI (troque a chave)
  const response=await fetch("https://api.openai.com/v1/chat/completions",{
    method:"POST",
    headers:{
      "Authorization":"Bearer SUA_API_KEY_AQUI",
      "Content-Type":"application/json"
    },
    body:JSON.stringify({
      model:"gpt-4o-mini",
      messages:[
        {role:"system",content:systemPrompt},
        ...memory
      ]
    })
  });

  const data=await response.json();
  const reply=data.choices[0].message.content;

  memory.push({role:"assistant",content:reply});
  saveMemory(memory);

  res.json({reply});
});

app.listen(3000,()=>console.log("🔺 Assistant Triangle backend online"));
