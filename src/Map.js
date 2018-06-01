import React, {Component} from 'react';
import './index.css';
import Sidenav from './Sidenav';

const foursquare = require('react-foursquare')({
    clientID: 'NHSTFAMXHSXSAK0G3CNK2NYVGI1SZHJ1OAW2HYHE3CUBQRCW',
    clientSecret: 'P15LQCN3WB3HEHF0W2ISVIIAWE2DPCBRUGEE03TCYTSORVK2'
});

class Map extends Component {
    state = {
        map: {},
        locations: [
            {
                title: 'Romados Rotisserie',
                type: 'restaurant',
                venue_id: '4ad4c06ef964a520ddfa20e3',
                location: {lat: 45.5193103, lng: -73.5829365},
                visible: true
            },
            {
                title: 'Tommy Cafe',
                type: 'cafe',
                venue_id: '556467ea498e21a8004aabc5',
                location: {lat: 45.50274, lng: -73.556749},
                visible: true
            },
            {
                title: 'Reservoir',
                type: 'restaurant',
                venue_id: '4ae22438f964a5201e8b21e3',
                location: {lat: 45.5172636, lng: -73.5814637},
                visible: true
            },
            {
                title: 'La Banquise',
                type: 'restaurant',
                venue_id: '4adb9549f964a520282921e3',
                location: {lat: 45.5253521, lng: -73.5769568},
                visible: true
            },
            {
                title: 'Hof Kelsten',
                type: 'bakery',
                venue_id: '5255d7a911d23773b4450521',
                location: {lat: 45.5202665, lng: -73.589293},
                visible: true
            }
        ],
        infoWindow: {},
        markers: [],
        searchQuery: 'all',
        tips: []
    };
    //function to filter based on type of location
    filter = (searchQuery) => {
        const map = this.state.map;
        const markers = this.state.markers;
        //clear map
        markers.forEach(marker => marker.setMap(null))

        const selectLocations = this.state.locations.map((location) => {
            if ((location.type === searchQuery) || (searchQuery === 'all')) {
                location.visible = true
            } else {
                location.visible = false
            }
            return location
        });

        this.setState({selectLocations, searchQuery});
        this.setMarkers(map)

    };


    componentDidMount() {
        this.loadMap(); // call loadMap function to load the google map
        console.log(this.loadMap);
        let tips = [];
        this.state.locations.forEach(location => {
            const params = {'venue_id': location.venue_id, 'sort': 'popular'};
            foursquare.venues.getVenueTips(params).then((response) => {
                // assemble photo via API instructions
                if (response.meta.code === 200) {
                    tips.push({text: response.response.tips.items[0].text, title: location.title})
                } else {
                    tips.push({text:"Sorry Couldn't retrieve data from Foursquare, but I'm sure this venue is great!", title: location.title})
                }

            }).then(() => this.setState({tips})).catch(e=>console.log(e))
        })
    }

    setMarkers(map) {

        let markers = this.state.locations.filter(location => location.visible).map(location => {
            const marker = new window.google.maps.Marker({
                position: {lat: location.location.lat, lng: location.location.lng},
                map,
                title: location.title
            });

            marker.addListener('click', () => {
                this.state.map.panTo(marker.getPosition());
                this.state.infoWindow.setContent(`
                    <div tabIndex="1" name=${marker.title}>
                        <p>${marker.title}</p>
                        <p>${this.state.tips[0].text}</p>
                        <p>Tip provided by <a tabIndex="1" href="https://foursquare.com/">FOURSQUARE</a></p>
                    </div>`);
                this.state.infoWindow.open(map, marker)
            });

            marker.addListener('mouseover', function() {
                this.setAnimation(window.google.maps.Animation.BOUNCE);
                setTimeout(() => this.setAnimation(null), 400)
            });

            marker.addListener('mouseout', function() {
                this.setAnimation(null)
            });

            return marker;
        });
        this.setState({markers})
    }

    //LoadMap function made with help from https://www.fullstackreact.com/articles/how-to-write-a-google-maps-react-component/
    loadMap() {
        //Check if Google props has data and Map is loaded --Based on feedback
        if(this.props && this.props.google) {
            const map = new window.google.maps.Map(document.getElementById('map'), {
                center: {lat: 45.52, lng: -73.58},
                zoom: 11,
            });

            const infoWindow = new window.google.maps.InfoWindow({
                content: 'content'
            });
            this.setState({map, infoWindow});
            this.setMarkers(map);
        }
    }


    render() {
        const {searchQuery, locations, map, infoWindow, markers, tips} = this.state;
        const style = {
            width: '80vw',
            height: '90vh'
        }
        return (
            <div className="container" role="main">
                <div className="map-container">
                    <div id="map" aria-hidden="true" style={style} role="application"/>
                </div>

                <Sidenav searchQuery={searchQuery} locations={locations} tips={tips} markers={markers} map={map}
                         infoWindow={infoWindow} filter={this.filter}/>
            </div>
        )
    }
}


export default Map;