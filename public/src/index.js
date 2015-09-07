var LagerApp = React.createClass({
  componentDidMount: function() {
    var socket, host;
    host = "ws://localhost:4001";

    function connect() {
      try {
        socket = new WebSocket(host);

        console.log("Socket State: " + socket.readyState);

        socket.onopen = function() {
          console.log("Socket Status: " + socket.readyState + " (open)");
        }

        socket.onclose = function() {
          console.log("Socket Status: " + socket.readyState + " (closed)");
        }

        socket.onmessage = function(msg) {
          console.log("Received: " + msg.data);
        }
      } catch(exception) {
        console.log("Error: " + exception);
      }
    }

    connect();
  },

  render: function() {
    return (
      <div className="container">
        Hello world.
      </div>
    );
  }
});

React.render(<LagerApp />, document.getElementById('content'));
