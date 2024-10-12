//url
const baseURL = "https://api.dictionaryapi.dev/api/v2/entries/en";

//đúc ra class chuyên gửi request
class Http {
    get(url) {
        return fetch(url)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error();
                };
            });
    };
};

//class Store đúc ra instance có chức năng lấy dữ liệu và xử lí nó
class Store {
    constructor() {
        this.http = new Http();
    };

    getWordInfor(word) {
        return this.http.get(`${baseURL}/${word}`);
    };
}

//class RenderUI chuyên lấy dữ liệu và hiện lên ui

class RenderUI {
    renderWordInfor(wordInfor) {
        const tmp = wordInfor[0];
        const name = tmp.word;
        const detail = (tmp.meanings)[0]["partOfSpeech"];
        const phonic = ((tmp.phonetics)[0].text || (tmp.phonetics)[1].text || (tmp.phonetics)[2].text);
        // phải đặt trương hợp có ở đầu thì mới tìm thấy được
        const define =
            (tmp.meanings[0]["definitions"])[0]["definition"] || "Api doesn't have!"
            || (tmp.meanings[0]["definitions"])[1]["definition"]
            || (tmp.meanings[0]["definitions"])[2]["definition"]
            || (tmp.meanings[0]["definitions"])[3]["definition"]
            || (tmp.meanings[0]["definitions"])[4]["definition"]
            || (tmp.meanings[0]["definitions"])[5]["definition"];

        const example =
            (tmp.meanings[0]["definitions"])[0]["example"] || "Api doesn't have!"
            || (tmp.meanings[0]["definitions"])[1]["example"] 
            || (tmp.meanings[0]["definitions"])[2]["example"] 
            || (tmp.meanings[1]["definitions"])[1]["example"]
            || (tmp.meanings[1]["definitions"])[0]["example"]
            || (tmp.meanings[2]["definitions"])[0]["example"] 
            || (tmp.meanings[2]["definitions"])[1]["example"]
            || (tmp.meanings[2]["definitions"])[3]["example"]
            || (tmp.meanings[2]["definitions"])[2]["example"]
            || (tmp.meanings[3]["definitions"])[0]["example"]
            || (tmp.meanings[3]["definitions"])[1]["example"];
        const src = (tmp.phonetics)[0].audio || "none" || (tmp.phonetics)[1].audio || (tmp.phonetics)[2].audio || (tmp.phonetics)[3].audio;

        let htmlContent =
            `
            <audio id="myAudio">
                <source class="audioCheck" src=${src} type="audio/mpeg">
            </audio>
            <div class="block1">
                <h1>${document.querySelector("#inp-word").value}</h1>
                <button class="speaker" onclick="playAudio()">
                    <i class="fa-solid fa-volume-high"></i>
                </button>
            </div>
            <div class="block2">
                <p>${detail}</p>
                <p>${phonic}</p>
            </div>
            <div class="block3">
                <p>${define}</p>
            </div>
            <div class="block4">
                <p>
                    ${example}
                </p>
            </div>
                        `;
        //dom tới và nhét vào
        document.querySelector(".result").innerHTML = htmlContent;
    }
}

// Function to play the audio
function playAudio() {
    let audio = document.getElementById("myAudio");
    if(document.querySelector(".audioCheck").getAttribute("src") != "none"){
        audio.play();
    }
};

//lắng nghe sự kiện
document.querySelector(".block__fa__input").addEventListener("submit", (event) => {
    event.preventDefault();
    // trước khi vào xóa cái lỗi trước đi
    document.querySelector(".notification").innerHTML = "";
    //lấy dữ liệu từ ô input
    let word = document.querySelector("#inp-word").value.toLowerCase();
    if(word.length < 1){
        document.querySelector(".notification").innerHTML = `<h3>That field is required!</h3>`;
        return;
    };
    //tạo ra 2 instance
    const ui = new RenderUI();
    const store = new Store();

    //nhờ store lấy dữ liệu
    store.getWordInfor(word)
        .then((wordInfor) => {
            //nhờ ui hiện dùm
            ui.renderWordInfor(wordInfor);
        })
        .catch((error) => {
            document.querySelector(".notification").innerHTML = `<h3>Word isn't valid with api</h3>`;
            return;
        })
})


