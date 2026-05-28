async function generateEmail(){

    const purpose =
    document.getElementById("purpose").value;

    const tone =
    document.getElementById("tone").value;

    const recipient =
    document.getElementById("recipient").value;

    const points =
    document.getElementById("points").value;

    const output =
    document.getElementById("output");

    const loading =
    document.getElementById("loading");

    loading.classList.remove("hidden");

    output.value = "";

    try{

        const response = await fetch(
            "/generate-email",
            {
                method:"POST",

                headers:{
                    "Content-Type":"application/json"
                },

                body:JSON.stringify({
                    purpose,
                    tone,
                    recipient,
                    points
                })
            }
        );

        const data = await response.json();

        loading.classList.add("hidden");

        output.value = data.email;

    }

    catch(error){

        loading.classList.add("hidden");

        output.value =
        "Something went wrong.";

    }

}

function copyEmail(){

    const output =
    document.getElementById("output");

    output.select();

    document.execCommand("copy");

    alert("Email Copied Successfully!");

}