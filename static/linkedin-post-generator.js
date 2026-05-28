
async function generateLinkedInPost(){

    const topic =
    document.getElementById("topic").value;

    const audience =
    document.getElementById("audience").value;

    const tone =
    document.getElementById("tone").value;

    const length =
    document.getElementById("length").value;

    const cta =
    document.getElementById("cta").value;

    const hashtags =
    document.getElementById("hashtags").value;

    const loading =
    document.getElementById("linkedin-loading");

    const output =
    document.getElementById("linkedin-output");

    loading.classList.remove("hidden");

    output.innerHTML = "";

    try{

        const response = await fetch(
            "/generate-linkedin-post",
            {
                method:"POST",

                headers:{
                    "Content-Type":"application/json"
                },

                body:JSON.stringify({
                    topic,
                    audience,
                    tone,
                    length,
                    cta,
                    hashtags
                })
            }
        );

        const data = await response.json();

        loading.classList.add("hidden");

        typeWriterEffect(data.post);

        updateStats(data.post);

        saveHistory(data.post);

    }

    catch(error){

        loading.classList.add("hidden");

        output.innerHTML =
        "Something went wrong.";

    }

}

function typeWriterEffect(text){

    const output =
    document.getElementById("linkedin-output");

    output.innerHTML = "";

    let i = 0;

    const speed = 10;

    function typing(){

        if(i < text.length){

            output.innerHTML += text.charAt(i);

            i++;

            setTimeout(typing, speed);
        }
    }

    typing();
}

function copyLinkedInPost(){

    const text =
    document.getElementById(
        "linkedin-output"
    ).innerText;

    navigator.clipboard.writeText(text);

    showToast();
}

function downloadLinkedInPost(){

    const text =
    document.getElementById(
        "linkedin-output"
    ).innerText;

    const blob =
    new Blob([text], {
        type:"text/plain"
    });

    const link =
    document.createElement("a");

    link.href =
    URL.createObjectURL(blob);

    link.download =
    "linkedin-post.txt";

    link.click();
}

function clearLinkedInForm(){

    document.getElementById("topic").value = "";
    document.getElementById("audience").value = "";
    document.getElementById("hashtags").value = "";

    document.getElementById(
        "linkedin-output"
    ).innerHTML = "";
}

function updateStats(text){

    document.getElementById(
        "char-count"
    ).innerText =
    `Characters: ${text.length}`;

    const words =
    text.split(/\s+/).length;

    document.getElementById(
        "word-count"
    ).innerText =
    `Words: ${words}`;

    const reading =
    Math.ceil(words / 200);

    document.getElementById(
        "reading-time"
    ).innerText =
    `Reading Time: ${reading} min`;
}

function showToast(){

    const toast =
    document.getElementById("toast");

    toast.classList.add("show");

    setTimeout(()=>{

        toast.classList.remove("show");

    },3000);
}

function saveHistory(post){

    let history =
    JSON.parse(
        localStorage.getItem(
            "linkedinHistory"
        )
    ) || [];

    history.unshift(post);

    localStorage.setItem(
        "linkedinHistory",
        JSON.stringify(history)
    );
}

document.addEventListener(
    "keydown",
    function(e){

        if(e.ctrlKey && e.key === "Enter"){

            generateLinkedInPost();
        }
    }
);

