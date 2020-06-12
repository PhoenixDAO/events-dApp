import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { drizzleConnect } from 'drizzle-react';
import PropTypes from 'prop-types';

import Loading from './Loading';
import Event from './Event';
import Web3 from 'web3';
import {Open_events_ABI, Open_events_Address} from '../config/OpenEvents';


class MyEvents extends Component {
    constructor(props, context) {
		super(props)
		this.state = {
			openEvents : '',
			blocks : 5000000,
			latestblocks : 6000000,
			loading : false,
			MyEvents : [],
			active_length : '',
			isOldestFirst:false,
			isActive:true,
			account:[],
			dateNow:''
		  };

		this.contracts = context.drizzle.contracts;
		this.events = this.contracts['OpenEvents'].methods.eventsOf.cacheCall(this.props.accounts[0]);
		this.perPage = 6;
		this.account = this.props.accounts[0];

		this.ActiveEvent = this.ActiveEvent.bind(this);
		this.PastEvent = this.PastEvent.bind(this);
		this.updateSearch = this.updateSearch.bind(this);
	}

	//Get Blockchain State
	async loadBlockchain(){
		const web3 = new Web3(new Web3.providers.WebsocketProvider('wss://rinkeby.infura.io/ws/v3/72e114745bbf4822b987489c119f858b'));
		const openEvents =  new web3.eth.Contract(Open_events_ABI, Open_events_Address);
		
		if (this._isMounted){
		this.setState({openEvents:openEvents});
		this.setState({MyEvents :[]});

		const dateTime = Date.now();
		const dateNow = Math.floor(dateTime / 1000);
		const blockNumber = await web3.eth.getBlockNumber();
		this.setState({dateNow})
		this.setState({blocks:blockNumber - 50000});
		this.setState({latestblocks:blockNumber});
		this.loadActiveEvents()
		
		//Listen For My Newly Created Events
		this.state.openEvents.events.CreatedEvent({filter:{owner:this.account},fromBlock: this.state.latestblocks, toBlock:'latest'})
		.on('data', (log) => setTimeout(()=> {
		if(this.state.isActive){
		this.setState({loading:true});
		
		this.setState({MyEvents :[...this.state.MyEvents ,log]});
		var newest = this.state.MyEvents 
		var newsort= newest.concat().sort((a,b)=> b.blockNumber- a.blockNumber);
	
		this.setState({MyEvents :newsort});
		this.setState({active_length:this.state.MyEvents.length})
		this.setState({loading:false})};
		
		},8000))
		}
	}

	//Get My Active Events on Blockchain
	async loadActiveEvents(){
		
		if (this._isMounted){
		this.setState({MyEvents:[],active_length:0}); }
	  
		this.state.openEvents.getPastEvents("CreatedEvent",{filter:{owner:this.account},fromBlock: 5000000, toBlock:'latest'})
		.then(events=>{
		this.setState({loading:true})
		var newest = events.filter((activeEvents)=>activeEvents.returnValues.time >=(this.state.dateNow));
		var newsort= newest.concat().sort((a,b)=> b.blockNumber- a.blockNumber);
		
		if (this._isMounted){
		this.setState({MyEvents:newsort,check:newsort});
		this.setState({loading:false})
		this.setState({active_length:this.state.MyEvents.length}); }
		 
		}).catch((err)=>console.error(err))
		
	  }
	
	//Get My Concluded Events on Blockchain
	async loadPastEvents(){
    
		if (this._isMounted){
		this.setState({MyEvents :[],active_length:0});}
		this.state.openEvents.getPastEvents("CreatedEvent",{filter:{owner:this.account},fromBlock: 5000000, toBlock:'latest'})
		.then(events=>{
		this.setState({loading:true})
		var newest = events.filter((activeEvents)=>activeEvents.returnValues.time <=(this.state.dateNow));
		var newsort= newest.concat().sort((a,b)=> b.blockNumber- a.blockNumber);
		
		if (this._isMounted){
		this.setState({MyEvents:newsort,check:newsort});
		this.setState({loading:false})
		this.setState({active_length:this.state.MyEvents.length}); }
		 
		}).catch((err)=>console.error(err))
	  }

	//Display My Concluded Events
	PastEvent=(e)=>{
		this.setState({
			isActive: false,
		},()=>{if(!this.state.isActive){
		this.loadPastEvents()
		this.props.history.push("/myevents/"+1)}})	
	  }

	//Display My Active Events
	ActiveEvent=(e)=>{
		this.setState({
			isActive: true,
		},()=>{if(this.state.isActive){
		this.loadActiveEvents()
		this.props.history.push("/myevents/"+1)}})
	  }

	//Search for My Events By Name
	updateSearch=(e)=>{
		let {value} = e.target
		this.setState({value},()=>{
		if(this.state.value !== ""){  
		var filteredEvents = this.state.check;
		filteredEvents = filteredEvents.filter((events)=>{
		return events.returnValues.name.toLowerCase().search(this.state.value.toLowerCase()) !==-1;
		
		
		})}else{ filteredEvents = this.state.check}
	
	  this.setState({MyEvents:filteredEvents,
		active_length:filteredEvents.length});
		this.props.history.push("/myevents/"+1)
	  })}

	render() {
		let body = <Loading />;

		if (typeof this.props.contracts['OpenEvents'].eventsOf[this.events] !== 'undefined') {
			let events = this.state.active_length;
			
			if (events === 0) {
				body = <p className="text-center not-found"><span role="img" aria-label="thinking">🤔</span>&nbsp;No events found. <a href="/createevent">Try creating one.</a></p>;
			} else {
				let count = this.state.active_length
			
				let currentPage = Number(this.props.match.params.page);
				if (isNaN(currentPage) || currentPage < 1) currentPage = 1;

				let end = currentPage * this.perPage;
				let start = end - this.perPage;
				if (end > count) end = count;
				let pages = Math.ceil(count / this.perPage);

				let myEvents = [];

        		for (let i = start; i < end; i++) {
         		myEvents.push(<Event 
            	key={this.state.MyEvents[i].returnValues.eventId} 
            	id={this.state.MyEvents[i].returnValues.eventId} 
            	ipfs={this.state.MyEvents[i].returnValues.ipfs} />);
				}

        //events.reverse();

				let pagination;

				if (pages > 1) {
					let links = [];
					for (let i = 1; i <= pages; i++) {
						let active = i === currentPage ? 'active' : '';
						links.push(
							<li className={"page-item " + active} key={i}>
								<Link to={"/myevents/" + i} className="page-link">{i}</Link>
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
					<div>
						<div className="row user-list mt-4">
						{myEvents}
						</div>
						{pagination}
					</div>
				;
			}
		}

		return (
			<div>

				<h2 className="col-md-10"><i className="fa fa-calendar-alt "></i> My{this.state.isActive ?' Active':' Past'}  Events</h2>
				<div className="input-group input-group-lg mt-5 mb-4">
				<button className="btn sort_button col-md-2 mx-3"  onClick={this.ActiveEvent} >Active Events</button>
				<button className="btn sort_button col-md-2 ml-3"  onClick={this.PastEvent} >Past Events</button>
        		<div className="input-group-prepend ml-5">
         		<span className="input-group-text search-icon " id="inputGroup-sizing-lg"><i className="fa fa-search"></i>&nbsp;Search </span>
        		</div> 
        		<input type="text" value={this.state.value} onChange={this.updateSearch.bind(this)} className="form-control col-md-5" aria-label="Large" aria-describedby="inputGroup-sizing-sm" />				
				</div>
				
				<hr />
				{body}
			</div>
		);
	}

	componentDidMount() {
		this._isMounted = true;	
		this.loadBlockchain();
		
		
		}

		
}
	
	

MyEvents.contextTypes = {
    drizzle: PropTypes.object
}

const mapStateToProps = state => {
    return {
		contracts: state.contracts,
		accounts: state.accounts
    };
};

const AppContainer = drizzleConnect(MyEvents, mapStateToProps);
export default AppContainer;
