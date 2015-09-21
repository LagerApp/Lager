var LogApp = React.createClass({

  componentDidMount: function() {
    this._startSpinner();
    $.get("/service/" + this.props.service_id, function(service) {
      $(".title").html(service.name);
      this.setState({ service: service });
      this._connectWebsocket("ws://" + window.location.hostname + ":4001", service);
    }.bind(this))
  },

  getInitialState: function() {
    return {
      searchText: "",
      logList: []
    };
  },

  _getSpinnerOpts: function() {
    var opts = {
      lines: 13 // The number of lines to draw
      , length: 4 // The length of each line
      , width: 2 // The line thickness
      , radius: 8 // The radius of the inner circle
      , scale: 1 // Scales overall size of the spinner
      , corners: 1 // Corner roundness (0..1)
      , color: '#000' // #rgb or #rrggbb or array of colors
      , opacity: 0.2 // Opacity of the lines
      , rotate: 0 // The rotation offset
      , direction: 1 // 1: clockwise, -1: counterclockwise
      , speed: 1 // Rounds per second
      , trail: 60 // Afterglow percentage
      , fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
      , zIndex: 2e9 // The z-index (defaults to 2000000000)
      , className: 'spinner' // The CSS class to assign to the spinner
      , top: '50%' // Top position relative to parent
      , left: '50%' // Left position relative to parent
      , shadow: false // Whether to render a shadow
      , hwaccel: true // Whether to use hardware acceleration
      , position: 'absolute' // Element positioning
    };
    return opts;
  },

  _startSpinner: function() {
    $("body").spin(this._getSpinnerOpts());
  },

  _stopSpinner: function() {
    $("body").spin(false);
  },

  _connectWebsocket: function(host, service) {
    var socket;
    var connect = function(host, service) {
      try {
        socket = new WebSocket(host);
        console.log("Socket State: " + socket.readyState);
        socket.onopen = function() {
          this._stopSpinner();
          console.log(host + ": " + "Socket Status: " + socket.readyState + " (open)");
          socket.send(JSON.stringify({ type: "service", id: service.id }));
        }.bind(this);
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

  _getLogList: function() {
    if (this.state.searchText === "") {
      return this.state.logList;
    } else {
      var searchTextArray = this.state.searchText.toLowerCase().split(" ");
      return this.state.logList.filter(function(cellElement) {
        var msg = this._logListCellMessage(cellElement).toLowerCase();
        return searchTextArray.every(function(searchText) {
          return msg.includes(searchText);
        });
      }.bind(this));
    }
  },

  _handleSearchTextChange: function() {
    var val = React.findDOMNode(this.refs.searchInput).value;
    this.setState({searchText: val});
    this.forceUpdate();
  },

  _logListCellMessage: function(cellElement) {
    return cellElement._store.props.children._store.props.children;
  },

  render: function() {
    return (
      <div>
        <form>
          <input type="search" placeholder="Search" onChange={this._handleSearchTextChange} ref="searchInput"/>
          <ul className="table-view">
            {this._getLogList()}
          </ul>
        </form>
      </div>
    );
  }

});

React.render(<LogApp service_id={service_id}/>, document.getElementById('content'));
