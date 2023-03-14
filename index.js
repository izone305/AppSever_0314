const http = require('http');
const formTag = `
<form method="GET" action="/login"> 
<input type="text" name="id">
<input type="submit"> 
</form>
`;
function greet(fromSubmitString) {
return `<h1>${fromSubmitString}</h1>`;
}
function firstPage(data) {
return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Document</title>
</head>
<body>
${data}
</body>
</html>
`;
}

const pokemon = require('pokemon'); //다운받은 pokemon npm을 불러온다.

const server = http.createServer(function(request, response){
// 최초접속
if(request.method === 'GET' && request.url === '/') {
response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
let page = firstPage(formTag);
response.write(page);
response.end();
}
// 무언가
if(request.method === 'GET' && request.url.startsWith('/login')) {

  //지원되는 나라별 언어 타입을 배열로 저장. 이는 제공되는 객체를 불러와도 가능.
  const pokeLg = ["de", "en", "fr", "es", "ja", "ko"];
  //console.dir(pokemon.all());

  console.log(request.url);
  const name = request.url.split('=')[1];
  
  const pokeNameKo = decodeURIComponent(name); //한글 안깨지도록 디코딩해줌.(포켓몬 이름을 한글로 받을 경우)

  let pp = pokemon.getId(pokeNameKo,'ko'); //입력받은 이름을 이용해 포켓몬 ID를 추출
  console.log(pp);
  
  response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
  //formTag를 한번 더 입력해서 나온 결과 위에 계속해서 다른 포켓몬 이름을 요청할 수 있도록 함.
  response.write(firstPage(formTag));

  for(let i = 0; i < pokeLg.length; i++){
    //ID번호에 맞는 포켓몬 이름을 나라별로 뽑아서 저장 후 태그 씌워서 페이지에 띄워줌.
    let ppNum = pokemon.getName(pp, pokeLg[i]);
    let page = firstPage(greet(ppNum))
    response.write(page);

  }

  response.end();
  }
  });
// 서버 포트 설정
server.listen(305, function(error) {
if(error) { console.error('서버 안돌아감') } else { console.log('서버 돌아감'); }
});