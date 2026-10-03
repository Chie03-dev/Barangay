document.getElementById("lform").onsubmit=function(e){e.preventDefault();document.getElementById("login").hidden=true;document.getElementById("app").hidden=false;tab("home")};
document.getElementById("lout").onclick=function(){document.getElementById("app").hidden=true;document.getElementById("login").hidden=false;window.scrollTo(0,0)};
var types=[{n:"Barangay Clearance",fee:50,t:"is a bonafide resident of this barangay and has no derogatory record on file"},{n:"Certificate of Residency",fee:30,t:"is a resident of this barangay"},{n:"Certificate of Indigency",fee:0,t:"belongs to an indigent family in this barangay"}];
var reqs=[{n:"Certificate of Residency",s:"Ready for pickup"}];
var budget=[{n:"Infrastructure",a:3200000,s:1900000,c:"var(--c1)"},{n:"Health and nutrition",a:1800000,s:1250000,c:"var(--c2)"},{n:"Peace and order",a:1500000,s:900000,c:"var(--c3)"},{n:"Youth and sports",a:1000000,s:420000,c:"var(--c4)"},{n:"Administration",a:1000000,s:640000,c:"var(--c5)"}];
var projs=[{n:"Rizal St. road repair",p:65},{n:"Barangay health center upgrade",p:40},{n:"Street lights, Purok 1–4",p:90},{n:"Youth basketball league",p:20}];
var $=function(i){return document.getElementById(i)};
var peso=function(n){return "₱"+n.toLocaleString("en-PH")};
var tot=budget.reduce(function(s,b){return s+b.a},0);

function tab(t){document.querySelectorAll("#tabs button").forEach(function(b){b.setAttribute("aria-selected",b.dataset.t===t)});
 document.querySelectorAll("main section").forEach(function(s){s.hidden=s.id!==t});window.scrollTo(0,0)}
document.querySelectorAll("#tabs button").forEach(function(b){b.onclick=function(){tab(b.dataset.t)}});
document.querySelectorAll("[data-go]").forEach(function(b){b.onclick=function(){tab(b.dataset.go)}});

function renderReqs(){$("reqs").innerHTML=reqs.map(function(r){return '<li><span>'+r.n+'</span><span class="pill'+(r.s==="Pending"?"":" ok")+'">'+r.s+'</span></li>'}).join("")}
function preview(){var t=types[$("ctype").selectedIndex],nm=$("cname").value||"[Full name]",pu=$("cpurp").value||"[Purpose]";
 $("cfee").textContent=t.fee?"Fee: "+peso(t.fee)+" (pay at pickup)":"No fee";
 var d=new Date().toLocaleDateString("en-PH",{year:"numeric",month:"long",day:"numeric"});
 $("prev").innerHTML='<div class="seal">SEAL</div><div>Republic of the Philippines<br>Barangay [Pangalan], [City / Municipality]<br>Office of the Punong Barangay</div><h3>'+t.n.toUpperCase()+'</h3><div class="body">To whom it may concern:<br><br>This certifies that <b></b> '+t.t+'. This is issued upon request for <i></i> purposes.<br><br>Issued on '+d+'.</div><div class="sig"><div class="qr" title="QR verification"></div><div style="text-align:center">______________________<br>[Punong Barangay Name]<br>Punong Barangay</div></div>';
 var bs=$("prev").querySelector("b"),is=$("prev").querySelector("i");bs.textContent=nm;is.textContent=pu}
$("ctype").innerHTML=types.map(function(t){return "<option>"+t.n+"</option>"}).join("");
["ctype","cpurp","cname"].forEach(function(i){$(i).oninput=function(){preview();$("cerr").textContent="";$("cmsg").textContent="";$(i).removeAttribute("aria-invalid")}});
$("cform").onsubmit=function(e){e.preventDefault();
 var nm=$("cname"),pu=$("cpurp"),bad=null;
 [nm,pu].forEach(function(f){if(f.value.trim().length<2){f.setAttribute("aria-invalid","true");bad=bad||f}});
 if(bad){$("cerr").textContent="Enter your full name and the purpose of the request.";bad.focus();return}
 var t=types[$("ctype").selectedIndex].n;
 if(reqs.some(function(r){return r.n===t&&r.s==="Pending"})){$("cmsg").textContent="";$("cerr").textContent="You already have a pending request for this certificate.";return}
 reqs.unshift({n:t,s:"Pending"});renderReqs();$("cerr").textContent="";$("cmsg").textContent="Request sent. You will be notified when it is ready."};

$("homeTotal").textContent=$("bTotal").textContent=peso(tot);
$("stack").innerHTML=budget.map(function(b){return '<div style="width:'+(b.a/tot*100)+'%;background:'+b.c+'" title="'+b.n+'"></div>'}).join("");
$("legend").innerHTML=budget.map(function(b){return '<div><span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:'+b.c+';margin-right:6px"></span>'+b.n+" · "+Math.round(b.a/tot*100)+"%</div>"}).join("");
$("bars").innerHTML=budget.map(function(b){var p=Math.round(b.s/b.a*100);return '<div class="row"><div><span>'+b.n+'</span><span>'+p+'%</span></div><div class="bar"><i style="width:'+p+'%;background:'+b.c+'"></i></div><div class="mute">'+peso(b.s)+" of "+peso(b.a)+"</div></div>"}).join("");
$("projs").innerHTML=projs.map(function(p,i){return '<li style="display:block"><div style="display:flex;justify-content:space-between"><span>'+p.n+'</span><span class="mute">'+p.p+'% complete</span></div><div class="bar" style="margin-top:6px"><i style="width:'+p.p+'%;background:var(--c'+(i%3+1)+')"></i></div></li>'}).join("");
renderReqs();preview();
(function(){
var u=["https://images.pexels.com/photos/35642939/pexels-photo-35642939.jpeg","https://images.pexels.com/photos/33588189/pexels-photo-33588189.jpeg","https://images.pexels.com/photos/17321811/pexels-photo-17321811.jpeg"].map(function(x){return x+"?auto=compress&cs=tinysrgb&w=1400"});
var box=document.querySelector(".slides"),n=0;
u.forEach(function(x,i){var e=document.createElement("i");e.style.backgroundImage='url("'+x+'")';if(!i)e.className="on";box.appendChild(e)});
setInterval(function(){var l=box.children;l[n].className="";n=(n+1)%l.length;l[n].className="on"},5000);
})();
document.getElementById("kform").onsubmit=function(e){e.preventDefault();
 var f=["kname","kbrgy","kcontact","kmsg"].map(function(i){return document.getElementById(i)}),bad=null;
 f.forEach(function(x){x.removeAttribute("aria-invalid");if(x.value.trim().length<2){x.setAttribute("aria-invalid","true");bad=bad||x}});
 var er=document.getElementById("kerr"),ok=document.getElementById("kok");ok.textContent="";
 if(bad){er.textContent="Please fill in every field so we can reply.";bad.focus();return}
 er.textContent="";ok.textContent="Thank you. We will get back to you soon.";f.forEach(function(x){x.value=""})};
