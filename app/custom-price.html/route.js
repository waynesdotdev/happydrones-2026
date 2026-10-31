/* QUICK PRICE DESK — happydrones.co.uk/custom-price  (private, not linked, not indexed)
   A bare-bones phone calculator for Wayne (or family) to give an instant
   ESTIMATE when a call or email comes in. Plain HTML + a little JavaScript,
   no fonts, no images, no site header, so it loads on one bar of signal.
   Prices are pulled from lib/site.js and lib/cproperty.js at build time,
   so they always match the website. */
import { PRICING, PLANNER, PAYMENT, AGENT_OFFER, AGENT_DISCOUNT, WHITE_LABEL, TRAVEL, SITE } from "@/lib/site";
import { CP_PACKAGES, CP_SIZES, CP_PRICES } from "@/lib/cproperty";

export const dynamic = "force-static";

function data() {
  const svc = (id) => PRICING.services.find((s) => s.id === id);
  const extrasFor = (id) => PRICING.extras.filter((x) => x.for.includes(id) && x.id !== "whitelabel").map((x) => ({ n: x.name, p: x.price }));
  const simple = (id, group) => { const s = svc(id); return { id, g: group, n: s.name, base: s.base, sizesT: s.sizeTitle, sizes: s.sizes.map((z) => ({ n: z.name, a: z.add })), ex: extrasFor(id), pkg: group === "Property" }; };
  const jobs = [
    simple("essentials", "Property"), simple("showcase", "Property"), simple("signature", "Property"),
    simple("aerial", "Property"),
    ...CP_PACKAGES.map((p) => ({ id: "cp-" + p.id, g: "Commercial property", n: p.name, base: p.price, sizesT: "Unit size", sizes: CP_SIZES.map((z) => ({ n: z.name, a: z.add })), ex: [{ n: "Out-of-hours shoot", p: CP_PRICES.outOfHours }, { n: "Next-day delivery", p: PRICING.extras.find((x) => x.id === "rush")?.price || 0 }], units: CP_PRICES.extraUnit, pkg: true })),
    { id: "construction", g: "Construction & commercial", n: "Construction progress", base: PLANNER.missions.find((m) => m.id === "construction")?.base || 179, plan: true,
      scales: PLANNER.scale.map((x) => ({ n: x.name, m: x.mult })), freqs: PLANNER.frequency.map((f) => ({ n: f.name, v: f.visits, d: f.disc })), ex: PLANNER.extras.map((x) => ({ n: x.name, p: x.price })) },
    simple("film", "Construction & commercial"), simple("roof", "Construction & commercial"),
    simple("event", "Construction & commercial"), simple("business", "Construction & commercial"),
  ];
  return {
    jobs,
    agentDisc: AGENT_DISCOUNT,
    wl: { payg: WHITE_LABEL.oneOff, account: WHITE_LABEL.account, bundle: WHITE_LABEL.bundle },
    dep: PAYMENT.depositPct, large: PAYMENT.largeFrom, days: PAYMENT.termsDays,
    travel: [{ n: `Core area (${TRAVEL.core.join(", ")})`, p: 0 }, { n: `Nearby (${TRAVEL.nearby.join(", ")}) +£${TRAVEL.nearbyFee} per visit`, p: TRAVEL.nearbyFee }, { n: "Further out (quote travel separately)", p: null }],
    phone: SITE.phoneDisplay, email: SITE.email, bundle: AGENT_OFFER.bundle.size,
  };
}

const page = (D) => `<!doctype html>
<html lang="en-GB"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow,noarchive">
<title>Price desk</title>
<style>
body{margin:0;font:16px/1.4 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;background:#fff;color:#003366}
main{max-width:520px;margin:0 auto;padding:12px 14px 40px}
h1{font-size:20px;margin:4px 0 2px}
p.n{margin:0 0 12px;color:#46617E;font-size:13px}
label{display:block;font-weight:600;margin:12px 0 4px;font-size:14px}
select,input[type=number]{width:100%;font-size:17px;padding:10px;border:1px solid #9fb3c8;border-radius:8px;background:#fff;color:#003366;box-sizing:border-box}
.ck{display:flex;gap:10px;align-items:center;font-weight:400;margin:6px 0}
.ck input{width:22px;height:22px}
#out{margin-top:16px;border:2px solid #003366;border-radius:10px;padding:12px}
#out table{width:100%;border-collapse:collapse;font-size:15px}
#out td{padding:4px 0;border-bottom:1px solid #e3e9f0}
#out td+td{text-align:right;white-space:nowrap}
.tot{font-size:26px;font-weight:800;color:#FF6B35;margin:8px 0 2px}
.pay{font-size:14px;color:#46617E}
button{margin-top:12px;width:100%;font-size:17px;padding:12px;border:0;border-radius:8px;background:#FF6B35;color:#fff;font-weight:700}
textarea{width:100%;box-sizing:border-box;margin-top:8px;font:13px/1.4 ui-monospace,monospace;height:150px;display:none}
.w{color:#b8441a;font-size:13px}
</style></head><body><main>
<h1>Happy Drones · price desk</h1>
<p class="n">Estimates only. Say "about" and confirm a fixed price in writing. Private page.</p>

<label for="job">Job</label><select id="job"></select>
<div id="sizeW"><label for="size" id="sizeL">Size</label><select id="size"></select></div>
<div id="planW" hidden>
<label for="scale">Site size</label><select id="scale"></select>
<label for="freq">How often</label><select id="freq"></select>
</div>
<div id="unitsW" hidden><label for="units">Extra units, same visit</label><input id="units" type="number" min="0" max="50" value="0" inputmode="numeric"></div>
<div id="exW"><label>Extras</label><div id="ex"></div></div>
<label for="who">Customer</label>
<select id="who">
<option value="home">Homeowner / business (standard price)</option>
<option value="payg">Estate agent, pay as you go</option>
<option value="account">Estate agent account (${D.agentDisc * 100}% off packages)</option>
<option value="bundle">Agent ${D.bundle}-listing bundle (${D.agentDisc * 100}% off, free white label)</option>
</select>
<div id="wlW" hidden><label class="ck"><input type="checkbox" id="wl"> White label</label></div>
<label for="trav">Where is it?</label><select id="trav"></select>

<div id="out"></div>
<button type="button" id="copy">Copy summary to send</button>
<textarea id="txt" readonly aria-label="Summary text"></textarea>
</main>
<script>
var D=${JSON.stringify(D)};
var $=function(i){return document.getElementById(i)};
var f=function(n){return "£"+Math.round(n).toLocaleString("en-GB")};
function opts(el,list,fn){el.innerHTML=list.map(function(x,i){return '<option value="'+i+'">'+fn(x)+'</option>'}).join("")}
var groups={};D.jobs.forEach(function(j,i){(groups[j.g]=groups[j.g]||[]).push('<option value="'+i+'">'+j.n+'</option>')});
$("job").innerHTML=Object.keys(groups).map(function(g){return '<optgroup label="'+g+'">'+groups[g].join("")+'</optgroup>'}).join("");
opts($("trav"),D.travel,function(t){return t.n});
function job(){return D.jobs[+$("job").value]}
function setup(){
  var j=job();
  $("planW").hidden=!j.plan;$("sizeW").hidden=!!j.plan;$("unitsW").hidden=!j.units;
  if(j.plan){opts($("scale"),j.scales,function(s){return s.n});opts($("freq"),j.freqs,function(x){return x.n+(x.d?" (save "+Math.round(x.d*100)+"%)":"")});$("freq").value=2}
  else{$("sizeL").textContent=j.sizesT;opts($("size"),j.sizes,function(s){return s.n+(s.a?" (+"+f(s.a)+")":"")})}
  $("ex").innerHTML=j.ex.map(function(x,i){return '<label class="ck"><input type="checkbox" data-i="'+i+'"> '+x.n+' (+'+f(x.p)+')</label>'}).join("");
  $("exW").hidden=!j.ex.length;calc();
}
function calc(){
  var j=job(),who=$("who").value,lines=[],visits=1,per,total;
  var agent=who!=="home";$("wlW").hidden=!(agent&&j.pkg);
  if(j.plan){
    var sc=j.scales[+$("scale").value],fr=j.freqs[+$("freq").value];visits=fr.v;
    per=sc.m===1?j.base:Math.round(j.base*sc.m/5)*5;lines.push([j.n+" · "+sc.n+" site",f(per)+" /visit"]);
  }else{
    var z=j.sizes[+$("size").value]||{a:0};per=j.base+z.a;lines.push([j.n+" · "+(z.n||""),f(per)]);
    if(agent&&j.pkg&&who!=="payg"){var d=Math.round(per*D.agentDisc);per-=d;lines.push(["Agent discount","−"+f(d)])}
  }
  [].forEach.call($("ex").querySelectorAll("input:checked"),function(c){var x=j.ex[+c.dataset.i];per+=x.p;lines.push([x.name||x.n,"+"+f(x.p)])});
  if(j.units){var u=Math.max(0,+$("units").value||0);if(u){per+=u*j.units;lines.push([u+" extra unit"+(u>1?"s":""),"+"+f(u*j.units)])}}
  if(!$("wlW").hidden&&$("wl").checked){var w=D.wl[who]||0;per+=w;lines.push(["White label",w?"+"+f(w):"Free"])}
  var t=D.travel[+$("trav").value];
  total=per*visits;
  // repeat-visit saving comes off the work only, not travel (same as the mission planner)
  if(j.plan&&visits>1){var fr2=j.freqs[+$("freq").value];var disc=Math.round(total*fr2.d);total-=disc;lines.push([fr2.n,"×"+visits]);if(disc)lines.push(["Multi-visit saving","−"+f(disc)])}
  if(t.p){total+=t.p*visits;lines.push(["Travel",(visits>1?"+"+f(t.p)+" /visit":"+"+f(t.p))])}
  var invoice=total>=D.large||visits>1||who==="account",pay;
  if(who==="bundle")pay="Bundle: "+D.bundle+" listings paid up front = "+f(total*D.bundle)+".";
  else if(invoice)pay="Invoiced on "+D.days+"-day terms"+(who==="account"?" (monthly agent invoice)":"")+".";
  else pay=D.dep+"% deposit ("+f(total*D.dep/100)+") to book, balance before full files.";
  var warn=t.p===null?'<p class="w">Travel not included: quote it separately.</p>':"";
  $("out").innerHTML='<table>'+lines.map(function(l){return "<tr><td>"+l[0]+"</td><td>"+l[1]+"</td></tr>"}).join("")+'</table><div class="tot">About '+f(total)+(visits>1?" <small>("+f(total/visits)+"/visit)</small>":"")+'</div><div class="pay">'+pay+'</div>'+warn;
  $("txt").value="Happy Drones estimate\\n"+lines.map(function(l){return l[0]+": "+l[1]}).join("\\n")+"\\nEstimated total: about "+f(total)+"\\n"+pay+"\\nThis is an estimate. I'll confirm a fixed price in writing.\\n"+D.phone+(D.email?" · "+D.email:"");
}
$("job").onchange=setup;["size","scale","freq","units","who","trav","wl"].forEach(function(i){$(i).oninput=calc;$(i).onchange=calc});
$("ex").onchange=calc;
$("copy").onclick=function(){var t=$("txt");t.style.display="block";t.select();try{navigator.clipboard.writeText(t.value).then(function(){$("copy").textContent="Copied"},function(){})}catch(e){}};
setup();
</script></body></html>`;

export function GET() {
  return new Response(page(data()), { headers: { "Content-Type": "text/html; charset=utf-8", "X-Robots-Tag": "noindex, nofollow" } });
}
