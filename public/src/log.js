var LogApp = React.createClass({

  componentDidMount: function() {
    $.get("/service/" + this.props.service_id, function(service) {
      $(".title").html(service.name);
      this.setState({ service: service });
      this._connectWebsocket("ws://" + window.location.hostname + ":4001", service);
    }.bind(this))
  },

  getInitialState: function() {
    return {
      logList: []
    };
  },

  componentWillUpdate: function(nextProps, nextState) {
    $('html, body').animate({
      scrollTop: $('.content').offset().top
    }, 'slow');
  },

  _connectWebsocket: function(host, service) {
    var socket;
    var connect = function(host, service) {
      try {
        socket = new WebSocket(host);
        console.log("Socket State: " + socket.readyState);
        socket.onopen = function() {
          console.log(host + ": " + "Socket Status: " + socket.readyState + " (open)");
          socket.send(JSON.stringify({ type: "service", id: service.id }));
        }
        socket.onclose = function() {
          console.log("Socket Status: " + socket.readyState + " (closed)");
        }
        socket.onmessage = function(msg) {
          var result = JSON.parse(msg.data);
          var logList = this.state.logList;
          logList.unshift(this._createLogListItem(result));
          this.setState({logList: logList});
        }.bind(this)
      } catch(exception) {
        console.log("Error: " + exception);
      }
    }.bind(this)

    connect(host, service);
  },

  _createLogListItem: function(log) {
    return (
      <li className="table-view-cell" key={this.state.logList.length}>
        <p>
          {log.msg}
        </p>
      </li>
    )
  },

  render: function() {
    return (
      <div>
        <form>
          <input type="search" placeholder="Search" />
          <ul className="table-view">
            {this.state.logList}
          </ul>
        </form>
      </div>
    );
  }

});

React.render(<LogApp service_id={service_id}/>, document.getElementById('content'));
