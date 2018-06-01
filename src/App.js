import React, {Component} from 'react';
import logo from './logo.svg';
import {GoogleApiWrapper} from 'google-maps-react';
import Map from './Map.js';
import './App.css';

class App extends Component {
    render() {
        const {loaded} = this.props;
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <h1 className="App-title">Welcome to React Neighbourhood Map</h1>
                </header>
                {/*Add Condition if loaded based on Udacity feedback*/}
                {loaded ? (
                    <Map google={this.props.google}/>
                ) : (
                    <div className="error-loading">
                        <p className="error-msg">Couldn't load Google Maps</p>
                    </div>
                )
                }
            </div>
        );
    }
}

export default GoogleApiWrapper({
    apiKey: 'AIzaSyD2BmXOGrCZQiAg5HJ6hU70BXc5v6Osr6M',
})(App)
