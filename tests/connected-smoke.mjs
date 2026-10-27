import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import vm from "node:vm";

const js=readFileSync("app.js","utf8").replace(/^import\s+\{\s*createClient\s*\}\s+from\s+.+?;\s*\n/,"");
const requester="00000000-0000-4000-8000-000000000001";
const maker="00000000-0000-4000-8000-000000000002";
const req="11111111-1111-4111-8111-111111111111";
const prod="22222222-2222-4222-8222-222222222222";
const sample={
 requests:[{id:req,owner_id:requester,title:"Test request",description:"A genuine user submitted request for an app",category:"ai",status:"open",created_at:"2026-10-27T00:00:00Z"}],
 products:[{id:prod,owner_id:maker,request_id:req,title:"Test actual link",description:"<script>unsafe XSS sample</script>",tagline:"Build faster with user feedback",highlights:"Share your app\nCollect real feedback",image_paths:[maker+"/"+prod+"/aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa.jpg",maker+"/"+prod+"/bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb.webp"],category:"productivity",url:"https://example.org",created_at:"2026-10-27T00:00:00Z"}],
 profiles:[{id:requester,display_name:"Requester"},{id:maker,display_name:"Maker"}],
 build_participations:[{user_id:maker,request_id:req,status:"building"}],
 request_metrics:[{request_id:req,total:2,day:1,week:2,month:2}],
 product_metrics:[{product_id:prod,total:3,day:2,week:3,month:3,review_count:1,rating:4}],
 comments:[{id:"33333333-3333-4333-8333-333333333333",author_id:requester,request_id:req,product_id:null,kind:"discussion",body:"My real comment",created_at:"2026-10-27T00:00:00Z"}],
 reviews:[{id:"44444444-4444-4444-8444-444444444444",author_id:requester,product_id:prod,rating:4,body:"Worked well for me",created_at:"2026-10-27T00:00:00Z"}]
};
function table(name){
  const obj={select(){return this;},eq(){return this;},order(){return this;},limit(){return this;},maybeSingle(){return Promise.resolve({data:null,error:null});},
    then(resolve){return Promise.resolve({data:sample[name]||[],error:null}).then(resolve);}};
  return obj;
}
const listeners={},elements=new Map();
function e(id){if(!elements.has(id))elements.set(id,{innerHTML:"",textContent:"",hidden:false,style:{},value:"",
 addEventListener(){},close(){},showModal(){}});return elements.get(id);}
const browser={
 createClient(){return {auth:{async getUser(){return {data:{user:null}};},onAuthStateChange(){}},from:table,storage:{from:()=>({getPublicUrl:(path)=>({data:{publicUrl:"https://demo.supabase.co/storage/v1/object/public/product-media/"+path}})})}};},
 window:{MADEPICK_CONFIG:{supabaseUrl:"https://demo.supabase.co",supabaseAnonKey:"publishable-only"},addEventListener(k,cb){listeners[k]=cb;},scrollTo(){}},
 document:{documentElement:{lang:"ko"},title:"",querySelector:e,addEventListener(){}},
 location:{hash:"#/home",origin:"https://chlanstjr3-collab.github.io",pathname:"/madepick/"},
 localStorage:{getItem(){return null;},setItem(){}},URL,console,setTimeout,clearTimeout,confirm:()=>true,prompt:()=>null
};
vm.runInNewContext(js,browser,{filename:"app.js",timeout:2500});
await new Promise(resolve=>setTimeout(resolve,25));
let h=e("#app").innerHTML;
assert.match(h,/Test request/);
assert.match(h,/Test actual link/);
browser.location.hash="#/request/"+req;listeners.hashchange();
h=e("#app").innerHTML;
assert.match(h,/My real comment/);
assert.match(h,/Maker/);
browser.location.hash="#/product/"+prod;listeners.hashchange();
h=e("#app").innerHTML;
assert.match(h,/Worked well for me/);
assert.match(h,/https:\/\/example.org/);
assert.match(h,/Build faster with user feedback/);
assert.match(h,/Share your app/);
assert.match(h,/product-showroom/);
assert.match(h,/aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa.jpg/);
assert.match(h,/bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb.webp/);
assert.ok(h.includes("&lt;script&gt;"),"description must be HTML-escaped");
assert.ok(!h.includes("<script>unsafe"),"raw scripts must not be injected");
console.log("MadePick connected-data browser-shell smoke test OK");
