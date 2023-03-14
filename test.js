console.log("입력하세요")
process.stdin.on('data', function(name){
  process.stdout.write(name);
  process.exit();
})