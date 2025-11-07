//초기에 express 시작할때 설정

//express 모듈 가져온다
// const express = require('express')
// //가져온 express 모듈의 function을 이용해 새로운 express 앱을 만듦
// const app = express() 
// //포트 설정
// const port = 5000

const http = require('http')
const fs = require('fs')
const url = require('url')
const { time } = require('console')

let messages = []

const server = http.createServer(handleRequest)

function handleRequest(request, response) {
    //요청된 requsest 객체에서 url을 파싱(해석)하여 개발할 때 사용할 수 있게 함
    //url에서 필요한 부분만 가져옴
    const parsedUrl = url.parse(request.url, true)
    console.log(parsedUrl)

    response.setHeader('Access-Control-Allow-Origin', '*')
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    if(request.method === 'OPTIONS') {
        res.writeHead(204)
        res.end();
        return;
    }

    //HTML 파일 제공

    //메시지 출력하기 (GET /)
    if(request.url === '/' && request.method === 'GET') {
        fs.readFile('index.html', (err, data) => {
            //애러 발생시
            if(err) {
                response.writeHead(500)
                response.end('Error loading index.html')
            } else {
                //정상 실행시
                response.writeHead(200, {'Content-Type' : 'text/html'})
                response.end(data)
            }
        })
        return
    }

    //메시지 가져오기 (GET /messages)
    if(parsedUrl.pathname === '/messages' && request.method === 'GET') {
        response.writeHead(200, {'Content-Type':'application/json'});
        response.end(JSON.stringify(messages))
        return
    }

    //메시지 전송 (POST /send)
    if(parsedUrl.pathname === '/send' && request.method === 'POST') {
        let body = ''
        request.on('data', chunk => (body += chunk))
        request.on('end', () => {
            try {
                const {user, text} = JSON.parse(body)
                if(user && text) {
                    const msg = {user, text, time: new Date().toLocaleTimeString()}
                    messages.push(msg)
                    response.writeHead(200, {'Content-Type': 'application/json'})
                    response.end(JSON.stringify({success:true}))
                    
                } else {
                    response.writeHead(400);
                    response.end('Invalid message')
                }
            }catch(e) {
                response.writeHead(400)
                response.send('Bad Request')
            }
        })
        return
    }

    res.writeHead(404)
    res.end('Not found')
}

//내부적으로 필요한 이 모든 서버 기능이 포함된 객체를 반환함

server.listen(3000, () => console.log('서버 실행 중:http://localhost:3000'))



//root로 오면 
//req : 요청에 관한 정보가 있는 객체
//res : 응답에 관한 정보가 있는 객체
// app.get('/', (req, res) => {
//     //Hello World를 출력한다 
//     res.send('Hello World!')
// })

// //포트 5000번에서 실행한다
// app.listen(port, () => {
//     console.log(`app listening at http://localhost:${port}`)
// })