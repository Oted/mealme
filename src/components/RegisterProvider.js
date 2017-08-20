import React, { Component } from 'react';
import Geosuggest from 'react-geosuggest';

class RegisterProvider extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email : "",
      password : "",
      password_repeat : "",
      name : "",
      geo : null,
      place : null,
      description: "",
      website: "",
      price_range: null,
      images : []
    }
  }

  onSelect(selected) {
    delete selected.gmaps['address_components'];
    delete selected.gmaps['matchedSubstrings'];

    this.setState({geo: selected});

    const service = new window.google.maps.places.PlacesService(document.createElement('div'));
    service.getDetails({placeId: selected.placeId}, (place, status) => {
      if (!place) {
        return;
      }

      delete place['address_components'];
      delete place['adr_address'];
      delete place['geometry'];
      delete place['icon'];
      delete place['html_attributions'];

      this.setState({
        website: place.website || null,
        name: place.name || "",
        place,
        address: place.formatted_address,
        images: (place.photos || []).map(p => { return p.getUrl({maxWidth: 640, maxHeight: 480})})
      });
    });
  }

  handleClick(event) {
    event.preventDefault();

    if (!this.state.email) {
      return this.setState({'error' : 'Email is not valid'});
    }

    if (!this.state.description) {
      return this.setState({'error' : 'Please provide a description'});
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
      register_type : 'Provider',
      email: this.state.email,
      name: this.state.name,
      description: this.state.description,
      geo: this.state.geo,
      password: this.state.password,
      place: this.state.place,
      price_range: this.state.price_range,
      website: this.state.website || null,
      images: this.state.images
    });
  }

  render() {
    return (
      <div className="row login">
        <p> Please fill in the form to register your restaurant! </p>
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
            <label className="col-sm-2 control-label">Search your restaurant</label>
            <div className="col-sm-10">
              <Geosuggest inputClassName="form-control" onSuggestSelect={(selected) => {this.onSelect(selected)}}/>
            </div>
          </div>
          <div className="form-group">
            <label for="name" className="col-sm-2 control-label">Restaurant name</label>
            <div className="col-sm-10">
              <input value={this.state.name} type="name" className="form-control" id="name" placeholder="Name" onChange={(e) =>{this.setState({name:e.target.value})}}/>
            </div>
          </div>
          <div className="form-group">
            <label for="address" className="col-sm-2 control-label">Address</label>
            <div className="col-sm-10">
              <input value={this.state.address} type="address" className="form-control" id="address" placeholder="Address"  onChange={(e) =>{this.setState({address:e.target.value})}}/>
            </div>
          </div>
          <div className="form-group">
            <label for="website" className="col-sm-2 control-label">Restaurant website</label>
            <div className="col-sm-10">
              <input value={this.state.website} type="name" className="form-control" id="website" placeholder="Company website"  onChange={(e) =>{this.setState({website:e.target.value})}}/>
            </div>
          </div>
          <div className="form-group">
            <label className='col-sm-2 control-label' for="exampleTextarea">Description</label>
            <div className="col-sm-10">
              <textarea className="form-control" placeholder="Provide a description for your custormers" id="exampleTextarea" rows="3" onChange={(e) => this.setState({description:e.target.value})}></textarea>
            </div>
          </div>
          <div className="form-group">
            <label className="col-sm-2 control-label" for="exampleSelect1">Select price range</label>
            <div className="col-sm-3">
              <select title="Nothing selected.." className="form-control selectpicker" id="exampleSelect1" onChange={(e) => this.setState({price_range:e.target.value})}>
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
              </select>
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
            <div className="col-sm-offset-2 col-sm-10">
              <button type="submit" className="btn btn-default" onClick={(event) => this.handleClick(event)}>Register</button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default RegisterProvider;
