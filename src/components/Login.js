import React, { Component } from 'react';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email : "",
      password : ""
    }
  }

  handleClick(event) {
    event.preventDefault();
    this.props.dispatch({
      type: "login",
      email: this.state.email,
      password: this.state.password
    })
  }

  render() {
    return (
      <div className="row login">
        <p> Please log in to continue </p>
        <form className="form-horizontal" method="POST">
          {this.props.loginStatus ? <span style={{'color': 'red', 'float':'right'}}> {this.props.loginStatus} </span> : null}
          <div className="form-group">
            <label for="inputEmail3" className="col-sm-2 control-label">Email</label>
            <div className="col-sm-10">
              <input type="email" className="form-control" id="inputEmail3" placeholder="Email" onChange={(e) =>{this.setState({email:e.target.value})}}/>
            </div>
          </div>
          <div className="form-group">
            <label for="inputPassword3" className="col-sm-2 control-label">Password</label>
            <div className="col-sm-10">
              <input type="password" className="form-control" id="inputPassword3" placeholder="Password" onChange={(e) => this.setState({password:e.target.value})}/>
            </div>
          </div>
          <div className="form-group">
            <div className="col-sm-offset-2 col-sm-10">
              <button type="submit" className="btn btn-default" onClick={(event) => this.handleClick(event)}>Sign in</button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default Login;
