
async function initInfo(){
 try{
  const r=await fetch("data/settings.json",{cache:"no-store"}); const s=await r.json();
  document.querySelectorAll(".brand span:last-child").forEach(e=>e.textContent=s.brandName||"SkillVault");
  const u=(s.telegramUsername||"").replace("@","");
  const link=`https://t.me/${u}?text=${encodeURIComponent(s.defaultTelegramMessage||"Hi, I want to know more about SkillVault courses.")}`;
  ["#navTelegram","#pageTelegram"].forEach(x=>{const e=document.querySelector(x);if(e)e.href=link});
 }catch(e){console.error(e)}
 const y=document.querySelector("#year"); if(y)y.textContent=new Date().getFullYear();
} initInfo();
