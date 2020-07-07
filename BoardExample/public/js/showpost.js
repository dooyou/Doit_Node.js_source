$(document).ready(function() {
  var output = $("#contentsOutput").text();
  console.log('output : ' + output);

  $("#contentsOutput").html(output);
});

var curTitle = posts.title;
var curContents = posts.contents;
var curWriter = posts.writer.email;

//- html-entities module is required in post.js
var entities = new Entities();
var decodedContents = entities.decode(curContents);
