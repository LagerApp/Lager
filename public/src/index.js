var LagerApp = React.createClass({

  componentWillMount: function() {
    window.onhashchange = function() {
      this.setState({page: window.location.hash.substring(1)});
    }.bind(this);
  },

  componentDidMount: function() {
    window.onhashchange = function() {
      var hash = window.location.hash.substring(1);
      $('header a.pull-right').attr('href', '/' + hash + '/new');
      this.setState({page: hash});
    }.bind(this);
  },

  getInitialState: function() {
    var page = "servers";
    if (window.location.hash) {
      page = window.location.hash.substring(1);
    }
    return {
      logs: [],
      page: page,
      services: [
        {
          name: "nginx",
          server_count: 5
        },
        {
          name: "postgresql",
          server_count: 2
        },
        {
          name: "rabbitmq",
          server_count: 3
        }
      ],
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
      tableView = <ServerTableView servers={this.state.servers} />
    } else {
      tableView = <ServiceTableView services={this.state.services} />
    }
    return (
      <div>
        {tableView}
        <div ref="line"></div>
      </div>
    );
  }
});

var ServiceTableView = React.createClass({

  _generateServiceTableViewCells: function() {
    return this.props.services.map(function(service){
      return (<ServiceTableViewCell service={service} key={service.name} />)
    });
  },

  render: function() {
    return (
      <div>
        <ul className="table-view">
          {this._generateServiceTableViewCells()}
        </ul>
      </div>
    );
  }

});

var ServiceTableViewCell = React.createClass({

  render: function() {
    return (
      <li className="table-view-cell">
        <a className="navigate-right" data-transition="slide-in" href="/log">
          <div>
            <h4>{this.props.service.name}</h4>
            <p>Server count: {this.props.service.server_count}</p>
          </div>
        </a>
      </li>
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
        <a className="navigate-right" href="/servers/new" data-transition="slide-in">
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
