const topicInput = document.getElementById("videoTopic");

topicInput.addEventListener("input", () => {

document.getElementById("charCount").innerText =
topicInput.value.length;

document.getElementById("wordCount").innerText =
topicInput.value.trim().split(/\s+/).filter(Boolean).length;

});

async function generateTitles() {

const topic =
document.getElementById("videoTopic").value;

const category =
document.getElementById("videoCategory").value;

const style =
document.getElementById("titleStyle").value;

const output =
document.getElementById("titlesOutput");

const loader =
document.getElementById("titleLoading");

if(!topic){

showToast("Please enter topic");

return;
}

loader.classList.remove("hidden");

output.innerHTML = "";

try{

const response = await fetch("/generate-youtube-titles",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
topic,
category,
style
})

});

const data = await response.json();

loader.classList.add("hidden");

if(data.success){

output.innerHTML = formatTitles(data.titles);

}else{

output.innerHTML =
`<p>${data.error}</p>`;
}

}catch(error){

loader.classList.add("hidden");

output.innerHTML =
`<p>Something went wrong.</p>`;
}

}

function formatTitles(text){

const lines = text.split("\n");

let html = "";

lines.forEach(line => {

if(line.trim() !== ""){

html += `
<div class="single-title-card">

${line}

<button onclick="copySingleTitle(this)">
Copy
</button>

</div>
`;
}

});

return html;
}

function copyTitles(){

const text =
document.getElementById("titlesOutput").innerText;

navigator.clipboard.writeText(text);

showToast("Titles copied");
}

function copySingleTitle(button){

const text =
button.parentElement.innerText.replace("Copy","");

navigator.clipboard.writeText(text);

showToast("Title copied");
}

function clearTitles(){

document.getElementById("videoTopic").value = "";
document.getElementById("videoCategory").value = "";

document.getElementById("titlesOutput").innerHTML =
"Your AI generated YouTube titles will appear here...";

document.getElementById("charCount").innerText = "0";
document.getElementById("wordCount").innerText = "0";
}

function downloadTitles(){

const text =
document.getElementById("titlesOutput").innerText;

const blob =
new Blob([text], { type:"text/plain" });

const link =
document.createElement("a");

link.href =
URL.createObjectURL(blob);

link.download =
"youtube-titles.txt";

link.click();
}

function showToast(message){

const toast =
document.getElementById("toast");

toast.innerText = message;

toast.classList.add("show");

setTimeout(() => {

toast.classList.remove("show");

},3000);

}