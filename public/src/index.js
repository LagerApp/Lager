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
      servers: [],
      loggedIn: localStorage.getItem('loggedIn')
    };
  },

  render: function() {
    var tableView;
    if (this.state.page === "servers") {
      $('#settings-tab-item').removeClass('active');
      $("#servers-tab-item").addClass("active");
      $("#services-tab-item").removeClass("active");
      $('header a.pull-right').show();

      tableView = <ServerTableView servers={this.state.servers} />
    } else if (this.state.page === 'services') {
      $('#settings-tab-item').removeClass('active');
      $("#servers-tab-item").removeClass("active");
      $("#services-tab-item").addClass("active");
      $('header a.pull-right').show();

      tableView = <ServiceTableView services={this.state.services} />
    } else {
      $('#settings-tab-item').addClass('active');
      $("#servers-tab-item").removeClass("active");
      $("#services-tab-item").removeClass("active");
      $('header a.pull-right').hide();

      tableView = <SettingsView loggedIn={this.state.loggedIn}/>;
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
             <p>Server count: {this.props.service.servers.length}</p>
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

var SettingsView = React.createClass({

  render: function() {
    return (
      <div>
        <SettingsSelectorView />
        <div>
          <div id="item1mobile" className="control-content active">
            <LoginView loggedIn={this.props.loggedIn} />
          </div>

          <div id="item2mobile" className="control-content" style={{ margin: "10px"}}>
            <p>Select the number of log entries to display</p>
            <LogReaderSettingView />
          </div>
        </div>
      </div>
    );
  }

});

var SettingsSelectorView = React.createClass({

  render: function() {
    return (
      <div className="segmented-control" style={{margin: "10px"}}>
        <a className="control-item active" href="#item1mobile">
          Account
        </a>
        <a className="control-item" href="#item2mobile">
          Log Viewer
        </a>
      </div>
    );
  }

});

var LoginView = React.createClass({

  render: function() {
    if (this.props.loggedIn) {
      return (
        <div className="content-padded">
          <p>You're already logged in!</p>
          <button className="btn btn-negative btn-block">Logout</button>
        </div>
      );
    }
    return (
      <form style={{padding: "10px"}}>
        <input type="text" placeholder="Username" />
        <input type="text" type="password" placeholder="Password" />
        <button type="submit" className="btn btn-positive btn-block">Login</button>
      </form>
    );
  }

});

var LogReaderSettingView = React.createClass({

  render: function() {
    var options = [];
    for (var i=10; i <= 100; i+=10) {
      options.push(<LogReaderLineOptions lines={i} key={i} />);
    }

    return (
      <select style={{margin: "0px"}}>
        {options}
      </select>
    );
  }

});

var LogReaderLineOptions = React.createClass({

  render: function() {
    return (
      <option value="this.props.lines">{this.props.lines}</option>
    );
  }

});

React.render(<LagerApp />, document.getElementById('content'));
