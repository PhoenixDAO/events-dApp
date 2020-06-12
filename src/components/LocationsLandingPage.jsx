import React, { Component } from 'react';
import { drizzleConnect } from 'drizzle-react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Carousel from 'react-bootstrap/Carousel'

import Loading from './Loading';
import Event from './Event';

import statesJson from '../config/states.json';
import locationsJson from '../config/location_ctas.json';


class LocationsLandingPage extends Component {
  constructor(props, context) {
      super(props);
	    this.contracts = context.drizzle.contracts;
	    this.eventCount = this.contracts['OpenEvents'].methods.getEventsCount.cacheCall();
	    this.perPage = 6;
      this.topicClick = this.topicClick.bind(this);
	}

  topicClick(slug) {
    this.props.history.push(slug);
    window.scrollTo(0, 0);
  }

	render() {
		let body = <Loading />;

		if (typeof this.props.contracts['OpenEvents'].getEventsCount[this.eventCount] !== 'undefined') {
			let count = Number(this.props.contracts['OpenEvents'].getEventsCount[this.eventCount].value);
			if (count === 0) {
				body = <p className="text-center not-found"><span role="img" aria-label="thinking">🤔</span>&nbsp;No events found. <a href="/createevent">Try creating one.</a></p>;
			} else {
				let currentPage = Number(this.props.match.params.page);
				if (isNaN(currentPage) || currentPage < 1) currentPage = 1;

				let end = currentPage * this.perPage;
				let start = end - this.perPage;
				if (end > count) end = count;
				let pages = Math.ceil(count / this.perPage);

				let events_list = [];

				for (let i = start; i < end; i++) {
					events_list.push(<Event key={i} id={i} />);
				}

				let pagination = '';
				if (pages > 1) {
					let links = [];

					for (let i = 1; i <= pages; i++) {
						let active = i === currentPage ? 'active' : '';
						links.push(
							<li className={"page-item " + active} key={i}>
								<Link to={"/findevents/" + i} className="page-link">{i}</Link>
							</li>
						);
					}

					pagination =
						<nav>
							<ul className="pagination justify-content-center">
								{links}
							</ul>
						</nav>
					;
				}

				body =
					<div >
						<div className="row user-list mt-4">
							{events_list}
						</div>
						{pagination}
					</div>
				;
			}
		}

		return(
      <React.Fragment>
      <Carousel className="retract-page-inner-wrapper">
          <Carousel.Item className="slide1">
            <img className="d-block w-100" src="/images/slides/states/clematis-florida.jpg" alt="First slide" />
            <Carousel.Caption>
              <h3>Discover Clematis St.</h3>
              <p>Bars, restaurants, ocean, it has it all.</p>
              <button className="btn btn-dark"><i className="fas fa-ticket-alt"></i> Find Events</button>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item className="slide2">
          <img className="d-block w-100" src="/images/slides/states/belmar-colorado.jpg" alt="First slide" />
            <Carousel.Caption>
              <h3>Discover Belmar, CO</h3>
              <p>A downtown with it all 10 minutes from Denver and 10 minutes to the mountains.</p>
              <button className="btn btn-dark"><i className="fas fa-ticket-alt"></i> Find Events</button>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>

			<div className="retract-page-inner-wrapper-alternative">

      <br /><br />

      <div className="topics-wrapper">
      <h2><i className="fa fa-calendar-alt"></i> Browse Locations</h2>
      <hr />
        <div className="row user-list mt-4">
          {locationsJson.map(location => (
            <div className="col-lg-4 pb-4 d-flex align-items-stretch" key={location.slug}>
              <div className="topic" style={{ backgroundImage: "url(/images/ctas/" + location.image +")"}} onClick={() => {this.topicClick(location.slug)}}>
              <div className="topic-caption"><h3>{location.name}</h3><button className="btn">View Location</button></div>
              </div>
            </div>
            ))}
        </div>
        <br /><br />
      <h2><i className="fa fa-calendar-alt"></i> Browse States</h2>
      <hr />
        <div className="row user-list mt-4">
          {statesJson.map(state => (
            <div className="col-lg-4 pb-4 d-flex align-items-stretch" key={state.slug}>
              <div className="topic" style={{ backgroundImage: "url(/images/states/" + state.image +")"}} onClick={() => {this.topicClick("/locations/state/"+state.slug)}}>
              <div className="topic-caption"><h3>{state.name}</h3><button className="btn">View Location</button></div>
              </div>
            </div>
            ))}
        </div>
      </div>
    </div>

    </React.Fragment>
		);
	}
}

LocationsLandingPage.contextTypes = {
    drizzle: PropTypes.object
}

const mapStateToProps = state => {
    return {
		contracts: state.contracts,
		accounts: state.accounts
    };
};

const AppContainer = drizzleConnect(LocationsLandingPage, mapStateToProps);
export default AppContainer;
