
async function generateCaptions(){

    const topic =
    document.getElementById("topic").value;

    const style =
    document.getElementById("style").value;

    const output =
    document.getElementById("caption-output");

    const loading =
    document.getElementById("caption-loading");

    if(topic.trim() === ""){

        showToast("Enter topic");

        return;
    }

    loading.classList.remove("hidden");

    output.innerHTML = "";

    try{

        const response = await fetch(
            "/generate-caption",
            {
                method:"POST",

                headers:{
                    "Content-Type":"application/json"
                },

                body:JSON.stringify({
                    topic,
                    style
                })
            }
        );

        const data = await response.json();

        loading.classList.add("hidden");

        if(data.success){

            output.innerHTML = `
            <div class="caption-result">
            ${formatCaptions(data.captions)}
            </div>
            `;

            updateCounts(data.captions);

        }else{

            output.innerHTML =
            `<p>${data.message}</p>`;
        }

    }catch(error){

        loading.classList.add("hidden");

        output.innerHTML =
        `<p>Something went wrong.</p>`;
    }

}

function formatCaptions(text){

    return text
    .replace(/\n/g,"<br>");
}

function copyCaptions(){

    const output =
    document.getElementById("caption-output").innerText;

    navigator.clipboard.writeText(output);

    showToast("Copied Successfully 🚀");
}

function clearCaptionForm(){

    document.getElementById("topic").value = "";

    document.getElementById("caption-output").innerHTML = "";

    updateCounts("");
}

function downloadCaptions(){

    const text =
    document.getElementById("caption-output").innerText;

    const blob = new Blob(
        [text],
        {type:"text/plain"}
    );

    const link =
    document.createElement("a");

    link.href =
    URL.createObjectURL(blob);

    link.download =
    "captions.txt";

    link.click();
}

function updateCounts(text){

    document.getElementById("char-count").innerText =
    text.length;

    document.getElementById("word-count").innerText =
    text.split(/\s+/).length;
}

function showToast(message){

    const toast =
    document.getElementById("toast");

    toast.innerText = message;

    toast.classList.add("show");

    setTimeout(()=>{

        toast.classList.remove("show");

    },3000);
}
