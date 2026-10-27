import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import vm from "node:vm";

const src=readFileSync("app.js","utf8").replace(/^import\s+\{\s*createClient\s*\}\s+from\s+.+?;\s*\n/,"");
assert.notEqual(src.length,readFileSync("app.js","utf8").length,"Module import should be stripped for VM test");

const elements=new Map();
function el(id){if(!elements.has(id))elements.set(id,{
  innerHTML:"",textContent:"",hidden:false,style:{},value:"",
  addEventListener(){},close(){},showModal(){}
});return elements.get(id);}
const handlers={};
const browser={
  window:{MADEPICK_CONFIG:{supabaseUrl:"",supabaseAnonKey:""},addEventListener:(k,cb)=>{handlers[k]=cb;},scrollTo(){}},
  document:{documentElement:{lang:"ko"},title:"",
    querySelector:el,addEventListener(){},},
  localStorage:{getItem(){return null;},setItem(){}},
  location:{hash:"#/home",origin:"https://chlanstjr3-collab.github.io",pathname:"/madepick/"},
  console,URL,setTimeout,clearTimeout,confirm:()=>true,prompt:()=>null
};
vm.runInNewContext(src,browser,{filename:"app.js",timeout:2500});
await new Promise(resolve=>setTimeout(resolve,15));
assert.match(el("#app").innerHTML,/MadePick|요청하고/);
assert.match(el("#app").innerHTML,/Supabase/);
assert.doesNotMatch(el("#app").innerHTML,/MoneyMap|PixelPlay|NoteNest/);
browser.location.hash="#/showcase";
handlers.hashchange();
assert.match(el("#app").innerHTML,/아직 전시된 작품이 없습니다/);
assert.doesNotMatch(el("#app").innerHTML,/PixelPlay/);
browser.location.hash="#/requests";
handlers.hashchange();
assert.match(el("#app").innerHTML,/아직 등록된 요청이 없습니다/);
console.log("MadePick no-Supabase smoke test OK");
