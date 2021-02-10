import React, { Component } from "react";
import { drizzleConnect } from "drizzle-react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Carousel from "react-bootstrap/Carousel";

// Import dApp Components
import Loading from "./Loading";
import PhoenixDAOLoader from "./PhoenixDAOLoader";
import Event from "./Event";
import Web3 from "web3";
import { Open_events_ABI, Open_events_Address } from "../config/OpenEvents";

// TODO: Make slides dynamic: import slidesJson from '../config/slides.json';
import topicsJson from "../config/topics.json";
import eventCTAsJson from "../config/event_ctas.json";

class FindEvents extends Component {
  constructor(props, context) {
    super(props);
    this.state = {
      openEvents: '',
      upload: false,
      blocks: 5000000,
      latestblocks: 6000000,
      loading: true,
      Events_Blockchain: [],
      Deleted_Events:[],
      active_length: '',
      isOldestFirst: false,
      event_copy: [],
      prevPath: -1
    };
    // const a = this.props.location.pathname.split("/")
    // console.log("this.props.location",a[a.length-1])
    // console.log("this.props",this.props)
    this.contracts = context.drizzle.contracts;
    this.eventCount = this.contracts['DaoEvents'].methods.getEventsCount.cacheCall();
    this.perPage = 6;
    this.topicClick = this.topicClick.bind(this);
    this.myRef = React.createRef()

    this.toggleSortDate = this.toggleSortDate.bind(this);


  }

  topicClick(slug) {
    this.props.history.push("/topic/" + slug + "/" + 1);
    window.scrollTo(0, 80);
  }

  readMoreClick(location) {
    this.props.history.push(location);
    // window.scrollTo(0, 0);
  }

  ctasClick(slug) {
    this.props.history.push("/" + slug);
    window.scroll({
			top: 0,
			behavior: 'smooth'
		  });
  }

  caruselClick(location) {
    this.props.history.push(location);
    // window.scrollTo(0, 80);
  }
  executeScroll = () => this.myRef.current.scrollIntoView()


  //Loads Blockhain Data,
  async loadBlockchain() {

    const web3 = new Web3(new Web3.providers.WebsocketProvider('wss://rinkeby.infura.io/ws/v3/72e114745bbf4822b987489c119f858b'));
    const openEvents = new web3.eth.Contract(Open_events_ABI, Open_events_Address);

    if (this._isMounted) {
      this.setState({ openEvents });
    }
    const dateTime = Date.now();
    const dateNow = Math.floor(dateTime / 1000);

    const blockNumber = await web3.eth.getBlockNumber();
    if (this._isMounted) {
      this.setState({ blocks: blockNumber - 50000 });
      this.setState({ latestblocks: blockNumber - 1 });
      this.setState({ Events_Blockchain: [] });
    }

    await openEvents.getPastEvents("DeletedEvent", { fromBlock: 7654042, toBlock: this.state.latestblocks })
    .then(events => {
      console.log("eventsssss deletedEvents",events)
      this.setState({ Deleted_Events: events});
      return events
    }).catch((err) => {
      console.error(err)
      this.setState({Deleted_Events:[]})
    })

    await openEvents.getPastEvents("CreatedEvent", { fromBlock: 7654042, toBlock: this.state.latestblocks })
      .then(async events => {
        if (this._isMounted) {
          this.setState({ loading: true })
          let allEvents=events;
          let deletedEvents=[];
          console.log("eventsssss all Events",allEvents)
         
          // deletedEvents.map((deletedEvent)=> allEvents.pop(deletedEvent.returnValues.eventId))
          console.log("eventsssss after filter",allEvents)

          var newsort = allEvents.concat().sort((a, b) =>
            b.blockNumber - a.blockNumber)
            .filter((activeEvents =>
              activeEvents.returnValues.time >= (dateNow) ));
          
              // console.log("eventsssss ",newsort)

          this.setState({ Events_Blockchain: newsort, event_copy: newsort });
          this.setState({ active_length: this.state.Events_Blockchain.length })
          this.setState({ loading: false });
        }

      }).catch((err) => console.error(err))

     

      

    //Listens for New Events
    openEvents.events.CreatedEvent({ fromBlock: this.state.blockNumber, toBlock: 'latest' })
      .on('data', (log) => setTimeout(() => {
        if (this._isMounted) {
          // this.setState({loading:true});

          this.setState({ Events_Blockchain: [...this.state.Events_Blockchain, log] });
          var newest = this.state.Events_Blockchain
          var newsort = newest.concat().sort((a, b) => b.blockNumber - a.blockNumber);

          //this.setState({incoming:false});
          this.setState({ Events_Blockchain: newsort, event_copy: newsort });
          this.setState({ active_length: this.state.Events_Blockchain.length })
        }
        //this.setState({loading:false});
      }, 10000))
  }

  // async getDeletedEvents(){
  //   await openEvents.getPastEvents("DeletedEvent", { fromBlock: 7654042, toBlock: this.state.latestblocks })
  //   .then(events => {
  //     console.log("eventsssss deletedEvents",events)
  //     this.setState({ Deleted_Events: events});
  //     return events
  //   }).catch((err) => {
  //     console.error(err)
  //     this.setState({Deleted_Events:[]})
  //   })
  // }

  //Search Active Events By Name
  updateSearch = (e) => {
    let { value } = e.target
    this.setState({ value }, () => {
      try {
        if (this.state.value !== "") {

          var filteredEvents = this.state.event_copy;
          filteredEvents = filteredEvents.filter((events) => {
            return events.returnValues.name.toLowerCase().search(this.state.value.toLowerCase()) !== -1;
          })
        }
        else { filteredEvents = this.state.event_copy }
      }
      catch (e) {
        console.log(e);
      }
      this.setState({
        Events_Blockchain: filteredEvents,
        active_length: filteredEvents.length
      });
      this.props.history.push("/upcomingevents/" + 1)
    })
  }

  //Sort Active Events By Date(Newest/Oldest)
  toggleSortDate = (e) => {
    let { value } = e.target;
    this.setState({ value }, () => {
      const { Events_Blockchain } = this.state
      const { ended } = Events_Blockchain
      var newPolls = ended

      if (this.state.isOldestFirst) {
        newPolls = Events_Blockchain.concat().sort((a, b) => b.returnValues.eventId - a.returnValues.eventId)
      }
      else {
        newPolls = Events_Blockchain.concat().sort((a, b) => a.returnValues.eventId - b.returnValues.eventId)
      }

      this.setState({
        isOldestFirst: !this.state.isOldestFirst,
        Events_Blockchain: newPolls
      });
    })
  }

  render() {
    // console.log("check find events disable status", this.props)
    let body = <PhoenixDAOLoader />;

    if (typeof this.props.contracts['DaoEvents'].getEventsCount[this.eventCount] !== 'undefined' && this.state.active_length !== 'undefined') {
      //let count = Number(this.props.contracts['DaoEvents'].getEventsCount[this.eventCount].value);
      let count = this.state.Events_Blockchain.length
      if (this.state.loading) {
        body = <PhoenixDAOLoader />
      }
      else if (count === 0 && !this.state.loading) {
        body = <p className="text-center not-found"><span role="img" aria-label="thinking">🤔</span>&nbsp;No events found. <a href="/createevent">Try creating one.</a></p>;
      } else {
        let currentPage = Number(this.props.match.params.page);
        if (isNaN(currentPage) || currentPage < 1) currentPage = 1;

        let end = currentPage * this.perPage;
        let start = end - this.perPage;
        if (end > count) end = count;
        let pages = Math.ceil(count / this.perPage);

        let events_list = [];
        let skip=false;
        for (let i = start; i < end; i++) {
          for(let j=0 ; j<this.state.Deleted_Events.length;j++){
            if(this.state.Events_Blockchain[i].returnValues.eventId == this.state.Deleted_Events[j].returnValues.eventId){
              skip=true
            }
          }
          if(!skip){
            
            events_list.push(<Event disabledStatus={this.props.disabledStatus} inquire={this.props.inquire}
              key={this.state.Events_Blockchain[i].returnValues.eventId}
              id={this.state.Events_Blockchain[i].returnValues.eventId}
              ipfs={this.state.Events_Blockchain[i].returnValues.ipfs} />);
          }
          skip=false
        }
          

        events_list.reverse();

        let pagination = '';
        if (pages > 1) {
          let links = [];

          if (pages > 5 && currentPage >= 3) {
            for (let i = currentPage - 2; i <= currentPage + 2 && i <= pages; i++) {
              let active = i === currentPage ? 'active' : '';
              links.push(
                <li className={"page-item " + active} key={i}>
                  <Link to={"/upcomingevents/" + i} onClick={()=> this.setState({prevPath:currentPage})}className="page-link" >{i}</Link>
                </li>
              );
              if (this.state.prevPath!=-1) {
                console.log("prevPath",this.state.prevPath)
                this.executeScroll({ behavior: "smooth", block: "start" });
              }
            }
          }

          else if (pages > 5 && currentPage < 3) {
            for (let i = 1; i <= 5 && i <= pages; i++) {
              let active = i === currentPage ? 'active' : '';
              links.push(
                <li className={"page-item " + active} key={i}>
                  <Link to={"/upcomingevents/" + i} onClick={()=> this.setState({prevPath:currentPage})}className="page-link" >{i}</Link>
                </li>
              );
              if (this.state.prevPath!=-1) {
                console.log("prevPath",this.state.prevPath)
                this.executeScroll({ behavior: "smooth", block: "start" });
              }
            }
          }
          else {
            for (let i = 1; i <= pages; i++) {
              let active = i === currentPage ? 'active' : '';
              links.push(
                <li className={"page-item " + active} key={i}>
                  <Link to={"/upcomingevents/" + i} onClick={()=> this.setState({prevPath:currentPage})}className="page-link" >{i}</Link>
                </li>
              );
              if (this.state.prevPath!=-1) {
                console.log("prevPath",this.state.prevPath)
                this.executeScroll({ behavior: "smooth", block: "start" });
              }

            }
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


    return (
      <React.Fragment>
        {/* <Carousel className="retract-page-inner-wrapper">
          <Carousel.Item className="slide1">
            <img className="d-block slider w-100" src="/images/topics/music.jpg" alt="First slide" />
            <Carousel.Caption>
              <h3>Check out a Concert</h3>
              <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
              <button className="btn btn-dark" onClick={() => { this.caruselClick("/topic/music/1") }}><i className="fas fa-ticket-alt"></i> Find Events</button>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item className="slide2">
            <img className="d-block slider w-100 " src="/images/topics/charity-and-causes.jpg" alt="First slide" />
            <Carousel.Caption>
              <h3>Support a Local Charity</h3>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              <button className="btn btn-dark" onClick={() => { this.caruselClick("/topic/charity-and-causes/1") }}><i className="fas fa-ticket-alt"></i> Find Events</button>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item className="slide3">
            <img className="d-block w-100 slider" src="/images/topics/parties.jpg" alt="First slide" />
            <Carousel.Caption>
              <h3>Attend an Exclusive Party</h3>
              <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
              <button className="btn btn-dark" onClick={() => { this.caruselClick("/topic/parties/1") }}><i className="fas fa-ticket-alt"></i> Find Events</button>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item className="slide4">
            <img className="d-block w-100 slider" src="/images/topics/sports-and-fitness.jpg" alt="First slide" />
            <Carousel.Caption>
              <h3>Play a New Sport</h3>
              <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
              <button className="btn btn-dark" onClick={() => { this.caruselClick("/topic/sports-and-fitness/1") }}><i className="fas fa-ticket-alt"></i> Find Events</button>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item className="slide5">
            <img className="d-block w-100 slider" src="/images/slides/slide5.png" alt="First slide" />
            <Carousel.Caption>
              <h3>Create and Sell Tickets</h3>
              <p>Create your own event, it takes only a minute.</p>
              <button className="btn btn-dark" onClick={() => { this.caruselClick("/createevent") }}><i className="fas fa-ticket-alt"></i> Create Event</button>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
				 */}
				<div
				//  className="retract-page-inner-wrapper-alternative dash"
				>
					<br />
					<br />

					<div
						className="input-group input-group-lg"
						ref={this.myRef}
					>
						<div className="input-group-prepend ">
							<span
								className="input-group-text search-icon"
								id="inputGroup-sizing-lg"
							>
								<i className="fa fa-search"></i>&nbsp;Search{" "}
							</span>
						</div>
						<input
							type="text"
							value={this.state.value}
							onChange={this.updateSearch.bind(this)}
							className="form-control"
							aria-label="Large"
							aria-describedby="inputGroup-sizing-sm"
						/>
					</div>

					<br />
					<br />

					<div>
						<div className="row row_mobile">
							<h2 className="col-lg-10 col-md-9 col-sm-8">
								<i className="fa fa-calendar-alt"></i> Upcoming
								Events
							</h2>
							<button
								className="btn sort_button btn-dark col-lg-2 col-md-3 col-sm-3"
								value={this.state.value}
								onClick={this.toggleSortDate}
								onChange={this.toggleSortDate.bind(this)}
							>
								{this.state.isOldestFirst
									? "Sort: Oldest"
									: "Sort: Newest"}
							</button>
						</div>

						<hr />
						{body}
					</div>

					<br />
					<br />

					<div className="topics-wrapper">
						{/*
      <h2><i className="fa fa-calendar-alt"></i> Browse Events By</h2>
      <hr />

        <div className="row user-list mt-4">
          {eventCTAsJson.map(eventCTA => (
            <div className="col-lg-4 pb-4 d-flex align-items-stretch" key={eventCTA.slug}>
              <div className="topic" style={{ backgroundImage: "url(/images/cta"+eventCTA.image+")"}} onClick={() => {this.ctasClick(eventCTA.slug)}}>
              <div className="topic-caption"><h3>{eventCTA.name}</h3><button className="btn">View Events</button></div>
              </div>
            </div>
          ))}

          <button className="btn read-more" onClick={() => {this.readMoreClick("/findevents/1")}}>All Events</button>
        </div>
        <br /><br />
        */}

						<h2>
							<i className="fa fa-calendar-alt"></i> Popular
							Topics
						</h2>
						<hr />
						<div className="row user-list mt-4">
							{topicsJson &&
								topicsJson
									.filter((topic) => topic.popular === "true")
									.map((topic, index) => {
										return (
											<div
												className="col-lg-4 pb-4 d-flex align-items-stretch"
												key={topic.slug}
											>
												<div
													className="topic"
													style={{
														backgroundImage:
															"url(/images/topics/" +
															topic.image +
															")",
													}}
													onClick={() => {
														this.topicClick(
															topic.slug
														);
													}}
												>
													<div className="topic-caption">
														<h3>{topic.name}</h3>
														<button className="btn">
															View Topic
														</button>
													</div>
												</div>
											</div>
										);
									})}

							<button
								className="btn read-more"
								onClick={() => {
									this.readMoreClick("/topics");
								}}
							>
								All Topics
							</button>
						</div>
					</div>
				</div>
			</React.Fragment>
		);
	}

	componentDidMount() {
		if (this.state.prevPath == -1) {
			this.props.executeScroll({ behavior: "smooth", block: "start" });
		}
		this._isMounted = true;
		this.loadBlockchain();
	}

	componentWillUnmount() {
		this._isMounted = false;
	}
}

FindEvents.contextTypes = {
	drizzle: PropTypes.object,
};

const mapStateToProps = (state) => {
	return {
		contracts: state.contracts,
		accounts: state.accounts,
	};
};

const AppContainer = drizzleConnect(FindEvents, mapStateToProps);
export default AppContainer;
