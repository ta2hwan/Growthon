"use strict";

const promptButton = document.querySelector("#prompt-button");
const addButton = document.querySelector('#add-button')
const chatText = document.querySelector("#prompt");
const addText = document.querySelector('#addPrompt');
const titleImage = document.querySelector("#title-image");
const title = document.querySelector("#title");
const spinner = document.getElementById("spinner");
const chatContainer = document.querySelector("#chat-container");



addButton.addEventListener("click", () => {
  setTimeout(() => {
      addText.value = "정보가 성공적으로 저장되었습니다!";

  }, 3000); // 3000 밀리초 = 3초
});


//채팅 보내기 버튼 클릭시
promptButton.addEventListener("click", async (e) => {
  e.preventDefault();
  document.querySelector("#main-page").style.display = "none";
  chatContainer.style.visibility = "visible";
  chatContainer.style.opacity = "1";
  const message = chatText.value.trim();

  addMessage("user", message);

  //입력폼 초기화
  chatText.value = "";
  promptButton.querySelector("img").src = "./img/button.png";
  promptButton.style.pointerEvents = "none";
  promptButton.style.userSelect = "none";
  promptButton.disabled = true;

  //로딩중 표시
  const tempMessageElement = addTemporaryMessage();
  
  //backend request
  const aiResponse = await fetchAIResponse(message);

  // 임시 메시지 요소를 제거하고, 실제 응답으로 메시지 추가
  chatContainer.removeChild(tempMessageElement);
  addMessage("ai", aiResponse);
});


// backend에 request
async function fetchAIResponse(message) {
    const url = 'http://localhost:3000/searchBenefits';
    const body = {
        user: message,
    };
    try{
       const response = await fetch(url, {
           method: 'POST',
           headers: {
               'Content-Type': 'application/json'
           },
           body: JSON.stringify(body)
       });
       if(!response.ok){
           throw new Error('Request failed with status' + response.status );
       }

       
       const jsonResponse = await response.json();
       return jsonResponse.assistant;
   } catch (error) {
        console.error('Error:', error);
        return error;
   }
}


//채팅을 화면에 add 하는 함수
const addMessage = (sender, message) => {
  const messageElement = document.createElement("div");
  const imgElement = document.createElement("img");
  const nameElement = document.createElement("div");
  const logElement = document.createElement("div");

  if (sender === "user") {
    messageElement.className = "chat my-chat";
    imgElement.src = "./img/induck.png";
    nameElement.textContent = "You";
  } else if (sender === "ai") {
    messageElement.className = "chat gpt-chat";
    imgElement.src = "./img/annyong.png";
    nameElement.textContent = "코무룩";
  }

  imgElement.className = "profile";
  nameElement.className = "chat-name";
  logElement.className = "chat-log";
  logElement.innerHTML = marked.parse(message);

  messageElement.appendChild(imgElement);
  messageElement.appendChild(nameElement);
  messageElement.appendChild(logElement);

  chatContainer.prepend(messageElement);
  messageElement.scrollIntoView();
};


//로딩중 표시 
const addTemporaryMessage = () => {
  const tempMessageElement = document.createElement("div");
  tempMessageElement.className = "chat gpt-chat";
  const imgElement = document.createElement("img");
  imgElement.src = "./img/annyong.png";
  imgElement.className = "profile";
  const nameElement = document.createElement("div");
  nameElement.textContent = "";
  nameElement.className = "chat-name";
  const logElement = document.createElement("div");
  logElement.className = "chat-log";
  const spinnerElement = document.createElement("img");
  spinnerElement.src = "./img/spinner.gif"; // 스피너 이미지 경로를 지정하세요
  spinnerElement.className = "spinner";

  logElement.appendChild(spinnerElement);
  tempMessageElement.appendChild(imgElement);
  tempMessageElement.appendChild(nameElement);
  tempMessageElement.appendChild(logElement);

  chatContainer.prepend(tempMessageElement);
  tempMessageElement.scrollIntoView();


  return tempMessageElement;
};

//section 클릭시 채팅창에 내용 추가 함수
document.querySelectorAll(".section").forEach((section) => {
  const title = section.querySelector(".section-title");
  section.addEventListener("click", () => {
    chatText.value = title.textContent.trim();
    promptButton.querySelector("img").src = "./img/button_active.png";
    promptButton.style.pointerEvents = "auto";
    promptButton.style.userSelect = "auto";
    promptButton.disabled = false;
  }
  );
});

document.querySelectorAll(".keyword").forEach((keyword) => {
  const title = keyword.querySelector(".section2");
  keyword.addEventListener("click", () => {
    chatText.value = title.textContent.trim() + " 관련된 혜택 알려줘!";
    promptButton.querySelector("img").src = "./img/button_active.png";
    promptButton.style.pointerEvents = "auto";
    promptButton.style.userSelect = "auto";
    promptButton.disabled = false;
  }
  );
});



//부가기능3) 입력 필드에 텍스트가 입력되면 버튼 활성화
chatText.addEventListener("input", async (e) => {
  if (chatText.value === "") {
    promptButton.querySelector("img").src = "./img/button.png";
    promptButton.style.pointerEvents = "none";
    promptButton.style.userSelect = "none";
    promptButton.disabled = true;
  }
  else {
    promptButton.querySelector("img").src = "./img/button_active.png";
    promptButton.style.pointerEvents = "auto";
    promptButton.style.userSelect = "auto";
    promptButton.disabled = false;
  }
});

