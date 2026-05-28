let lastGrammarText = "";

const grammarInput =
document.getElementById(
    "grammarInput"
);

const charCount =
document.getElementById(
    "charCount"
);

const wordCount =
document.getElementById(
    "wordCount"
);

grammarInput.addEventListener(
    "input",
    updateCounts
);

function updateCounts(){

    const text =
    grammarInput.value;

    charCount.innerText =
    `${text.length} Characters`;

    const words =
    text.trim() === ""
    ? 0
    : text.trim().split(/\s+/).length;

    wordCount.innerText =
    `${words} Words`;
}

async function fixGrammar(){

    const text =
    grammarInput.value;

    const output =
    document.getElementById(
        "grammar-output"
    );

    const loading =
    document.getElementById(
        "grammar-loading"
    );

    if(!text){

        showToast(
            "Please enter text."
        );

        return;
    }

    lastGrammarText = text;

    loading.classList.remove(
        "hidden"
    );

    output.innerHTML = "";

    try{

        const response =
        await fetch(
            "/fix-grammar",
            {
                method:"POST",

                headers:{
                    "Content-Type":
                    "application/json"
                },

                body:JSON.stringify({
                    text
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
            <div class="grammar-result-card">

            <h2>
            ✨ AI Grammar Result
            </h2>

            <div class="grammar-result-content">
            ${formatResult(data.result)}
            </div>

            </div>
            `;

        }

        else{

            output.innerHTML =
            `<p>${data.message}</p>`;
        }

    }

    catch(error){

        loading.classList.add(
            "hidden"
        );

        output.innerHTML =
        "Something went wrong.";
    }
}

function formatResult(text){

    return text
    .replace(/\n/g,"<br>");
}

function clearGrammar(){

    grammarInput.value = "";

    updateCounts();

    document.getElementById(
        "grammar-output"
    ).innerHTML = "";
}

function copyGrammar(){

    const output =
    document.getElementById(
        "grammar-output"
    ).innerText;

    navigator.clipboard.writeText(
        output
    );

    showToast(
        "Copied Successfully"
    );
}

function regenerateGrammar(){

    grammarInput.value =
    lastGrammarText;

    fixGrammar();
}

function downloadGrammar(){

    const text =
    document.getElementById(
        "grammar-output"
    ).innerText;

    const blob =
    new Blob([text],{
        type:"text/plain"
    });

    const link =
    document.createElement("a");

    link.href =
    URL.createObjectURL(blob);

    link.download =
    "grammar-result.txt";

    link.click();
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

document.addEventListener(
    "keydown",
    function(e){

        if(
            e.ctrlKey &&
            e.key === "Enter"
        ){

            fixGrammar();
        }
    }
);