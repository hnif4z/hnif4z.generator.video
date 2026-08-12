const $=id=>document.getElementById(id);
let imageFile=null, audioOn=true, voiceOn=true, jobId=null;
$("image").onchange=e=>{imageFile=e.target.files[0]; if(imageFile){$("thumb").src=URL.createObjectURL(imageFile);$("thumb").hidden=false;$("replace").hidden=false}};
$("replace").onclick=()=>{$("image").click()};
document.querySelectorAll("[data-toggle]").forEach(b=>b.onclick=()=>{const k=b.dataset.toggle;if(k==="audio")audioOn=!audioOn;else voiceOn=!voiceOn;b.textContent=(k==="audio"?"Audio: ":"Voice Over: ")+(k==="audio"?audioOn:voiceOn?"ON":"OFF")});
async function postForm(url, extra={}){
  const fd=new FormData(); if(imageFile)fd.append("image",imageFile); fd.append("description",$("description").value);
  Object.entries(extra).forEach(([k,v])=>fd.append(k,v));
  const r=await fetch(url,{method:"POST",body:fd}); const d=await r.json().catch(()=>({}));
  if(!r.ok) throw new Error(d.error||"Permintaan gagal.");
  return d;
}
$("analyze").onclick=async()=>{try{if(!imageFile)throw Error("Upload gambar produk terlebih dahulu.");$("status").textContent="Menganalisis produk...";const d=await postForm("/api/analyze-product");$("status").textContent=d.analysis||"Analisis selesai."}catch(e){$("status").textContent=e.message}};
$("makeScript").onclick=async()=>{try{if(!imageFile)throw Error("Upload gambar produk terlebih dahulu.");$("status").textContent="Membuat script...";const d=await postForm("/api/generate-script",{duration:$("duration").value,language:$("language").value,tone:$("tone").value});$("script").value=d.script||"";$("status").textContent="Script selesai."}catch(e){$("status").textContent=e.message}};
$("generate").onclick=async()=>{try{if(!imageFile)throw Error("Upload gambar produk terlebih dahulu.");$("generate").disabled=true;$("status").textContent="Menyiapkan produk...";const d=await postForm("/api/generate-video",{script:$("script").value,duration:$("duration").value,audio:audioOn,voiceOver:voiceOn,voice:$("voice").value,tone:$("tone").value,language:$("language").value});jobId=d.jobId;if(!jobId)throw Error("Video provider tidak mengembalikan job ID.");poll()}catch(e){$("status").textContent=e.message;$("generate").disabled=false}};
async function poll(){try{const r=await fetch("/api/video-status/"+encodeURIComponent(jobId));const d=await r.json();if(!r.ok)throw Error(d.error||"Gagal memeriksa status video.");$("status").textContent=d.message||("Status: "+d.status);if(d.status==="completed"&&d.videoUrl){$("video").src=d.videoUrl;$("video").style.display="block";$("empty").style.display="none";$("download").href=d.videoUrl;$("download").download="product-video-ads.mp4";$("download").hidden=false;$("again").hidden=false;$("generate").disabled=false;$("status").textContent="Video selesai."}else if(d.status==="failed"){throw Error(d.error||"Video gagal dibuat.")}else setTimeout(poll,3000)}catch(e){$("status").textContent=e.message;$("generate").disabled=false}}
$("again").onclick=()=>{$("download").hidden=true;$("again").hidden=true;$("video").removeAttribute("src");$("video").style.display="none";$("empty").style.display="grid";$("status").textContent=""};
