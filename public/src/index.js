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
      tableView = <ServerTableView servers={this.state.servers} />
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
        <a className="navigate-right" data-ignore="push" href={"/logs/service/" + this.props.service.id}>
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
    return this.props.servers.map(function(server, idx){
      return (<ServerTableViewCell server={server} key={idx} />)
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
        <a className="navigate-right" href="#" data-transition="slide-in">
          <div style={{float: "left"}}>
            <h4>{this.props.server.host}</h4>
            <h5>{this.props.server.label}</h5>
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
