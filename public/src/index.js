var LagerApp = React.createClass({

  componentWillMount: function() {
    window.onhashchange = function() {
      this.setState({page: window.location.hash.substring(1)});
    }.bind(this);
  },

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
          var result = JSON.parse(msg.data);
          React.findDOMNode(this.refs.line).innerHTML =
            "Host: " + result['host'] + "; Message: " + result['msg'];
        }.bind(this)
      } catch(exception) {
        console.log("Error: " + exception);
      }
    }.bind(this)

    connect();
  },

  getInitialState: function() {
    var page = "servers";
    if (window.location.hash) {
      page = window.location.hash;
    }
    return {
      logs: [],
      page: page,
      servers: [
        {
          host: "app1.sg",
          ip: "1.1.1.1",
          status: true
        },
        {
          host: "app2.sg",
          ip: "2.2.2.2",
          status: false
        },
        {
          host: "db.sg",
          ip: "3.3.3.3",
          status: true
        },
      ]
    };
  },

  render: function() {
    var tableView;
    if (this.state.page === "servers") {
      tableView = (<ServerTableView servers={this.state.servers} />)
    } else {
      tableView = (<div>hello</div>)
    }
    return (
      <div ref="log" className="container">
        {tableView}
        <div ref="line"></div>
      </div>
    );
  }
});

var ServerTableView = React.createClass({

  _generateServerTableViewCells: function() {
    return this.props.servers.map(function(server){
      return (<ServerTableViewCell server={server} key={server.ip} />)
    });
  },

  render: function() {
    return (
      <div>
        <ul className="table-view">
          {this._generateServerTableViewCells()}
        </ul>
      </div>
    );
  }

});

var ServerTableViewCell = React.createClass({

  render: function() {
    var statusClass = this.props.server.status ? "btn btn-positive" : "btn btn-negative";
    var status = this.props.server.status ? "Up" : "Down";
    return (
      <li className="table-view-cell">
        <a className="navigate-right">
          <div style={{float: "left"}}>
            <h4>{this.props.server.host}</h4>
            <h5>{this.props.server.ip}</h5>
          </div>
          <button className={statusClass} style={{float: "right"}}>
            {status}
          </button>
        </a>
      </li>
    );
  }

});

React.render(<LagerApp />, document.getElementById('content'));
