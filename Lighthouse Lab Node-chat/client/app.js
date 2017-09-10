var socket = io();

$('form').submit(function() {
  var text = $('#message').val();
  var person = $('#initials').val();
  socket.emit('message', person, text);
  $('#message').val('');
  return false;
});

socket.on('message', function(person, text) {
  $('<li>').text(person).text(text).appendTo('#history');
});
