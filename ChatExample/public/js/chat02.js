// 문서 로딩 후 실행됨
$(function() {
  var socket;
  $("#connectButton").bind('click', function(event) {
    println('connectButton이 클릭되었습니다.');

    var host = $('#hostInput').val();
    var port = $('#portInput').val();

    // 서버에 연결하는 함수 정의
    function connectToServer() {
      var options = {'forceNew':true};
      var url = 'http://' + host + ':' + port;
      socket = io.connect(url, options);

      socket.on('connect', function() {
        println('웹소켓 서버에 연결되었습니다. : ' + url);
        socket.on('message', function(message) {
          console.log(JSON.stringify(message));
          println('<p>수신 메시지 : ' + message.sender + ', ' + message.recepient + ', ' + message.command + ', ' + message.data + '</p>');
        });
      });

      socket.on('disconnect', function() {
        println('웹소켓 연결이 종료되었습니다.');
      });
    }

    // 전송 버튼 클릭 시 처리
  $("#sendButton").bind('click', function(event) {
      var sender = $('#senderInput').val();
      var recepient = $('#recepientInput').val();
      var data = $('#dataInput').val();

      var output = {sender:sender, recepient:recepient, command:'chat', type:'text', data:data};
      console.log('서버로 보낼 데이터 : ' + JSON.stringify(output));

      if (socket == undefined) {
          alert('서버에 연결되어 있지 않습니다. 먼저 서버에 연결하세요.');
          return;
      }

      socket.emit('message', output);
  });

    connectToServer();
  });



});

function println(data) {
  console.log(data);
  $('#result').append('<p>' + data + '</p>');
}
