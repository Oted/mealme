import React, { Component } from 'react';
import Login from './Login';
import RegisterConsumer from './RegisterConsumer';
import RegisterProvider from './RegisterProvider';

class App extends Component {
  constructor(props) {
    super(props);

    this.props.dispatch({'type' : 'refresh'});
    setInterval(() => {
      this.props.dispatch({'type' : 'refresh'});
    }, 10000);
  }

  render() {
    return (
      <div className="app container">
        {this.props.user ?
          <div>
            <span> welcome {this.props.user.name} </span>
            <div onClick={()=>this.props.dispatch({'type' : 'logout'})}> logout </div>
          </div> :
          <div>
            <Login loginStatus={this.props.loginStatus} dispatch={this.props.dispatch}/>
            <RegisterConsumer registerStatus={this.props.registerStatus} dispatch={this.props.dispatch}/>
            <RegisterProvider registerStatus={this.props.registerStatus} dispatch={this.props.dispatch}/>
          </div>
        }
      </div>
    );
  }
}

export default App;
