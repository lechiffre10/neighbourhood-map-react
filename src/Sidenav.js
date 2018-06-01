import React, {Component} from 'react';
import './index.css'
import NavItem from './NavItem';

class Sidenav extends Component {

    changeOption = (event) =>{
        let choice = event.target.value;
        this.props.filter(choice);
        let locations = this.props.locations.filter(location => location.visible === true);
        this.setState({locations});
    };



    render() {
        const {tips,map,infoWindow,markers,searchQuery} = this.props;
        return (
            <div className='side-nav-container'>
                <div className="side-nav">
                    <select name="filter-options" tabIndex="1" onChange={this.changeOption} defaultValue={searchQuery} aria-label="Filter markers by type">
                        <option value="all">All</option>
                        <option value="restaurant">Restaurants</option>
                        <option value="cafe">Cafe</option>
                        <option value="lounge">Lounge</option>
                        <option value="bakery">Bakery</option>
                    </select>

                    <ul className="location-list">
                        {
                            markers.map(marker => (
                                <NavItem  map={map} tips={tips} marker={marker} key={marker.title} infoWindow={infoWindow} />
                            ))
                        }
                    </ul>
                </div>
            </div>
        )
    };
}


export default Sidenav;