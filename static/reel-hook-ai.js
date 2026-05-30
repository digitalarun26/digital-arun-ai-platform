

async function generateHooks(){

    const niche =
    document.getElementById("niche").value;

    const output =
    document.getElementById("hook-output");

    const loading =
    document.getElementById("hook-loading");

    if(niche.trim() === ""){

        showToast(
            "Enter niche/topic"
        );

        return;
    }

    loading.classList.remove(
        "hidden"
    );

    output.innerHTML = "";

    try{

        const response = await fetch(
            "/generate-reel-hooks",
            {
                method:"POST",

                headers:{
                    "Content-Type":
                    "application/json"
                },

                body:JSON.stringify({
                    niche
                })
            }
        );

        const data =
        await response.json();

        loading.classList.add(
            "hidden"
        );

        if(data.success){

            output.innerHTML = `
            <div class="hook-result">
            ${formatHooks(data.hooks)}
            </div>
            `;

            updateCounts(data.hooks);

        }else{

            output.innerHTML =
            `<p>${data.message}</p>`;
        }

    }catch(error){

        loading.classList.add(
            "hidden"
        );

        output.innerHTML =
        `<p>Something went wrong</p>`;
    }

}

function formatHooks(text){

    return text.replace(
        /\n/g,
        "<br>"
    );
}

function copyHooks(){

    const text =
    document.getElementById(
        "hook-output"
    ).innerText;

    navigator.clipboard.writeText(
        text
    );

    showToast(
        "Copied Successfully 🚀"
    );
}

function clearHooks(){

    document.getElementById(
        "niche"
    ).value = "";

    document.getElementById(
        "hook-output"
    ).innerHTML = "";

    updateCounts("");
}

function downloadHooks(){

    const text =
    document.getElementById(
        "hook-output"
    ).innerText;

    const blob = new Blob(
        [text],
        {type:"text/plain"}
    );

    const link =
    document.createElement("a");

    link.href =
    URL.createObjectURL(blob);

    link.download =
    "reel-hooks.txt";

    link.click();
}

function updateCounts(text){

    document.getElementById(
        "char-count"
    ).innerText = text.length;

    document.getElementById(
        "word-count"
    ).innerText =
    text.split(/\s+/).length;
}

function showToast(message){

    const toast =
    document.getElementById(
        "toast"
    );

    toast.innerText = message;

    toast.classList.add("show");

    setTimeout(()=>{

        toast.classList.remove(
            "show"
        );

    },3000);
}
