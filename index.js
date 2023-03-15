const http = require('http');
const fs = require("fs"); //fs module 불러오기
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
function imgGen(){
  return `<img src="/pokeImg" alt="test" />` //포켓몬 이미지 추가 코드
}
const pokemon = require('pokemon')
let pokemonNum;
const server = http.createServer(function(request, response){
// 최초접속
if(request.method === 'GET' && request.url === '/') {
response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
let page = firstPage(formTag, "");
response.write(page);
response.end();
}
// 무언가
if(request.method === 'GET' && request.url.startsWith('/login')) {

  const pokeLg = ["de", "en", "fr", "es", "ja", "ko"];

  console.log(request.url);
  const name = request.url.split('=')[1];
  
  const pokeNameKo = decodeURIComponent(name); //한글 안깨지도록 디코딩해줌

  pokemonNum = pokemon.getId(pokeNameKo,'ko');
  console.log(pokemonNum);
  
  response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});

  response.write(firstPage(imgGen())) //포켓몬 넘버와 매칭시켜 이미지 로드
  
  for(let i = 0; i < pokeLg.length; i++){
    let pokenonName = pokemon.getName(pokemonNum, pokeLg[i]);
    let page =   firstPage(greet(pokenonName))
    response.write(page);
    
  }
  
  response.end();
  }
  if(request.method === 'GET' && request.url.startsWith('/pokeImg')){
    //fs module을 불러서 포켓몬 넘버에 맞는 이미지를 읽어 오도록 함.
    fs.readFile(`./node_modules/pokemon-sprites/sprites/pokemon/${pokemonNum}.png`, function(err, data){
      response.writeHead(200);
      response.write(data); //읽어온 이미지는 data라는 이름으로 문서에 써줌
      response.end();
    })
      
  }
});
// 서버 포트 설정
server.listen(305, function(error) {
if(error) { console.error('서버 안돌아감') } else { console.log('서버 돌아감'); }
});