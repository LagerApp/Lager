var LagerApp = React.createClass({

  loadServersData: function() {
    $.ajax({
      url: "/servers",
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({ servers: data });
      }.bind(this)
    });
  },

  loadServicesData: function() {
    $.ajax({
      url: "/services",
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({ services: data });
      }.bind(this)
    });
  },

  loadServerServiceData: function(server) {
    this.setState({
      services: server.services
    });
  },

  componentDidMount: function() {
    window.onhashchange = function() {
      this.setState({page: window.location.hash.substring(1)});
    }.bind(this);
  },

  componentDidMount: function() {
    this.loadServicesData();
    this.loadServersData();
    window.onhashchange = function() {
      var hash = window.location.hash.substring(1);
      $('header a.pull-right').attr('href', '/' + hash + '/new');
      this.setState({page: hash});
    }.bind(this);
  },

  getInitialState: function() {
    var page = "services";
    if (window.location.hash) {
      page = window.location.hash.substring(1);
      $('header a.pull-right').attr('href', '/' + page + '/new');
    }
    return {
      logs: [],
      page: page,
      services: [],
      servers: []
    };
  },

  render: function() {
    var tableView;
    if (this.state.page === "servers") {
      $("#servers-tab-item").addClass("active");
      $("#services-tab-item").removeClass("active");
      tableView = <ServerTableView servers={this.state.servers} loadServerServiceData={this.loadServerServiceData} />
    } else if (this.state.page === 'server-services') {
      tableView = <ServerServicesTableView services={this.state.services} />
    } else {
      $("#servers-tab-item").removeClass("active");
      $("#services-tab-item").addClass("active");
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
      return (<ServiceTableViewCell service={service} key={service.name + service.id} />)
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
    var serverCountLabel = '';
    if (this.props.service.servers) {
      serverCountLabel = <p>Server count: {this.props.service.servers.length}</p>;
    }

    return (
      <li className="table-view-cell">
        <a className="navigate-right" data-ignore="push" href={"/logs/service/" + this.props.service.id}>
          <div>
            <h4>{this.props.service.name}</h4>
            {serverCountLabel}
          </div>
        </a>
      </li>
    );
  }

});

var ServerTableView = React.createClass({

  _generateServerTableViewCells: function() {
    var loadServerServiceData = this.props.loadServerServiceData;
    return this.props.servers.map(function(server, idx){
      return (<ServerTableViewCell server={server} key={idx} loadServerServiceData={loadServerServiceData} />)
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

  componentDidMount: function() {
    this._getServerStatus(this.props.server)
  },

  getInitialState: function() {
    return {
      status: false
    };
  },

  _getServerStatus: function(server) {
    $.ajax({
      url: "/server/" + server.id + "/status",
      dataType: 'json',
      cache: false,
      success: function(data) { this.setState(data) }.bind(this)
    });
  },

  render: function() {
    var server = this.props.server;
    var statusClass = this.state.status ? "btn btn-positive" : "btn btn-negative";
    var status = this.state.status ? "Up" : "Down";
    return (
      <li className="table-view-cell">
        <a className="navigate-right" href="#server-services" data-transition="slide-in" onClick={this.props.loadServerServiceData.bind(null, server)}>
          <div style={{float: "left"}}>
            <h4>{server.host}</h4>
            <h5>{server.label}</h5>
          </div>
          <button className={statusClass} style={{float: "right"}}>
            {status}
          </button>
        </a>
      </li>
    );
  }

});

var ServerServicesTableView = React.createClass({

  _generateServiceTableViewCells: function() {
    if (this.props.services.length > 0) {
      return this.props.services.map(function(service, idx){
        return (<ServiceTableViewCell service={service} key={idx} />)
      });
    } else {
      return (
        <li>
          <div className="content-padded">
            <p>
              No services configured. Please <a href="/services/new" data-ignore="push">add a service</a> to this server.
            </p>
          </div>
        </li>
      )
    }
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

React.render(<LagerApp />, document.getElementById('content'));
