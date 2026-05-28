// async function generateNotes(){

//     const transcript =
//     document.getElementById("transcript").value;

//     const output =
//     document.getElementById("voice-output");

//     const loading =
//     document.getElementById("voice-loading");

//     loading.classList.remove("hidden");

//     output.value = "";

//     try{

//         const response = await fetch(
//             "/generate-notes",
//             {
//                 method:"POST",

//                 headers:{
//                     "Content-Type":"application/json"
//                 },

//                 body:JSON.stringify({
//                     transcript
//                 })
//             }
//         );

//         const data = await response.json();

//         loading.classList.add("hidden");

//         output.value = data.notes;

//     }

//     catch(error){

//         loading.classList.add("hidden");

//         output.value =
//         "Something went wrong.";

//     }

// }

// function copyNotes(){

//     const output =
//     document.getElementById("voice-output");

//     output.select();

//     document.execCommand("copy");

//     alert("Notes Copied!");

// }

async function generateNotes(){

    const transcript =
    document.getElementById("transcript").value;

    const audioFile =
    document.getElementById("audioFile").files[0];

    const output =
    document.getElementById("voice-output");

    const loading =
    document.getElementById("voice-loading");

    loading.classList.remove("hidden");

    output.value = "";

    try{

        const formData = new FormData();

        // TRANSCRIPT

        formData.append(
            "transcript",
            transcript
        );

        // AUDIO FILE

        if(audioFile){

            formData.append(
                "audio",
                audioFile
            );

            console.log("Audio file added");
        }

        const response = await fetch(
            "/generate-notes",
            {
                method:"POST",
                body:formData
            }
        );

        const data = await response.json();

        console.log(data);

        loading.classList.add("hidden");

       output.innerHTML = `
<div class="notes-content">

${data.notes}

</div>
`;

    }

    catch(error){

        console.log(error);

        loading.classList.add("hidden");

        output.value =
        "Something went wrong.";

    }

}

function formatNotes(text){

    return text

    // Remove markdown stars
    .replace(/\*\*\*/g, "")

    // H1
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')

    // H2
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')

    // H3
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')

    // Bold text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')

    // Bullet points
    .replace(/^\* (.*$)/gim, '<li>$1</li>')

    // Line breaks
    .replace(/\n/g, '<br>');
}

function copyNotes(){

    const output =
    document.getElementById("voice-output");

    const text =
    output.innerText;

    navigator.clipboard.writeText(text);

    alert("Notes Copied!");

}