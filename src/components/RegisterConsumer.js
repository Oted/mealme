import React, { Component } from 'react';
import Geosuggest from 'react-geosuggest';

class RegisterConsumer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email : "",
      password : "",
      password_repeat : "",
      name : "",
      geo : null
    }
  }

  handleClick(event) {
    event.preventDefault();

    if (!this.state.email) {
      return this.setState({'error' : 'Email is not valid'});
    }

    if (!this.state.name) {
      return this.setState({'error' : 'Please select a name'});
    }

    if (this.state.password.length < 5) {
      return this.setState({'error' : 'Passwords must contain at least 5 characters'});
    }

    if (this.state.password !== this.state.password_repeat) {
      return this.setState({'error' : 'Passwords does not match'});
    }

    if (!this.state.geo) {
      return this.setState({'error' : 'Please select a location'});
    }

    this.props.dispatch({
      type: "register",
      register_type : 'Consumer',
      email: this.state.email,
      name: this.state.name,
      geo: this.state.geo,
      password: this.state.password
    });
  }

  render() {
    return (
      <div className="row login">
        <p> Please fill in the form to register! </p>
        <form className="form-horizontal" method="POST">
          {this.props.registerStatus ? <span style={{'color': 'red', 'float':'right'}}> {this.props.registerStatus} </span> : null}
          {this.state.error && !this.props.registerStatus ? <span style={{'color': 'red', 'float':'right'}}> {this.state.error} </span> : null}
          <div className="form-group">
            <label for="inputEmail3" className="col-sm-2 control-label">Email</label>
            <div className="col-sm-10">
              <input type="email" className="form-control" id="inputEmail3" placeholder="Email" onChange={(e) =>{this.setState({email:e.target.value})}}/>
            </div>
          </div>
          <div className="form-group">
            <label for="name" className="col-sm-2 control-label">Name</label>
            <div className="col-sm-10">
              <input type="name" className="form-control" id="name" placeholder="Nickname" onChange={(e) =>{this.setState({name:e.target.value})}}/>
            </div>
          </div>
          <div className="form-group">
            <label for="inputPassword3" className="col-sm-2 control-label">Password</label>
            <div className="col-sm-5">
              <input type="password" className="form-control" id="inputPassword3" placeholder="Password" onChange={(e) => this.setState({password:e.target.value})}/>
            </div>
            <div className="col-sm-5">
              <input type="password" className="form-control" id="inputPasswordConfirm3" placeholder="Confirm" onChange={(e) => this.setState({password_repeat:e.target.value})}/>
            </div>
          </div>
          <div className="form-group">
            <label className="col-sm-2 control-label">City</label>
            <div className="col-sm-10">
              <Geosuggest inputClassName="form-control" onSuggestSelect={(selected) => {this.setState({geo: selected})}}/>
            </div>
          </div>
          <div className="form-group">
            <div className="col-sm-offset-2 col-sm-10">
              <button type="submit" className="btn btn-default" onClick={(event) => this.handleClick(event)}>Register</button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default RegisterConsumer;
