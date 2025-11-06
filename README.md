# httpChating
http로 채팅 서비스를 테스트 및 배포까지 해보는 repo
## 시작하기
`npm run start`

## 미들웨어
- 요청과 응답의 중간(middle)에 위치함
- 라우터, 애러 핸들러를 가르킴
- 요청과 응답을 조작해 기능을 추가하기도 하고, 나쁜 요청을 걸러내기도 함
- `app.use(미들웨어)` 형태로 사용됨
- 위에서부터 아래로 순서대로 실행되면서 요청과 응답 사이에 특별한 기능을 추가하는 것이 가능함

## HTTP(HyperText Transfer Protocol)
웹에서 클라이언트(브라우저)와 서버 간에 데이터를 주고받는 통신 규약(Protocol)

- 클라이언트(브라우저 or 앱)가 서버에 요청(request)을 보내고
- 서버가 클라이언트에게 응답(response)을 하는 구조이다
(응답 구조 모델)

## HTTP 통신 구조

### Request
```sql
GET /chat HTTP/1.1
Host: example.com
Content-Type: application/json
```
### Response
```sql
HTTP/1.1 200 OK
Content-Type: application/json

{"message": "Hello World!"}
```

## HTTP Methods
HTTP에는 여러 종류의 요청 방식(Method)이 있다
즉, "서버에 어떤 행동을 해주세요" 라는 요청의 의도를 표현하는 방법이다

| 메서드         | 의미                              | 사용 예시          |
| :---------- | :------------------------------ | :------------- |
| **GET**     | 서버에서 **데이터를 가져오기(Read)**        | 채팅 메시지 목록 불러오기 |
| **POST**    | 서버에 **데이터를 보내기(Create)**        | 새로운 채팅 메시지 보내기 |
| **PUT**     | 서버에 있는 자원을 **전체 수정(Update)**    | 프로필 전체 수정      |
| **PATCH**   | 서버 자원의 **일부 수정(Update)**        | 닉네임만 변경        |
| **DELETE**  | 서버 자원 **삭제(Delete)**            | 메시지 삭제         |
| **OPTIONS** | 브라우저가 요청 전 **서버의 허용 설정을 미리 확인** | CORS 정책 확인용    |

## OPTIONS Method
웹 브라우저에서 Js의 `fetch()`나 axios로 요청할 때,
서버가 다른 출처(origin)(예: 다른 포트, 다른 도메인)에 있으면
CORS를 통해 OPTIONS 요청을 보내야 한다



## node.js http

## CORS(Cross-Origin Resource Sharing) 교차 출처 리소스 공유
다른 출처(origin)의 웹 페이지가 내 서버에 요청을 보낼 수 있는지 제어하는 브라우저 보안 정책이다

예시 상황
- 서버 : `http://localhost:3000`
- 클라이언트(HTML) : `file://index.html` or `http://127.0.0.1:5500`
이런 경우 브라우저는 두 주소의 출처가 다름으로 보안상 막는다

그래서 이러한 경우 `fetch('http://localhost:3000/send')` 같은 요청을 하면 서버가 응답을 줘도 브라우저가 차단한다

그래서 외부에서도 접근 가능하다고 CORS 헤더를 직접 추가해 설정해야 한다

```js
// CORS 허용 (브라우저 fetch 사용 위해)
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
```
| 코드                                                 | 의미                                    |
| -------------------------------------------------- | ------------------------------------- |
| `Access-Control-Allow-Origin: *`                   | 모든 출처(모든 웹사이트)에서 이 서버로 요청 허용          |
| `Access-Control-Allow-Methods: GET, POST, OPTIONS` | 허용할 HTTP 메서드 지정 (브라우저가 이 중 하나만 사용 가능) |
| `Access-Control-Allow-Headers: Content-Type`       | 요청 시 `Content-Type` 헤더를 보낼 수 있도록 허용   |

## CORS 사전 요청(Preflight Request)
브라우저가 fetch()로 POST 요청을 보내기 전에 요청을 먼저 한 번 보낸다

```sql
OPTIONS /send HTTP/1.1
Origin: http://127.0.0.1:5500
Access-Control-Request-Method: POST
Access-Control-Request-Headers: content-type
```

이 요청은 이 서버가 진짜 POST 요청을 받아줄 의향이 있는지를 확인하는 테스트 요청이다

서버가 여기에 제대로 응답하지 않으면, 브라우저는 실제 POST 요청을 보내지도 않는다

```js
res.writeHead(204); // No Content
res.end();
return; // 더 이상 아래 코드 실행 안 함
```

이렇게 되면 브라우저가 서버가 허락한 걸 받아들이고 본 요청을 정상적으로 보낸다

## HTTP Status Code(HTTP 상태 코드)
서버가 클라이언트 요청(request)에 대해 응답(response)할 때
요청이 성공했는지, 실패했는지, 추가 조치가 필요한지를 알려주는 3자리 숫자이다

예
```http
HTTP/1.1 200 OK
```
이건 요청이 성공적으로 처리되었다는 의미이다

### 첫 숫자 - 범주
| 범위      | 종류                      | 의미            |
| ------- | ----------------------- | ------------- |
| **1xx** | Informational (정보)      | 요청을 계속 진행 중임  |
| **2xx** | Success (성공)            | 요청이 정상적으로 완료됨 |
| **3xx** | Redirection (리다이렉션)     | 다른 위치로 이동해야 함 |
| **4xx** | Client Error (클라이언트 오류) | 요청에 문제가 있음    |
| **5xx** | Server Error (서버 오류)    | 서버에서 문제가 발생함  |

### 200번대 - 성공(Success)
| 코드                 | 의미        | 설명                             |
| ------------------ | --------- | ------------------------------ |
| **200 OK**         | 요청 성공     | 일반적인 성공 응답                     |
| **201 Created**    | 새 리소스 생성됨 | POST로 데이터 추가 성공 시 사용           |
| **202 Accepted**   | 요청 접수됨    | 나중에 처리될 예정                     |
| **204 No Content** | 내용 없음     | 응답 본문 없이 성공 (예: OPTIONS 요청 응답) |

### 300번대 - 리다이렉션(Redirection)
| 코드                        | 의미    | 설명                 |
| ------------------------- | ----- | ------------------ |
| **301 Moved Permanently** | 영구 이동 | 요청한 자원이 새 URL로 이동함 |
| **302 Found**             | 임시 이동 | 임시적으로 다른 URL 사용    |
| **304 Not Modified**      | 변경 없음 | 캐시된 버전 사용 가능       |

### 400번대 - 클라이언트 오류(Client Error)
| 코드                         | 의미         | 설명                  |
| -------------------------- | ---------- | ------------------- |
| **400 Bad Request**        | 잘못된 요청     | 요청 형식이 잘못됨          |
| **401 Unauthorized**       | 인증 필요      | 로그인 필요              |
| **403 Forbidden**          | 접근 금지      | 권한 없음               |
| **404 Not Found**          | 찾을 수 없음    | 요청한 리소스 없음          |
| **405 Method Not Allowed** | 메서드 허용 안 됨 | 해당 경로에서 그 메서드 사용 불가 |

### 500번대 - 서버 오류(Server Error)
| 코드                            | 의미         | 설명             |
| ----------------------------- | ---------- | -------------- |
| **500 Internal Server Error** | 서버 내부 오류   | 일반적인 서버 에러     |
| **502 Bad Gateway**           | 게이트웨이 오류   | 다른 서버 응답이 잘못됨  |
| **503 Service Unavailable**   | 서비스 불가     | 서버 과부하 또는 점검 중 |
| **504 Gateway Timeout**       | 게이트웨이 타임아웃 | 응답이 너무 늦음      |

### 자주 쓰이는 상태 코드
| 코드                            | 상황            | 설명                  |
| ----------------------------- | ------------- | ------------------- |
| **200 OK**                    | GET/POST 성공   | 메시지 전송 또는 수신 성공     |
| **204 No Content**            | OPTIONS 요청 처리 | CORS 확인용 응답         |
| **400 Bad Request**           | JSON 파싱 오류    | 잘못된 데이터 보낼 때        |
| **404 Not Found**             | 잘못된 경로 요청     | 존재하지 않는 URL 접근      |
| **500 Internal Server Error** | 서버 코드 예외      | try-catch로 잡지 못한 오류 |


