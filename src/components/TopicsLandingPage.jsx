import React, { Component } from 'react';
import { drizzleConnect } from 'drizzle-react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Loading from './Loading';
import Event from './Event';

import topicsJson from '../config/topics.json';

class TopicsLandingPage extends Component {
  constructor(props, context) {
      super(props);
	    this.contracts = context.drizzle.contracts;
	    this.eventCount = this.contracts['DaoEvents'].methods.getEventsCount.cacheCall();
	    this.perPage = 6;
      this.topicClick = this.topicClick.bind(this);
      this.compare = this.compare.bind(this)
	}

  topicClick(slug) {
    this.props.history.push("/topic/"+slug+"/"+1);
    window.scrollTo(0, 180);
    
  }

  caruselClick(location)
  {
    this.props.history.push(location);
    window.scrollTo(0, 80);
  }
  compare( a, b ) {
    if ( a.last_nom < b.last_nom ){
      return -1;
    }
    if ( a.last_nom > b.last_nom ){
      return 1;
    }
    return 0;
  }

	render() {
		let body = <Loading />;

		if (typeof this.props.contracts['DaoEvents'].getEventsCount[this.eventCount] !== 'undefined') {

			let count = Number(this.props.contracts['DaoEvents'].getEventsCount[this.eventCount].value);
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
					events_list.push(<Event key={i} id={i} 
            />);
				}

				let pagination = '';
				if (pages > 1) {
					let links = [];

					for (let i = 1; i <= pages; i++) {
						let active = i === currentPage ? 'active' : '';
						links.push(
							<li className={"page-item " + active} key={i}>
								<Link to={"/upcomingevents/" + i} className="page-link">{i}</Link>
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
			<div className="retract-page-inner-wrapper-alternative topicsDiv">
      <div className="topics-wrapper">
      <h2><i className="fa fa-calendar-alt"></i> Popular Topics</h2>
      <hr />
      <div className="row user-list mt-4">
      {
        topicsJson && topicsJson
          .filter(topic => topic.popular === "true")
          .map((topic, index) => {
            return (
              <div className="col-lg-4 pb-4 d-flex align-items-stretch" key={topic.slug}>
                <div className="topic" style={{ backgroundImage: "url(/images/topics/" + topic.image +")"}} onClick={() => {this.topicClick(topic.slug)}}>
                <div className="topic-caption"><h3>{topic.name}</h3><button className="btn sort_button">View Topic</button></div>

                </div>
              </div>
            );
          })
      }
      </div>
      <br /><br />

      <h2><i className="fa fa-calendar-alt"></i> All Topics</h2>
      <hr />
      <div className="row user-list mt-4">

        {
          topicsJson && topicsJson
            .map((topic, index) => {
              return (
                <div className="col-lg-4 pb-4 d-flex align-items-stretch" key={topic.slug}>
                  <div className="topic" style={{ backgroundImage: "url(/images/topics/" + topic.image +")"}} onClick={() => {this.topicClick(topic.slug)}}>
                  <div className="topic-caption"><h3>{topic.name}</h3><button className="btn sort_button">View Topic</button></div>

                  </div>
                </div>
              );
            })
        }
        </div>
      </div>
    </div>

    </React.Fragment>
		);
  }
  componentDidMount() {
		window.scroll({
			top: 0,
			behavior: 'smooth'
		  });
	}
}

TopicsLandingPage.contextTypes = {
    drizzle: PropTypes.object
}

const mapStateToProps = state => {
    return {
		contracts: state.contracts,
		accounts: state.accounts
    };
};

const AppContainer = drizzleConnect(TopicsLandingPage, mapStateToProps);
export default AppContainer;
