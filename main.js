async function getData() {
    const word = document.querySelector("input").value.trim().toLowerCase();
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    const data = await res.json();
    return data;
}

function changeFont(value) {
    document.body.style.fontFamily = `${value}`;

}

const fonts = document.querySelectorAll(".fonts ul li");
fonts.forEach(li => {
    li.addEventListener("click", function() {
        let value = this.dataset.font;
        changeFont(value);
    });
});

const form = document.forms[0];
const originalWord = document.querySelector(".phonems h2");
const phonems = document.querySelector(".phonems p");
const audio = document.querySelector("audio");
const playSound = document.querySelector(".sound button"); 
const nounMeaning = document.querySelector(".all-meaning-noun");
const verbMeaning = document.querySelector(".all-meaning-verb");
const synonymsContainer = document.querySelector('.synonyms .synonyms-container');
form.addEventListener("submit", async function(e) {
    e.preventDefault();
    try {
        const data = await getData();
        originalWord.textContent = data[0]['word'];
        phonems.textContent = data[0]['phonetic'];
        const sounds = data[0]['phonetics'];
        for (let so of sounds) {
            if (so['audio']) {
                audio.src = so['audio'];
                break;
            }
        }
        playSound.addEventListener("click", function() {
            audio.play();
        });

        // noun meaning
        const nouns = data[0]['meanings'][0]['definitions'][0]['definition'];
        const verbs = data[0]['meanings'][1]['definitions'];
        const synonyms = data[0]['meanings'][1]['synonyms'];

        nounMeaning.innerHTML = `
        <div class="meaning">
            <div class="dot"></div>
            <p>${nouns}</p>
        </div>
    `;
        verbs.forEach(verb => {
            verbMeaning.innerHTML += `
            <div class="meaning">
                <div class="dot"></div>
                <p>${verb['definition']}</p>
            </div>
            `
        });
        synonyms.forEach((syn, i) => {
            if (i < synonyms.length - 1) {
                synonymsContainer.innerHTML += `<span>${syn}</span>,`;
            } else {
                synonymsContainer.innerHTML += `<span>${syn}</span>`;
            }
        });
    } catch (err) {
        return;
    }
});


// Handle theme
const darkTheme = document.querySelector(".bullet-container .dark-btn");
const lightTheme = document.querySelector(".bullet-container .light-btn");
darkTheme.addEventListener("click", function() {
    this.style.opacity = "1";
    lightTheme.style.opacity = "0";
    document.body.className = "dark";
});
lightTheme.addEventListener("click", function() {
    this.style.opacity = "1";
    darkTheme.style.opacity = "0";
    document.body.className = "light";
});
