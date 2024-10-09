// node.js 설치 -> node -v 로 확인
// 프로그램 실행 -> node index.js
// npm install openai
// npm install express  
// npm install cors
// npm install dotenv


const OpenAI = require('openai');
require('dotenv').config();
const cors = require('cors')
const express = require('express')
const bodyParser = require('body-parser');


const API_KEY = process.env.API_KEY;
const ASSISTANT_ID = process.env.ASSISTANT_ID
const THREAD_ID = process.env.THREAD_ID


const app = express()

app.use(cors())
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



const openai = new OpenAI({
    apiKey: API_KEY,
});


app.post('/searchBenefits', async function (req, res) {
    const msg = req.body.user
    message = await generateAIResponse(msg)
    res.json({assistant: message})
})



async function generateAIResponse(message) {
    // step 1) 쓰레드에 메시지 부착
    await openai.beta.threads.messages.create(
        THREAD_ID,
        { role: "user", content: message }
    );
    // step 2) run 
    const run = await openai.beta.threads.runs.create(
        THREAD_ID,
        { assistant_id: ASSISTANT_ID}
    );
    RUN_ID = run.id
    // step 3) 쓰레드.state == completed 될때 까지 wait
    while (true) {
        const run = await openai.beta.threads.runs.retrieve(THREAD_ID, RUN_ID);
        if (run.status === 'completed') break;
        console.log('wait')
        //await new Promise(resolve => setTimeout(resolve, 1000)); // 1초 대기
    }
    // step 4) 쓰레드의 응답 가져오기cd
    const threadMessages = await openai.beta.threads.messages.list(
        THREAD_ID
    );
    // step 5 응답 중 text
    msg = threadMessages.data[0].content[0].text.value
    return msg
}


app.listen(3000)