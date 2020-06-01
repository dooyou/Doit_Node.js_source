// 문서 로딩 후 실행됨
$(function() {

  $("#connectButton").bind('click', function(event) {
    println('connectButton이 클릭되었습니다.');

    var host = $('#hostInput').val();
    var port = $('#portInput').val();

    function connectToServer() {
      var options = {'forceNew':true};
      var url = 'http://' + host + ':' + port;
      var socket = io.connect(url, options);

      socket.on('connect', function() {
        println('웹소켓 서버에 연결되었습니다. : ' + url);
      });

      socket.on('disconnect', function() {
        println('웹소켓 연결이 종료되었습니다.');
      });
    }

    connectToServer();
  });
});

// 서버에 연결하는 함수 정의


function println(data) {
  console.log(data);
  $('#result').append('<p>' + data + '</p>');
}
