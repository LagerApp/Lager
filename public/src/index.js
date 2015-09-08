var LagerApp = React.createClass({

  componentDidMount: function() {
    var socket, host;
    host = "ws://localhost:4001";

    var connect = function() {
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
          React.findDOMNode(this.refs.line).innerHTML = msg.data;
        }.bind(this)
      } catch(exception) {
        console.log("Error: " + exception);
      }
    }.bind(this)

    connect();
  },

  getInitialState: function() {
    return {
      logs: []
    };
  },

  render: function() {
    return (
      <div ref="log" className="container">
        hello world
        <div ref="line"></div>
      </div>
    );
  }
});

React.render(<LagerApp />, document.getElementById('content'));
