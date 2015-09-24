var LagerApp = React.createClass({

  _loadServersData: function() {
    var username = localStorage.getItem('username');
    var authToken = localStorage.getItem('auth_token');

    $.ajax({
      headers: {
        'Authorization': 'Basic ' + btoa(username + ':' + authToken)
      },
      url: "/servers",
      dataType: 'json',
      cache: true,
      success: function(data) {
        this.setState({ servers: data });
      }.bind(this)
    });
  },

  _loadServicesData: function() {
    var username = localStorage.getItem('username');
    var authToken = localStorage.getItem('auth_token');

    $.ajax({
      headers: {
        'Authorization': 'Basic ' + btoa(username + ':' + authToken)
      },
      url: "/services",
      dataType: 'json',
      cache: true,
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

  getInitialState: function() {
    var page = "servers";
    if (window.location.hash) {
      page = window.location.hash.substring(1);
      $('header a.pull-right').attr('href', '/' + page + '/new');
    }
    return {
      logs: [],
      page: page,
      services: [],
      servers: [],
      loggedIn: localStorage.getItem('auth_token') !== ''
    };
  },

  _loadData: function() {
    this._loadServersData();
    this._loadServicesData();
  },

  componentWillMount: function() {
    $.ajaxSetup({cache: true});

    if (localStorage.getItem('auth_token') == undefined) {
      localStorage.setItem('auth_token', '');
    }

    if (localStorage.getItem('username') == undefined) {
      localStorage.setItem('username', '');
    }
  },

  componentDidMount: function() {
    window.onhashchange = function() {
      var hash = window.location.hash.substring(1);
      $('header .title').text(function(hash){
        if (hash === "servers") {
          return "Lager | Servers";
        } else {
          return "Lager | Services";
        }
      }(hash));
      $('header a.pull-right').attr('href', '/' + hash + '/new');
      this.setState({page: hash});
    }.bind(this);

    if (this.state.loggedIn) {
      this._loadData();
    } else {
      window.location.hash = 'settings';
    }
  },

  componentDidUpdate: function(prevProps, prevState) {
    if (localStorage.getItem('auth_token') === '') {
      window.location.hash = 'settings';
    }
  },

  render: function() {
    var tableView;
    if (this.state.page === "servers") {
      $('#settings-tab-item').removeClass('active');
      $("#servers-tab-item").addClass("active");
      $("#services-tab-item").removeClass("active");
      $('header a.pull-right').show();

      tableView = <ServerTableView servers={this.state.servers} loadServerServiceData={this.loadServerServiceData} />
    } else if (this.state.page === 'services') {
      $('#settings-tab-item').removeClass('active');
      $("#servers-tab-item").removeClass("active");
      $("#services-tab-item").addClass("active");
      $('header a.pull-right').show();

      tableView = <ServiceTableView services={this.state.services} />
    } else if (this.state.page === 'server-services') {
      tableView = <ServerServicesTableView services={this.state.services} />
    } else {
      $('#settings-tab-item').addClass('active');
      $("#servers-tab-item").removeClass("active");
      $("#services-tab-item").removeClass("active");
      $('header a.pull-right').hide();

      tableView = <SettingsView loggedIn={this.state.loggedIn} loadData={this._loadData} />;
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
    if (localStorage.getItem('auth_token') !== '') {
      this._getServerStatus(this.props.server)
    }
  },

  getInitialState: function() {
    return {
      status: false
    };
  },

  _getServerStatus: function(server) {
    var username = localStorage.getItem('username');
    var authToken = localStorage.getItem('auth_token');

    $.ajax({
      url: "/server/" + server.id + "/status",
      headers: {
        'Authorization': 'Basic ' + btoa(username + ':' + authToken)
      },
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

  componentDidMount: function() {
    $('header a.pull-right').attr('href', '/services/new');
  },

  _generateServiceTableViewCells: function() {
    if (this.props.services.length > 0) {
      return this.props.services.map(function(service, idx){
        return (<ServiceTableViewCell service={service} key={idx} />)
      });
    } else {
      return (
        <li className="table-view-cell">
          <p>
            No services configured. Please <a href="/services/new" data-ignore="push">add a service</a> to this server.
          </p>
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

var SettingsView = React.createClass({

  render: function() {
    return (
      <div>
        <SettingsSelectorView />
        <div>
          <div id="item1mobile" className="control-content active">
            <NewAccountView loadData={this.props.loadData} />
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

var NewAccountView = React.createClass({
  _createAccount: function(e) {
    e.preventDefault();
    var username = React.findDOMNode(this.refs.username).value;
    var password = React.findDOMNode(this.refs.password).value;

    $.ajax({
      type: 'POST',
      url: '/user/auth',
      data: {
        username: username,
        password: password
      },
      success: function(res) {
        localStorage.setItem('auth_token', JSON.parse(res).auth_token);
        localStorage.setItem('username', username);
        window.location.hash = 'servers';
        this.props.loadData();
      }.bind(this)
    });
  },

  _logout: function() {
    localStorage.setItem('auth_token', '');
    localStorage.setItem('username', '');
    this.forceUpdate();
  },

  render: function() {
    var loggedIn = localStorage.getItem('auth_token') !== '';
    if (loggedIn) {
      return (
        <div className="content-padded">
          <p>You're already logged in!</p>
          <button className="btn btn-negative btn-block" onClick={this._logout}>Logout</button>
        </div>
      );
    }
    return (
      <form style={{padding: "10px"}} onSubmit={this._createAccount}>
        <input ref="username" type="text" placeholder="Username" />
        <input ref="password" type="text" type="password" placeholder="Password" />
        <button type="submit" className="btn btn-positive btn-block">Log in</button>
      </form>
    );
  }

});

var LogReaderSettingView = React.createClass({

  _setLines: function() {
    var lines = React.findDOMNode(this.refs.logLines).value;
    localStorage.setItem('lines', lines);
  },

  render: function() {
    var options = [];
    for (var i=10; i <= 100; i+=10) {
      options.push(<LogReaderLineOption lines={i} key={i} />);
    }

    return (
      <select style={{margin: "0px"}} ref="logLines" onChange={this._setLines}>
        {options}
      </select>
    );
  }

});

var LogReaderLineOption = React.createClass({

  render: function() {
    return (
      <option value={this.props.lines}>{this.props.lines}</option>
    );
  }

});


React.render(<LagerApp />, document.getElementById('content'));
