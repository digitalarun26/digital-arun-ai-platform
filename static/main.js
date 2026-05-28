gsap.from(".hero-title",{

y:-100,
opacity:0,
duration:1

});

function searchTools(){

    const input =
    document.getElementById(
        "toolSearch"
    ).value.toLowerCase();

    const cards =
    document.querySelectorAll(
        ".tool-card"
    );

    cards.forEach(card => {

        const toolName =
        card.getAttribute(
            "data-tool"
        ).toLowerCase();

        if(toolName.includes(input)){

            card.style.display =
            "flex";
        }

        else{

            card.style.display =
            "none";
        }

    });

}