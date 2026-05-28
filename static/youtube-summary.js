gsap.from(".yt-title",{

    y:-100,
    opacity:0,
    duration:1

});

async function generateSummary(){

    const youtube_url =
    document.getElementById("youtube_url").value;

    const loading =
    document.getElementById("loading");

    const dashboard =
    document.getElementById("dashboard");

    loading.classList.remove("hidden");

    dashboard.classList.add("hidden");

    try{

        const response = await fetch(
            "/generate-summary",
            {
                method:"POST",

                headers:{
                    "Content-Type":"application/json"
                },

                body:JSON.stringify({
                    youtube_url
                })
            }
        );

        const data = await response.json();

        console.log(data);

        loading.classList.add("hidden");

        // HANDLE BACKEND ERROR

        if(data.result){

            alert(data.result);

            return;
        }

        dashboard.classList.remove("hidden");

        // SHORT SUMMARY

        document.getElementById(
            "short-summary"
        ).innerHTML =

        `
        <div class="ai-result-card">

        <div class="result-top">

        <h2>🧠 Short Summary</h2>

        <button onclick="copyText(\`${data.short_summary}\`)">
        Copy
        </button>

        </div>

        <p>
        ${data.short_summary}
        </p>

        </div>
        `;

        // DETAILED SUMMARY

        document.getElementById(
            "detailed-summary"
        ).innerHTML =

        `
        <div class="ai-result-card">

        <div class="result-top">

        <h2>📖 Detailed Summary</h2>

        <button onclick="copyText(\`${data.detailed_summary}\`)">
        Copy
        </button>

        </div>

        <p>
        ${data.detailed_summary}
        </p>

        </div>
        `;

        // KEY POINTS

        let keyPointsHTML = `
        <div class="ai-result-card">

        <div class="result-top">

        <h2>📌 Key Points</h2>

        </div>

        <ul>
        `;

        data.key_points.forEach(point=>{

            keyPointsHTML += `
            <li>${point}</li>
            `;

        });

        keyPointsHTML += `
        </ul>
        </div>
        `;

        document.getElementById(
            "key-points"
        ).innerHTML = keyPointsHTML;

        // ACTION ITEMS

        let actionHTML = `
        <div class="ai-result-card">

        <div class="result-top">

        <h2>🚀 Action Items</h2>

        </div>

        <ul>
        `;

        data.action_items.forEach(action=>{

            actionHTML += `
            <li>${action}</li>
            `;

        });

        actionHTML += `
        </ul>
        </div>
        `;

        document.getElementById(
            "action-items"
        ).innerHTML = actionHTML;

    }

    catch(error){

        console.log(error);

        loading.classList.add("hidden");

        alert("Something went wrong");

    }

}

function showTab(tab){

    document.querySelectorAll(
        ".tab-content"
    ).forEach(content=>{

        content.classList.remove("active");

    });

    document.getElementById(tab)
    .classList.add("active");

}

function copyText(text){

    navigator.clipboard.writeText(text);

    alert("Copied Successfully!");

}