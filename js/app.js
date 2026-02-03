const chat=document.getElementById("chat");
const input=document.getElementById("input");
const mode=document.getElementById("mode");

function add(text,type){
  const div=document.createElement("div");
  div.className="msg "+type;
  div.innerHTML=text;
  chat.appendChild(div);
  chat.scrollTop=chat.scrollHeight;
}

add("🔺 Assistant Triangle online.","ai");

async function send(){
  if(!input.value.trim()) return;

  add(input.value,"user");

  const res = await fetch("http://localhost:3000/chat",{
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body:JSON.stringify({
      message: input.value,
      mode: mode.value
    })
  });

  const data = await res.json();
  add(data.reply,"ai");
  speak(data.reply);
  input.value="";
}

function speak(text){
  const s = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(s);
}

function voice(){
  const rec = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  rec.lang="en-US";
  rec.onresult = e=>{
    input.value = e.results[0][0].transcript;
    send();
  };
  rec.start();
}
