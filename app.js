import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const settings = window.MADEPICK_CONFIG || {};
const configured = /^https:\/\/[a-z0-9.-]+$/i.test(settings.supabaseUrl || "") && !!settings.supabaseAnonKey;
const db = configured ? createClient(settings.supabaseUrl, settings.supabaseAnonKey, {
  auth: { persistSession: true, detectSessionInUrl: true, autoRefreshToken: true }
}) : null;

const CATS = ["all","ai","productivity","finance","game","education","other"];
const NAMES = {
  ko: {home:"홈",requests:"요청하기",build:"만들어주기",showcase:"전시하기",rankings:"랭킹",profile:"마이페이지",signIn:"Google 로그인",signOut:"로그아웃",
    request:"요청",product:"작품",idea:"이런 서비스 필요해요",viewProducts:"작품 둘러보기",submitIdea:"아이디어 요청하기",submitProduct:"내 작품 전시하기",
    intro:"누구나 아이디어를 요청하고, 자발적으로 제작에 참여하고, 완성된 서비스를 공유하는 공간입니다.",
    h1:"필요한 건 요청하고,<br>만든 건 <em>보여주세요.</em>",how:"MadePick은 이렇게 이용해요",
    rdesc:"이런 서비스가 있으면 좋겠어요! 필요한 아이디어를 제안하고 의견을 나누세요.",
    bdesc:"다른 사람이 올린 요청 중 흥미로운 아이디어를 찾아서 자유롭게 참여하세요.",
    sdesc:"직접 만든 웹사이트와 앱을 알리고, 이용자들의 리뷰를 받아보세요.",
    wanted:"지금 필요한 아이디어",popular:"새로운 전시 작품",all:"전체 보기 →",go:"둘러보기 →",
    connect:"현재 Supabase 연결 설정을 준비 중입니다. 실제 로그인과 게시물 등록은 연결 후 이용할 수 있어요.",
    emptyRequests:"아직 등록된 요청이 없습니다.",emptyProducts:"아직 전시된 작품이 없습니다.",emptyComments:"아직 댓글이 없어요. 첫 의견을 남겨주세요.",
    emptyReviews:"아직 리뷰가 없어요. 작품을 사용한 뒤 첫 후기를 남겨주세요.",emptyMine:"작성한 항목이 아직 없습니다.",
    emptyExplain:"첫 번째 등록자가 되어주세요.",search:"제목·내용 검색",category:"모든 카테고리",latest:"최신순",popularSort:"인기순",period:"집계 기간",
    today:"24시간",week:"7일",month:"30일",allTime:"전체",noResults:"조건에 맞는 글이 없습니다.",loginNeeded:"이 기능을 사용하려면 Google 로그인이 필요합니다.",
    comment:"댓글",review:"사용 후기",comments:"댓글",reviews:"별점 리뷰",author:"작성자",title:"제목",description:"설명",website:"웹사이트 주소 (https://)",
    urlHelp:"완성된 작품의 실제 주소를 입력하세요.",tagline:"짧은 홍보 문구",taglineHelp:"작품의 매력을 한 문장으로 알려주세요.",highlights:"주요 장점 · 기능",highlightsHelp:"한 줄에 한 가지씩 소개해주세요.",photos:"작품 소개 사진",photosHelp:"최대 5장 · 사진당 5MB 이하 · JPG / PNG / WEBP · 첫 번째 사진이 대표 이미지",removePhoto:"사진 삭제",photoMax:"사진은 최대 5장까지 선택할 수 있어요.",photoType:"JPG, PNG, WEBP 사진만 올릴 수 있어요.",photoSize:"사진 한 장은 5MB를 넘을 수 없어요.",features:"주요 기능과 장점",promoDescription:"작품 상세 소개",name:"이름",publish:"등록하기",save:"저장",cancel:"취소",edit:"수정",delete:"삭제",
    confirmDelete:"정말 삭제할까요? 되돌릴 수 없습니다.",details:"자세히 보기",vote:"나도 필요해요",up:"추천",down:"비추천",
    join:"제작 참여하기",leave:"참여 취소",participants:"참여한 제작자",status:"진행 상태",open:"요청 중",building:"제작 중",completed:"완료",
    progress:"진행 상황",discussion:"일반 의견",use:"직접 사용해보기 ↗",reviewNotice:"실제로 사용한 경험을 바탕으로 작성해 주세요. 리뷰는 각 작품당 한 개까지 남길 수 있습니다.",
    rating:"별점",body:"내용",writeComment:"댓글 남기기",writeReview:"리뷰 남기기",reviewUpdate:"내 리뷰 수정",
    invalidUrl:"https://로 시작하는 정상적인 웹사이트 주소를 입력하세요.",saved:"저장했어요.",failed:"처리하지 못했어요. 다시 시도해 주세요.",
    report:"신고",reportReason:"신고 사유를 5자 이상 적어주세요.",reported:"신고가 접수되었습니다.",yourProfile:"내 프로필",displayName:"표시 이름",
    myRequests:"내가 요청한 것",myProducts:"내가 전시한 것",myReviews:"내가 작성한 리뷰",back:"목록으로",linked:"연결된 요청",
    linkRequest:"이 작품이 해결한 요청 (선택)",none:"연결하지 않음",loginPrompt:"로그인하면 요청·제작·전시·리뷰에 참여할 수 있습니다.",
    builderNote:"제작 참여는 자발적이며 의무나 보수가 자동 발생하지 않습니다.",alreadyReviewed:"내가 남긴 리뷰",
    noData:"연결된 데이터가 없습니다.",setup:"설정 안내",sampleNone:"가상의 상품과 투표 수는 표시하지 않습니다.",
    loading:"불러오는 중…",generalError:"데이터를 불러오지 못했습니다. Supabase 설정과 SQL 적용 상태를 확인해 주세요.",
    ownerNoReview:"본인이 등록한 작품에는 별점 리뷰를 남길 수 없습니다.",confirmUsed:"직접 사용해본 경험으로 작성합니다.",
    filter:"필터",browse:"작품",profileSave:"이름 변경",loginLoading:"로그인 확인 중…",by:"작성",
    admin:"관리자",pendingReports:"처리되지 않은 신고",resolve:"처리 완료",hideAndResolve:"게시물 숨기고 처리",removeAndResolve:"댓글/리뷰 삭제 후 처리",noReports:"처리할 신고가 없습니다.",moderationConfirm:"신고된 콘텐츠를 제한하고 처리 완료할까요?",caution:"베타 서비스 · 새로 등록된 링크를 열 때는 안전 여부를 확인해 주세요."},
  en: {home:"Home",requests:"Request",build:"Build",showcase:"Showcase",rankings:"Rankings",profile:"My account",signIn:"Sign in with Google",signOut:"Sign out",
    request:"Request",product:"Product",idea:"Wish a service existed?",viewProducts:"Explore products",submitIdea:"Post an idea",submitProduct:"Show your product",
    intro:"Request useful apps, volunteer to build ideas, and show your completed projects to the world.",
    h1:"Request it. Build it.<br><em>Show it to the world.</em>",how:"How MadePick works",
    rdesc:"Tell the community which app or tool you wish existed. Discuss requests below.",
    bdesc:"Browse ideas shared by the community and volunteer to build anything interesting.",
    sdesc:"Share your finished apps, get discovered, and receive feedback from real visitors.",
    wanted:"Requested ideas",popular:"Newly showcased",all:"See all →",go:"Explore →",
    connect:"Supabase is not connected yet. Google sign-in and public posts will be enabled when setup is complete.",
    emptyRequests:"No requests yet.",emptyProducts:"No products showcased yet.",emptyComments:"No comments yet. Share the first thought.",
    emptyReviews:"No reviews yet. Try the product and share the first review.",emptyMine:"Nothing here yet.",
    emptyExplain:"Be the first contributor.",search:"Search title or description",category:"All categories",latest:"Newest",popularSort:"Popular",period:"Ranking period",
    today:"24 hours",week:"7 days",month:"30 days",allTime:"All time",noResults:"No matching posts.",loginNeeded:"Please sign in with Google to continue.",
    comment:"Comment",review:"Review",comments:"Comments",reviews:"Star reviews",author:"By",title:"Title",description:"Description",website:"Website URL (https://)",
    urlHelp:"Enter the real URL of your finished product.",tagline:"Short promotional tagline",taglineHelp:"Explain your product’s best benefit in a sentence.",highlights:"Key benefits and features",highlightsHelp:"List one feature per line.",photos:"Product screenshots and photos",photosHelp:"Up to 5 photos · 5MB each · JPG / PNG / WEBP · first image is the cover",removePhoto:"Remove",photoMax:"Select up to 5 images.",photoType:"Only JPG, PNG or WEBP images are supported.",photoSize:"Each photo must be no larger than 5MB.",features:"Key benefits and features",promoDescription:"Product description",name:"Name",publish:"Publish",save:"Save",cancel:"Cancel",edit:"Edit",delete:"Delete",
    confirmDelete:"Delete this item permanently?",details:"View details",vote:"I need this",up:"Upvote",down:"Downvote",
    join:"Join as maker",leave:"Leave build",participants:"Builders joined",status:"Status",open:"Requested",building:"Building",completed:"Completed",
    progress:"Progress update",discussion:"General comment",use:"Try this product ↗",reviewNotice:"Only share reviews based on your personal use. One review per person per product.",
    rating:"Stars",body:"Comment",writeComment:"Post comment",writeReview:"Post review",reviewUpdate:"Update my review",
    invalidUrl:"Enter a valid HTTPS website URL.",saved:"Saved.",failed:"Could not complete the action.",
    report:"Report",reportReason:"Describe the problem (at least 5 characters).",reported:"Report submitted.",yourProfile:"My profile",displayName:"Display name",
    myRequests:"My requests",myProducts:"My products",myReviews:"My reviews",back:"Back to list",linked:"Requested idea",
    linkRequest:"Related request (optional)",none:"Not linked",loginPrompt:"Sign in to post requests, volunteer, showcase and review.",
    builderNote:"Joining a build is voluntary and does not create paid work or an obligation.",alreadyReviewed:"Your review",
    noData:"Nothing available.",setup:"Setup guide",sampleNone:"There are no made-up products or fake scores.",
    loading:"Loading…",generalError:"Could not load data. Check Supabase configuration and migration.",
    ownerNoReview:"You cannot review your own product.",confirmUsed:"I have personally used this product.",
    filter:"Filter",browse:"Browse",profileSave:"Update name",loginLoading:"Checking account…",by:"By",
    admin:"Moderation",pendingReports:"Pending reports",resolve:"Mark resolved",hideAndResolve:"Hide post and resolve",removeAndResolve:"Remove comment/review and resolve",noReports:"No pending reports.",moderationConfirm:"Moderate this item and resolve the report?",caution:"Beta · Check unfamiliar external links before opening."}
};
const CAT = {ko:{all:"전체",ai:"AI",productivity:"생산성",finance:"금융",game:"게임",education:"교육",other:"기타"},
  en:{all:"All",ai:"AI",productivity:"Productivity",finance:"Finance",game:"Games",education:"Education",other:"Other"}};
const state = {
  lang: localStorage.getItem("madepick-lang") === "en" ? "en":"ko",
  ready:false, user:null, profile:null, isModerator:false, reports:[], error:"",
  requests:[], products:[], profiles:[],participations:[], reqMetrics:[], productMetrics:[],
  userReqVotes:[],userProductVotes:[],comments:[],reviews:[],
  search:"",category:"all",order:"popular",period:"all",gallery:{keep:[],newFiles:[],previews:[]}
};
const $ = (sel) => document.querySelector(sel);
const tr = (key) => NAMES[state.lang][key] || key;
const cc = (key) => CAT[state.lang][key] || key;
const esc = (s) => String(s == null ? "":s).replace(/[&<>"']/g,(x)=>({"&":"&amp","<":"&lt",">":"&gt",'"':"&quot","'":"&#39"}[x]+";"));
const date = (s) => s ? new Date(s).toLocaleDateString(state.lang === "ko" ? "ko-KR":"en-US"):"";
const who = (id) => {const p=state.profiles.find(x=>x.id===id);return p ? p.display_name : (state.lang==="ko"?"사용자":"Member");};
const toast = (txt) => {const el=$("#toast");el.textContent=txt;el.hidden=false;clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>el.hidden=true,3500);};
const showError = (e) => {console.error(e);toast(e && e.message ? e.message :tr("failed"));};
const counts = (type,id) => type==="request" ? state.reqMetrics.find(x=>x.request_id===id) || {} : state.productMetrics.find(x=>x.product_id===id) || {};
const val = (x,k) => Number(x?.[k] || 0);
function metric(type,id){const m=counts(type,id);return val(m,state.period==="all"?"total":state.period);}
function page(){const parts=location.hash.replace(/^#\/?/,"").split("/");return {name:parts[0]||"home",id:parts[1]||""};}
function go(path){location.hash="#/"+path; if(page().name===path.split("/")[0])render(); window.scrollTo(0,0);}
function navigate(name){state.search="";state.category="all";state.order="popular";state.period="all";go(name);}

function nav(){const p=page();const tabs=["home","requests","build","showcase","rankings"].concat(state.isModerator?["admin"]:[]);
  $("#topnav").innerHTML=tabs.map(x=>'<button data-action="go" data-path="'+x+'" class="'+((p.name===x||p.name==="product"&&x==="showcase")?"active":"")+'">'+esc(tr(x))+'</button>').join("");
  $("#mobileNav").innerHTML=["home","requests","build","showcase"].map((x,i)=>'<button class="'+(p.name===x?"active":"")+'" data-action="go" data-path="'+x+'">'+["⌂ ","💡 ","🛠 ","🚀 "][i]+esc(tr(x))+'</button>').join("");
  $("#authzone").innerHTML = '<button class="ghost" data-action="lang">'+(state.lang==="ko"?"EN":"KO")+' 🌐</button>'+
  (state.user?'<button class="ghost" data-action="go" data-path="profile">👤 '+esc(state.profile?.display_name||tr("profile"))+'</button><button class="btn tiny alt" data-action="logout">'+tr("signOut")+'</button>':
  '<button class="btn tiny" data-action="login">'+tr("signIn")+'</button>');
}
function notice(){return !configured?'<div class="notice">'+esc(tr("connect"))+' <a href="https://github.com/chlanstjr3-collab/madepick/blob/main/SETUP.md" target="_blank" rel="noopener noreferrer"><u>'+esc(tr("setup"))+'</u></a></div>':
  state.error?'<div class="notice error">'+esc(tr("generalError"))+'<br>'+esc(state.error)+'</div>':"";}
function zero(type){return '<div class="empty"><i>'+(type==="request"?"💡":"🚀")+'</i><h3>'+tr(type==="request"?"emptyRequests":"emptyProducts")+'</h3><p>'+tr("emptyExplain")+'</p>'+
  '<button class="btn" data-action="new" data-kind="'+type+'">'+tr(type==="request"?"submitIdea":"submitProduct")+'</button></div>';}
function options(){return CATS.slice(1).map(x=>'<option value="'+x+'">'+cc(x)+'</option>').join("");}
function topSection(title,desc,buttonType){return '<div class="heading"><div><div class="eyebrow">MADEPICK COMMUNITY</div><h2>'+title+'</h2><p class="subline">'+desc+'</p></div>'+
  (buttonType?'<button class="btn" data-action="new" data-kind="'+buttonType+'">+ '+tr(buttonType==="request"?"submitIdea":"submitProduct")+'</button>':"")+'</div>';}
function filters(){return '<div class="toolbar"><input id="q" aria-label="'+tr("search")+'" placeholder="'+tr("search")+'" value="'+esc(state.search)+'">'+
  '<select id="cat" aria-label="'+tr("category")+'">'+CATS.map(x=>'<option value="'+x+'" '+(state.category===x?"selected":"")+'>'+cc(x)+'</option>').join("")+'</select>'+
  '<select id="order" aria-label="sort"><option value="popular" '+(state.order==="popular"?"selected":"")+'>'+tr("popularSort")+'</option><option value="latest" '+(state.order==="latest"?"selected":"")+'>'+tr("latest")+'</option></select>'+
  '<select id="period" aria-label="ranking period">'+[["day","today"],["week","week"],["month","month"],["all","allTime"]].map(x=>'<option value="'+x[0]+'" '+(state.period===x[0]?"selected":"")+'>'+tr(x[1])+'</option>').join("")+'</select></div>';}
function filtered(rows,type){const q=state.search.toLocaleLowerCase();return rows.filter(x=>(state.category==="all"||x.category===state.category)&&
  (x.title+" "+x.description).toLocaleLowerCase().includes(q)).sort((a,b)=>state.order==="latest"?Date.parse(b.created_at)-Date.parse(a.created_at):
  metric(type,b.id)-metric(type,a.id)||Date.parse(b.created_at)-Date.parse(a.created_at));}

const MEDIA_BUCKET="product-media";
const IMAGE_TYPES={"image/jpeg":"jpg","image/png":"png","image/webp":"webp"};
const MAX_IMAGE_BYTES=5*1024*1024;
function photoUrl(path){
 if(!db||typeof path!=="string"||!/^[0-9a-f-]{36}\/[0-9a-f-]{36}\/[0-9a-f-]{36}\.(jpg|jpeg|png|webp)$/i.test(path))return "";
 return db.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl;
}
function coverUrl(product){
 const path=Array.isArray(product?.image_paths)?product.image_paths[0]:null;
 return path?photoUrl(path):"";
}
function productHighlights(product){
 const lines=String(product.highlights||"").split(/\r?\n/).map(x=>x.trim()).filter(Boolean).slice(0,8);
 return lines.length?'<div class="detail-highlights"><h3>✨ '+tr("features")+'</h3><ul>'+
 lines.map(x=>'<li>'+esc(x)+'</li>').join("")+'</ul></div>':"";
}
function productGallery(product){
 const paths=Array.isArray(product.image_paths)?product.image_paths:[];
 const valid=paths.map(photoUrl).filter(Boolean);
 if(!valid.length)return "";
 return '<div class="product-showroom"><img class="detail-cover" src="'+esc(valid[0])+'" alt="'+esc(product.title)+'" loading="eager">'+
 (valid.length>1?'<div class="media-gallery">'+valid.map((url,i)=>'<a class="media-photo" target="_blank" rel="noopener noreferrer" href="'+esc(url)+'" title="'+tr("photos")+' '+(i+1)+'"><img loading="lazy" alt="'+esc(product.title)+' '+(i+1)+'" src="'+esc(url)+'"></a>').join("")+'</div>':"")+
 '</div>';
}
function releasePhotoPreviews(){
 for(const url of state.gallery.previews||[])try{URL.revokeObjectURL(url);}catch(e){}
 state.gallery.previews=[];
}
function updatePhotoPreviews(){
 const slot=$("#photoPreview");if(!slot)return;
 releasePhotoPreviews();
 const old=state.gallery.keep.map((path,i)=>({src:photoUrl(path),source:"keep",index:i,name:(i===0?"⭐ ":"")+tr("photos")+" "+(i+1)}));
 const incoming=state.gallery.newFiles.map((file,i)=>{
  const src=URL.createObjectURL(file);state.gallery.previews.push(src);
  return {src,source:"new",index:i,name:file.name};
 });
 slot.innerHTML=[...old,...incoming].map(p=>'<div class="photo-preview-item"><img src="'+esc(p.src)+'" alt="'+esc(p.name)+'"><small>'+esc(p.name)+'</small>'+
 '<button type="button" data-action="remove-photo" data-source="'+p.source+'" data-index="'+p.index+'">'+tr("removePhoto")+'</button></div>').join("");
 const caption=$("#photoCount");if(caption)caption.textContent=(old.length+incoming.length)+"/5";
}
function selectedPhotos(files){
 const arr=Array.from(files||[]);
 if(state.gallery.keep.length+state.gallery.newFiles.length+arr.length>5)return toast(tr("photoMax"));
 for(const file of arr){
  if(!IMAGE_TYPES[file.type])return toast(tr("photoType"));
  if(file.size>MAX_IMAGE_BYTES||!file.size)return toast(tr("photoSize"));
 }
 state.gallery.newFiles.push(...arr);updatePhotoPreviews();
}
async function uploadPhotos(productId){
 const uploaded=[];
 try{
  for(const file of state.gallery.newFiles){
   const ext=IMAGE_TYPES[file.type];
   if(!ext||file.size>MAX_IMAGE_BYTES||file.size<1)throw Error(tr("photoType"));
   const path=state.user.id+"/"+productId+"/"+crypto.randomUUID()+"."+ext;
   const response=await db.storage.from(MEDIA_BUCKET).upload(path,file,{contentType:file.type,cacheControl:"3600",upsert:false});
   ensure(response);uploaded.push(path);
  }
  return uploaded;
 }catch(error){
  if(uploaded.length)try{await db.storage.from(MEDIA_BUCKET).remove(uploaded);}catch(e){console.warn("Media cleanup",e);}
  throw error;
 }
}

function card(a,type){
 const req=type==="request",m=counts(type,a.id);
 const commentCount=state.comments.filter(x=>req?x.request_id===a.id:x.product_id===a.id).length;
 const thumbnail=!req?coverUrl(a):"";
 const teaser=!req&&a.tagline?a.tagline:a.description.slice(0,135);
 return '<article class="item"><button class="itemBody" data-action="detail" data-kind="'+type+'" data-id="'+esc(a.id)+'">'+
  (thumbnail?'<img class="product-cover" loading="lazy" src="'+esc(thumbnail)+'" alt="'+esc(a.title)+'">':"")+
  '<div class="itemHead"><span class="pill">'+cc(a.category)+'</span><span class="hint">'+date(a.created_at)+'</span></div>'+
  '<h3>'+esc(a.title)+'</h3><p>'+esc(teaser)+(teaser===a.description.slice(0,135)&&a.description.length>135?"…":"")+'</p></button>'+
  '<div class="itemBottom"><span class="hint">'+esc(who(a.owner_id))+'</span><div class="row"><span class="counter">↑ '+val(m,"total")+'</span>'+
  (!req&&val(m,"review_count")?'<span class="counter">★ '+val(m,"rating").toFixed(1)+'</span>':"")+
  '<button class="btn tiny alt" data-action="detail" data-kind="'+type+'" data-id="'+esc(a.id)+'">'+tr("details")+
  (commentCount?" · 💬 "+commentCount:"")+'</button></div></div></article>';
}
function listBlock(type,items){return items.length?'<div class="cards">'+items.map(x=>card(x,type)).join("")+'</div>':zero(type);}
function home(){const requests=state.requests.slice().sort((a,b)=>Date.parse(b.created_at)-Date.parse(a.created_at)).slice(0,2);
 const products=state.products.slice().sort((a,b)=>Date.parse(b.created_at)-Date.parse(a.created_at)).slice(0,2);
 return '<div class="wrap"><section class="hero"><div><div class="eyebrow">✦ MADE BY PEOPLE, PICKED BY YOU</div><h1>'+tr("h1")+'</h1><p class="lead">'+tr("intro")+'</p>'+
 '<div class="actions"><button class="btn" data-action="new" data-kind="request">💡 '+tr("submitIdea")+'</button><button class="btn alt" data-action="go" data-path="showcase">'+tr("viewProducts")+' →</button></div></div>'+
 '<div class="heroArt"><div class="fakecard"><small>💡 REQUEST</small><strong>'+(state.lang==="ko"?"필요한 서비스를 요청하고 의견을 나눠요":"Share an idea the world needs")+'</strong></div>'+
 '<div class="fakecard second"><small>🚀 SHOWCASE</small><strong>'+(state.lang==="ko"?"만든 작품을 전시하고 리뷰를 받아요":"Show your work and collect reviews")+'</strong></div></div></section>'+
 notice()+
 '<section class="section"><h2>'+tr("how")+'</h2><div class="ways">'+
 [["requests","💡",tr("requests"),tr("rdesc")],["build","🛠️",tr("build"),tr("bdesc")],["showcase","🚀",tr("showcase"),tr("sdesc")]].map(a=>
 '<button class="way" data-action="go" data-path="'+a[0]+'"><span class="emoji">'+a[1]+'</span><strong>'+a[2]+'</strong><p>'+a[3]+'</p><b>'+tr("go")+'</b></button>').join("")+'</div></section>'+
 '<section class="section">'+topSection(tr("wanted"),"",null)+listBlock("request",requests)+
 '<div class="actions"><button class="btn alt" data-action="go" data-path="requests">'+tr("all")+'</button></div></section>'+
 '<section class="section">'+topSection(tr("popular"),"",null)+listBlock("product",products)+
 '<div class="actions"><button class="btn alt" data-action="go" data-path="showcase">'+tr("all")+'</button></div></section>'+
 '<div class="notice info">'+tr("caution")+'</div></div>';
}
function listing(name){const type=name==="showcase"?"product":"request";const tname=name==="rankings"?"rankings":name;const desc=name==="build"?"bdesc":type==="product"?"sdesc":"rdesc";
  return '<div class="wrap content">'+topSection(tr(tname),tr(desc),name==="rankings"?null:type)+notice()+filters()+
  '<div id="listingResults">'+(name==="rankings" ? rankings():listResults(type))+'</div>'+
  (name==="build"?'<div class="notice info">'+tr("builderNote")+'</div>':"")+'</div>';}
function listResults(type){return listBlock(type,filtered(type==="product"?state.products:state.requests,type));}
function rankings(){return '<h2>🚀 '+tr("showcase")+'</h2>'+listResults("product")+
 '<h2 style="margin-top:38px">💡 '+tr("requests")+'</h2>'+listResults("request");}
function stars(n,interactive){let out='<div class="stars" aria-label="'+n+' stars">';for(let i=1;i<=5;i++)
 out+=interactive?'<button type="button" class="star '+(i<=n?"on":"")+'" data-action="stars" data-value="'+i+'" aria-label="'+i+' stars">★</button>':
 '<span class="gold">'+(i<=Math.round(n)?"★":"☆")+'</span>';return out+'</div>';}
function showComments(type,id){const cs=state.comments.filter(x=>type==="request"?x.request_id===id:x.product_id===id).sort((a,b)=>Date.parse(a.created_at)-Date.parse(b.created_at));
 return '<div class="pane"><h2>💬 '+tr("comments")+' ('+cs.length+')</h2>'+
 (cs.length?cs.map(c=>'<div class="comment"><div class="row space"><b>'+esc(who(c.author_id))+'</b><small>'+date(c.created_at)+'</small></div>'+
 (c.kind==="progress"?'<span class="badge">'+tr("progress")+'</span>':"")+'<p>'+esc(c.body)+'</p><div class="row">'+
 (state.user?.id===c.author_id?'<button class="ghost" data-action="edit-comment" data-id="'+c.id+'">'+tr("edit")+'</button><button class="ghost" data-action="delete" data-kind="comment" data-id="'+c.id+'">'+tr("delete")+'</button>':"")+
 '<button class="ghost" data-action="report" data-kind="comment" data-id="'+c.id+'">'+tr("report")+'</button></div></div>').join(""):
 '<p class="muted">'+tr("emptyComments")+'</p>')+
 '<form id="commentForm" class="form" data-kind="'+type+'" data-id="'+id+'"><label>'+tr("writeComment")+'<textarea name="body" maxlength="1500" minlength="2" required placeholder="'+tr("comment")+'"></textarea></label>'+
 (type==="request"&&state.participations.some(x=>x.request_id===id&&x.user_id===state.user?.id)?
 '<label>'+tr("status")+'<select name="kind"><option value="discussion">'+tr("discussion")+'</option><option value="progress">'+tr("progress")+'</option></select></label>':"")+
 '<button class="btn" type="submit" '+(!configured?'disabled':'')+'>'+tr("writeComment")+'</button></form></div>';
}
function showReviews(product){const m=counts("product",product.id);const reviews=state.reviews.filter(x=>x.product_id===product.id).sort((a,b)=>Date.parse(b.created_at)-Date.parse(a.created_at));
 const own=reviews.find(x=>x.author_id===state.user?.id);
 state.selectedStars=own?own.rating:5;
 return '<div class="pane"><h2>⭐ '+tr("reviews")+' ('+reviews.length+')</h2><div class="rating"><strong>'+val(m,"rating").toFixed(1)+'</strong> '+stars(val(m,"rating"),false)+'<span>'+val(m,"review_count")+'</span></div>'+
 (reviews.length?reviews.map(r=>'<div class="comment"><div class="row space"><b>'+esc(who(r.author_id))+'</b><small>'+date(r.created_at)+'</small></div>'+
 stars(r.rating,false)+'<p>'+esc(r.body)+'</p><div class="row">'+(state.user?.id===r.author_id?'<button class="ghost" data-action="delete" data-kind="review" data-id="'+r.id+'">'+tr("delete")+'</button>':"")+
 '<button class="ghost" data-action="report" data-kind="review" data-id="'+r.id+'">'+tr("report")+'</button></div></div>').join(""):'<p class="muted">'+tr("emptyReviews")+'</p>')+
 (state.user?.id===product.owner_id?'<div class="notice info">'+tr("ownerNoReview")+'</div>':
 '<div style="margin-top:22px"><h3>'+tr(own?"reviewUpdate":"writeReview")+'</h3><p class="muted">'+tr("reviewNotice")+'</p>'+
 '<form class="form" id="reviewForm" data-id="'+product.id+'"><label>'+tr("rating")+'</label>'+stars(own?own.rating:5,true)+
 '<label>'+tr("body")+'<textarea name="body" minlength="5" maxlength="1500" required>'+esc(own?.body||"")+'</textarea></label>'+
 '<label class="row"><input name="used" type="checkbox" required style="width:auto"> '+tr("confirmUsed")+'</label>'+
 '<button class="btn" type="submit" '+(!configured?'disabled':'')+'>'+tr(own?"reviewUpdate":"writeReview")+'</button></form></div>')+'</div>';
}
function details(type,id){const req=type==="request";const a=(req?state.requests:state.products).find(x=>x.id===id);
 if(!a)return '<div class="wrap content"><button class="back" data-action="go" data-path="'+(req?"requests":"showcase")+'">← '+tr("back")+'</button><div class="empty">'+tr("noData")+'</div></div>';
 const mine=state.user?.id===a.owner_id;const m=counts(type,id);
 const userVote=req?state.userReqVotes.some(x=>x.request_id===id):state.userProductVotes.find(x=>x.product_id===id)?.value||0;
 const myParticipation=state.participations.find(x=>x.request_id===id&&x.user_id===state.user?.id);
 const participated=!!myParticipation;
 const related=req?state.products.filter(x=>x.request_id===id):[];
 const pStatus=req?'<span class="badge">'+tr(a.status)+'</span>':"";
 return '<div class="wrap content"><button class="back" data-action="go" data-path="'+(req?"requests":"showcase")+'">← '+tr("back")+'</button>'+
 '<article class="detail"><div class="row"><span class="pill">'+cc(a.category)+'</span>'+pStatus+'<span class="hint">'+date(a.created_at)+' · '+esc(who(a.owner_id))+'</span></div>'+
 '<h1>'+esc(a.title)+'</h1>'+
 (!req&&a.tagline?'<p class="detail-tagline">'+esc(a.tagline)+'</p>':"")+
 (!req?productGallery(a):"")+
 '<h3>'+(!req?tr("promoDescription"):tr("description"))+'</h3><p>'+esc(a.description)+'</p>'+
 (!req?productHighlights(a):"")+
 (!req&&a.request_id?'<p class="hint">'+tr("linked")+': <button class="ghost" data-action="detail" data-kind="request" data-id="'+esc(a.request_id)+'">'+esc(state.requests.find(x=>x.id===a.request_id)?.title||tr("request"))+'</button></p>':"")+
 '<div class="detailbar"><div class="detailActions">'+
 (req?'<button class="counter '+(userVote?"active":"")+'" data-action="vote" data-kind="request" data-id="'+id+'" data-value="1">↑ '+tr("vote")+' '+val(m,"total")+'</button>'+
 '<button class="btn alt" data-action="join" data-id="'+id+'">'+tr(participated?"leave":"join")+' ('+state.participations.filter(x=>x.request_id===id).length+')</button>':
 '<button class="counter '+(userVote===1?"active":"")+'" data-action="vote" data-kind="product" data-id="'+id+'" data-value="1">↑ '+tr("up")+' '+val(m,"total")+'</button>'+
 '<button class="counter '+(userVote===-1?"active":"")+'" data-action="vote" data-kind="product" data-id="'+id+'" data-value="-1">↓ '+tr("down")+'</button>'+
 '<a class="btn" href="'+esc(a.url)+'" target="_blank" rel="noopener noreferrer nofollow">'+tr("use")+'</a>')+
 '</div><div class="detailActions">'+(mine?'<button class="btn alt" data-action="edit" data-kind="'+type+'" data-id="'+id+'">'+tr("edit")+'</button>'+
 '<button class="btn danger" data-action="delete" data-kind="'+type+'" data-id="'+id+'">'+tr("delete")+'</button>':"")+
 '<button class="ghost" data-action="report" data-kind="'+type+'" data-id="'+id+'">'+tr("report")+'</button></div></div>'+
 (req&&mine?'<div class="row" style="margin-top:17px"><label>'+tr("status")+' <select data-request-status="'+id+'">'+
 [["open","open"],["building","building"],["completed","completed"]].map(x=>'<option value="'+x[0]+'" '+(a.status===x[0]?"selected":"")+'>'+tr(x[1])+'</option>').join("")+'</select></label></div>':"")+
 '</article>'+
 (req&&related.length?'<section class="section"><h2>'+tr("linked")+'</h2>'+listBlock("product",related)+'</section>':"")+
 (req?'<div class="notice info">'+tr("builderNote")+'</div>':"")+
 '<section class="discussion">'+showComments(type,id)+(req?'<div class="pane"><h2>🛠️ '+tr("participants")+'</h2>'+
 (state.participations.filter(x=>x.request_id===id).map(x=>'<div class="comment"><div class="row space"><span>'+esc(who(x.user_id))+'</span>'+
 (x.user_id===state.user?.id?'<select aria-label="'+tr("status")+'" data-build-status="'+id+'"><option value="building" '+(x.status==="building"?"selected":"")+'>'+tr("building")+'</option><option value="completed" '+(x.status==="completed"?"selected":"")+'>'+tr("completed")+'</option></select>':'<span class="badge">'+tr(x.status)+'</span>')+'</div></div>').join("")||'<p class="muted">0</p>')+'</div>':showReviews(a))+'</section></div>';
}
function profilePage(){if(!state.user)return '<div class="wrap content"><div class="notice info">'+tr("loginPrompt")+'</div><button class="btn" data-action="login">'+tr("signIn")+'</button></div>';
 const id=state.user.id;return '<div class="wrap content">'+topSection(tr("yourProfile"),state.user.email||"",null)+
 '<div class="pane" style="margin-bottom:25px"><form class="form" id="profileForm"><label>'+tr("displayName")+
 '<input type="text" name="name" minlength="2" maxlength="40" required value="'+esc(state.profile?.display_name||"")+'"></label><div><button class="btn" type="submit">'+tr("profileSave")+'</button></div></form></div>'+
 '<section class="section"><h2>'+tr("myRequests")+'</h2>'+listBlock("request",state.requests.filter(x=>x.owner_id===id))+'</section>'+
 '<section class="section"><h2>'+tr("myProducts")+'</h2>'+listBlock("product",state.products.filter(x=>x.owner_id===id))+'</section>'+
 '<section class="section"><h2>'+tr("myReviews")+'</h2><div class="pane">'+(state.reviews.filter(x=>x.author_id===id).map(r=>
 '<div class="comment"><div class="row">'+stars(r.rating,false)+'<button class="ghost" data-action="detail" data-kind="product" data-id="'+r.product_id+'">'+
 esc(state.products.find(x=>x.id===r.product_id)?.title||tr("product"))+'</button></div><p>'+esc(r.body)+'</p></div>').join("")||'<p class="muted">'+tr("emptyMine")+'</p>')+'</div></section></div>';
}
function adminPage(){
 if(!state.user||!state.isModerator)return '<div class="wrap content"><div class="notice error">'+tr("loginNeeded")+'</div></div>';
 const reports=state.reports.filter(x=>x.status==="pending");
 return '<div class="wrap content">'+topSection(tr("admin"),tr("pendingReports")+" ("+reports.length+")",null)+
 (reports.length?'<div class="stack">'+reports.map(r=>{
 const n=r.target_kind==="product"?state.products.find(x=>x.id===r.target_id)?.title:
 r.target_kind==="request"?state.requests.find(x=>x.id===r.target_id)?.title:"";
 return '<article class="pane"><div class="row space"><span class="pill">'+esc(r.target_kind)+'</span><span class="hint">'+date(r.created_at)+'</span></div>'+
 '<h3>'+esc(n||r.target_kind+' '+r.target_id)+'</h3><p>'+esc(r.reason)+'</p><p class="hint">'+esc(who(r.reporter_id))+'</p><div class="row">'+
 '<button class="btn tiny alt" data-action="moderate" data-mode="resolve" data-report="'+r.id+'" data-kind="'+r.target_kind+'" data-id="'+r.target_id+'">'+tr("resolve")+'</button>'+
 '<button class="btn tiny danger" data-action="moderate" data-mode="restrict" data-report="'+r.id+'" data-kind="'+r.target_kind+'" data-id="'+r.target_id+'">'+
 tr(r.target_kind==="request"||r.target_kind==="product"?"hideAndResolve":"removeAndResolve")+'</button></div></article>';
 }).join("")+'</div>':'<div class="empty">'+tr("noReports")+'</div>')+'</div>';
}
async function moderatorAction(mode,kind,id,reportId){
 if(!requireLogin()||!state.isModerator)return;
 if(mode==="restrict"&&!confirm(tr("moderationConfirm")))return;
 try{
 if(mode==="restrict"){
  const table=kind==="request"?"requests":kind==="product"?"products":kind==="comment"?"comments":"reviews";
  const q=kind==="request"||kind==="product"?db.from(table).update({visibility:"hidden"}).eq("id",id):
    db.from(table).delete().eq("id",id);
  ensure(await q);
 }
 ensure(await db.from("reports").update({status:"resolved",resolved_at:new Date().toISOString(),resolved_by:state.user.id}).eq("id",reportId));
 await fetchData();toast(tr("saved"));
 }catch(e){showError(e);}
}

function render(){document.documentElement.lang=state.lang;nav();const p=page();const el=$("#app");
 document.title="MadePick · "+(p.name==="product"?state.products.find(x=>x.id===p.id)?.title||tr("showcase"):
 p.name==="request"?state.requests.find(x=>x.id===p.id)?.title||tr("requests"):tr(p.name));
 if(!state.ready){el.innerHTML='<div class="loading">'+tr("loading")+'</div>';return;}
 if(p.name==="home")el.innerHTML=home();
 else if(["requests","build","showcase","rankings"].includes(p.name))el.innerHTML=listing(p.name);
 else if(p.name==="request"||p.name==="product")el.innerHTML=details(p.name,p.id);
 else if(p.name==="profile")el.innerHTML=profilePage();
 else if(p.name==="admin")el.innerHTML=adminPage();
 else el.innerHTML=home();
}
async function fetchData(){if(!db){state.ready=true;render();return;}
 state.ready=false;render();
 try{
 const queries=await Promise.all([
 db.from("requests").select("*").eq("visibility","published").order("created_at",{ascending:false}).limit(250),
 db.from("products").select("*").eq("visibility","published").order("created_at",{ascending:false}).limit(250),
 db.from("profiles").select("id,display_name").limit(1000),
 db.from("build_participations").select("*").limit(1000),
 db.from("request_metrics").select("*").limit(250),
 db.from("product_metrics").select("*").limit(250),
 db.from("comments").select("*").order("created_at",{ascending:false}).limit(1000),
 db.from("reviews").select("*").order("created_at",{ascending:false}).limit(1000),
 state.user?db.from("request_votes").select("request_id").eq("user_id",state.user.id):Promise.resolve({data:[]}),
 state.user?db.from("product_votes").select("product_id,value").eq("user_id",state.user.id):Promise.resolve({data:[]}),
 state.user?db.from("profiles").select("id,display_name").eq("id",state.user.id).maybeSingle():Promise.resolve({data:null}),
 state.user?db.from("moderators").select("user_id").eq("user_id",state.user.id).maybeSingle():Promise.resolve({data:null})
 ]);
 const error=queries.find(x=>x.error)?.error;if(error)throw error;
 [state.requests,state.products,state.profiles,state.participations,state.reqMetrics,state.productMetrics,state.comments,state.reviews,state.userReqVotes,state.userProductVotes]=
 queries.slice(0,10).map(x=>x.data||[]);
 state.profile=queries[10].data||null;
 state.isModerator=!!queries[11].data;
 if(state.isModerator){const q=await db.from("reports").select("*").order("created_at",{ascending:false}).limit(200);
 if(q.error)throw q.error;state.reports=q.data||[];}else state.reports=[];
 state.error="";
 }catch(e){state.error=String(e?.message||e);console.error("MadePick data error",e);}
 state.ready=true;render();
}
async function init(){if(db){const {data,error}=await db.auth.getUser();if(error)console.warn(error);state.user=data?.user||null;
 db.auth.onAuthStateChange((_event,session)=>{const id=session?.user?.id||null;if(id!==state.user?.id){state.user=session?.user||null;setTimeout(fetchData,0);}});
 }await fetchData();}
function requireLogin(){if(!configured){toast(tr("connect"));return false;}if(!state.user){toast(tr("loginNeeded"));return false;}return true;}
async function google(){if(!configured)return toast(tr("connect"));const {error}=await db.auth.signInWithOAuth({
 provider:"google",options:{redirectTo:location.origin+location.pathname}
});if(error)showError(error);}
function modal(html){$("#dialogBody").innerHTML=html;$("#editor").showModal();}
function editForm(type,a){
 if(!requireLogin())return;
 const req=type==="request";if(a&&a.owner_id!==state.user.id)return;
 releasePhotoPreviews();
 state.gallery.keep=Array.isArray(a?.image_paths)?a.image_paths.slice():[];
 state.gallery.newFiles=[];
 const choices=state.requests.filter(x=>x.owner_id===state.user.id||state.participations.some(p=>p.request_id===x.id&&p.user_id===state.user.id));
 modal('<h2>'+tr(a?"edit":req?"submitIdea":"submitProduct")+'</h2><p class="muted">'+tr(req?"rdesc":"sdesc")+'</p>'+
 '<form id="postForm" class="form" data-kind="'+type+'" data-edit="'+(a?.id||"")+'">'+
 '<label>'+tr("title")+'<input name="title" required minlength="'+(req?3:2)+'" maxlength="120" value="'+esc(a?.title||"")+'"></label>'+
 (!req?'<label>'+tr("tagline")+'<input name="tagline" maxlength="160" placeholder="'+tr("taglineHelp")+'" value="'+esc(a?.tagline||"")+'"></label>':"")+
 '<label>'+tr(req?"description":"promoDescription")+'<textarea name="description" required minlength="10" maxlength="4000">'+esc(a?.description||"")+'</textarea></label>'+
 (!req?'<label>'+tr("highlights")+'<textarea name="highlights" maxlength="1500" placeholder="'+tr("highlightsHelp")+'">'+esc(a?.highlights||"")+'</textarea></label>':"")+
 '<label>'+tr("category")+'<select name="category">'+CATS.slice(1).map(x=>'<option value="'+x+'" '+((a?.category||"other")===x?"selected":"")+'>'+cc(x)+'</option>').join("")+'</select></label>'+
 (!req?'<label>'+tr("website")+'<input name="url" type="url" required maxlength="1900" placeholder="https://" value="'+esc(a?.url||"")+'"><small>'+tr("urlHelp")+'</small></label>'+
 '<label>'+tr("linkRequest")+'<select name="request_id"><option value="">'+tr("none")+'</option>'+choices.map(r=>
 '<option value="'+r.id+'" '+(a?.request_id===r.id?"selected":"")+'>'+esc(r.title)+'</option>').join("")+'</select></label>'+
 '<label>'+tr("photos")+' <span id="photoCount" class="photo-count">0/5</span>'+
 '<input id="photoInput" name="photoInput" type="file" accept="image/jpeg,image/png,image/webp" multiple><small class="photo-hint">'+tr("photosHelp")+'</small></label>'+
 '<div class="photo-preview" id="photoPreview"></div>':"")+
 '<div class="formActions"><button type="button" class="btn alt" data-action="close">'+tr("cancel")+'</button><button class="btn" type="submit">'+tr("save")+'</button></div></form>');
 if(!req)updatePhotoPreviews();
}
function editComment(id){if(!requireLogin())return;const c=state.comments.find(x=>x.id===id);if(!c||c.author_id!==state.user.id)return;
 modal('<h2>'+tr("edit")+'</h2><form id="editCommentForm" class="form" data-id="'+id+'"><label>'+tr("body")+
 '<textarea name="body" minlength="2" maxlength="1500" required>'+esc(c.body)+'</textarea></label><div class="formActions"><button class="btn alt" type="button" data-action="close">'+tr("cancel")+'</button><button class="btn" type="submit">'+tr("save")+'</button></div></form>');
}
async function act(run){if(!requireLogin())return;try{await run();await fetchData();toast(tr("saved"));}catch(e){showError(e);}}
function ensure(result){if(result.error)throw result.error;return result.data;}
async function savePost(form){if(!requireLogin())return;const data=new FormData(form),type=form.dataset.kind,req=type==="request",edit=form.dataset.edit;
 const title=String(data.get("title")||"").trim(),description=String(data.get("description")||"").trim(),category=String(data.get("category")||"other");
 if(title.length<(req?3:2)||title.length>120||description.length<10||description.length>4000)throw Error(tr("failed"));
 const row={title,description,category};
 if(!req){const url=String(data.get("url")||"").trim();let parsed;try{parsed=new URL(url);if(parsed.protocol!=="https:")throw Error();}catch(e){throw Error(tr("invalidUrl"));}row.url=parsed.href;row.request_id=data.get("request_id")||null;}
 const table=req?"requests":"products";
 if(edit)ensure(await db.from(table).update(row).eq("id",edit).eq("owner_id",state.user.id));
 else ensure(await db.from(table).insert({...row,owner_id:state.user.id}));
 $("#editor").close();await fetchData();toast(tr("saved"));go(req?"requests":"showcase");
}
async function saveComment(form){if(!requireLogin())return;const data=new FormData(form),body=String(data.get("body")||"").trim();
 if(body.length<2||body.length>1500)throw Error(tr("failed"));
 const req=form.dataset.kind==="request";const row={author_id:state.user.id,body,kind:data.get("kind")==="progress"?"progress":"discussion"};
 row[req?"request_id":"product_id"]=form.dataset.id;
 ensure(await db.from("comments").insert(row));form.reset();await fetchData();toast(tr("saved"));}
async function saveReview(form){if(!requireLogin())return;const product=state.products.find(x=>x.id===form.dataset.id);
 if(!product||state.user.id===product.owner_id)throw Error(tr("ownerNoReview"));
 const data=new FormData(form),body=String(data.get("body")||"").trim(),rating=Number(state.selectedStars||5);
 if(!data.get("used")||body.length<5||body.length>1500||rating<1||rating>5)throw Error(tr("failed"));
 const own=state.reviews.find(x=>x.product_id===product.id&&x.author_id===state.user.id);
 if(own)ensure(await db.from("reviews").update({body,rating}).eq("id",own.id).eq("author_id",state.user.id));
 else ensure(await db.from("reviews").insert({author_id:state.user.id,product_id:product.id,body,rating}));
 await fetchData();toast(tr("saved"));}
async function vote(type,id,value){await act(async()=>{const req=type==="request",table=req?"request_votes":"product_votes",key=req?"request_id":"product_id";
 const row=req?state.userReqVotes.find(x=>x.request_id===id):state.userProductVotes.find(x=>x.product_id===id);
 if(row&&(req||row.value===value))ensure(await db.from(table).delete().eq(key,id).eq("user_id",state.user.id));
 else if(row)ensure(await db.from(table).update({value}).eq(key,id).eq("user_id",state.user.id));
 else ensure(await db.from(table).insert({...{[key]:id},user_id:state.user.id,...(req?{}:{value})}));});}
async function join(id){await act(async()=>{const own=state.participations.find(x=>x.request_id===id&&x.user_id===state.user.id);
 if(own)ensure(await db.from("build_participations").delete().eq("request_id",id).eq("user_id",state.user.id));
 else ensure(await db.from("build_participations").insert({request_id:id,user_id:state.user.id}));});}
async function remove(kind,id){if(!requireLogin()||!confirm(tr("confirmDelete")))return;const map={request:"requests",product:"products",comment:"comments",review:"reviews"};const table=map[kind];if(!table)return;
 await act(async()=>{ensure(await db.from(table).delete().eq("id",id).eq(kind==="comment"||kind==="review"?"author_id":"owner_id",state.user.id));});
 const p=page();if(p.name===kind&&p.id===id)go(kind==="request"?"requests":"showcase");}
async function report(kind,id){if(!requireLogin())return;const reason=prompt(tr("reportReason"));if(reason===null)return;
 if(reason.trim().length<5||reason.length>500)return toast(tr("reportReason"));
 try{ensure(await db.from("reports").insert({reporter_id:state.user.id,target_kind:kind,target_id:id,reason:reason.trim()}));toast(tr("reported"));}
 catch(e){showError(e);}}
async function handleClick(event){const target=event.target.closest("[data-action]");if(!target)return;
 const a=target.dataset.action,id=target.dataset.id,kind=target.dataset.kind;
 if(a==="go")return navigate(target.dataset.path);
 if(a==="detail")return go(kind+"/"+id);
 if(a==="lang"){state.lang=state.lang==="ko"?"en":"ko";localStorage.setItem("madepick-lang",state.lang);return render();}
 if(a==="login")return google();
 if(a==="logout"){if(db){const {error}=await db.auth.signOut();if(error)showError(error);else{state.user=null;state.profile=null;await fetchData();go("home");}}return;}
 if(a==="new")return editForm(kind,null);
 if(a==="edit")return editForm(kind,(kind==="request"?state.requests:state.products).find(x=>x.id===id));
 if(a==="edit-comment")return editComment(id);
 if(a==="close"){return $("#editor").close();}
 if(a==="stars"){state.selectedStars=Number(target.dataset.value);$("#reviewForm .stars").innerHTML=stars(state.selectedStars,true).replace(/^<div class="stars"[^>]*>|<\/div>$/g,"");return;}
 if(a==="vote")return vote(kind,id,Number(target.dataset.value));
 if(a==="join")return join(id);
 if(a==="delete")return remove(kind,id);
 if(a==="report")return report(kind,id);
 if(a==="moderate")return moderatorAction(target.dataset.mode,kind,id,target.dataset.report);
}
async function handleSubmit(event){const form=event.target;if(!["postForm","commentForm","reviewForm","profileForm","editCommentForm"].includes(form.id))return;
 event.preventDefault();const btn=form.querySelector('[type="submit"]');if(btn)btn.disabled=true;
 try{
 if(form.id==="postForm")await savePost(form);
 if(form.id==="commentForm")await saveComment(form);
 if(form.id==="reviewForm")await saveReview(form);
 if(form.id==="profileForm"){if(!requireLogin())return;const name=String(new FormData(form).get("name")||"").trim();
 if(name.length<2||name.length>40)throw Error(tr("failed"));ensure(await db.from("profiles").update({display_name:name}).eq("id",state.user.id));await fetchData();toast(tr("saved"));}
 if(form.id==="editCommentForm"){const body=String(new FormData(form).get("body")||"").trim();if(body.length<2||body.length>1500)throw Error(tr("failed"));
 ensure(await db.from("comments").update({body}).eq("id",form.dataset.id).eq("author_id",state.user.id));$("#editor").close();await fetchData();toast(tr("saved"));}
 }catch(e){showError(e);}finally{if(btn?.isConnected)btn.disabled=false;}
}
document.addEventListener("click",handleClick);
document.addEventListener("submit",handleSubmit);
document.addEventListener("input",e=>{if(e.target.id==="q"){state.search=e.target.value;const slot=$("#listingResults");if(slot)slot.innerHTML=page().name==="rankings"?rankings():listResults(page().name==="showcase"?"product":"request");}});
document.addEventListener("change",async e=>{
 if(e.target.id==="cat"||e.target.id==="order"||e.target.id==="period"){
 state.category=$("#cat").value;state.order=$("#order").value;state.period=$("#period").value;const slot=$("#listingResults");
 if(slot)slot.innerHTML=page().name==="rankings"?rankings():listResults(page().name==="showcase"?"product":"request");
 }
 if(e.target.matches("[data-build-status]")){
 if(!requireLogin())return;const id=e.target.dataset.buildStatus,status=e.target.value;
 try{ensure(await db.from("build_participations").update({status}).eq("request_id",id).eq("user_id",state.user.id));await fetchData();toast(tr("saved"));}catch(err){showError(err);}return;
 }
 if(e.target.matches("[data-request-status]")){
 if(!requireLogin())return;const id=e.target.dataset.requestStatus, status=e.target.value;
 try{ensure(await db.from("requests").update({status}).eq("id",id).eq("owner_id",state.user.id));await fetchData();toast(tr("saved"));}catch(err){showError(err);}}
});
$("#closeDialog").addEventListener("click",()=>$("#editor").close());
window.addEventListener("hashchange",()=>{state.search="";state.category="all";render();});
state.selectedStars=5;
init().catch(e=>{state.error=e?.message||String(e);state.ready=true;render();});
