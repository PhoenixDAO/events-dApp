import React, { Component } from 'react';
import {Calendar,momentLocalizer} from 'react-big-calendar';
import { Link } from 'react-router-dom';
import moment from 'moment';
import main from '../styles/main.css'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { API_URL, REPORT_EVENT } from "../utils/const";
import axios from "axios";
import { drizzleConnect } from "drizzle-react";
import PropTypes from "prop-types";

import Web3 from 'web3';
import {Open_events_ABI, Open_events_Address} from '../config/OpenEvents';

class Calendars extends Component {
    constructor(props) {

        super(props);
        this.state = {
            hideEvent: [],

            Events_Blockchain:[],
            activeEvents:'',
            latestblocks:6000000,
            blocks:5000000,
            events:[],
            Deleted_Events: [],

        }
        this._isMounted = false;
        this.account = this.props.accounts[0];
        console.log("this.account",this.account);
    }

    async loadBlockchain(){
    
        const web3 = new Web3(new Web3.providers.WebsocketProvider('wss://rinkeby.infura.io/ws/v3/72e114745bbf4822b987489c119f858b'));
        const openEvents =  new web3.eth.Contract(Open_events_ABI, Open_events_Address);
        
        if (this._isMounted){
        this.setState({openEvents});
        this.setState({Events_Blockchain:[]});}
        const dateTime = Date.now();
        const dateNow = Math.floor(dateTime / 1000);
        
        const blockNumber = await web3.eth.getBlockNumber();
        if (this._isMounted){
        this.setState({blocks:blockNumber - 50000});
        this.setState({latestblocks:blockNumber - 1});
        this.setState({Events_Blockchain:[]});}
      
        openEvents.getPastEvents("NewAndUpdatedEvent",{fromBlock: 5000000, toBlock:this.state.latestblocks})
        .then(events=>{
        if (this._isMounted){
        this.setState({loading:true})
        	const result = Object.values(
						events.reduce((a, c) => {
								a[c.returnValues.eventId] ||
									(a[c.returnValues.eventId] = Object.assign(c))
								return a;
							}, {})
						);
        this.setState({Events_Blockchain:result});
        console.log("all events",this.state.Events_Blockchain);
        this.setState({loading:false})
        this.setState({active_length:this.state.Events_Blockchain.length})
        
        }
         
        }).catch((err)=>console.error(err))
    
        //Listens for New Events
        openEvents.events.CreatedEvent({fromBlock: blockNumber, toBlock:'latest'})
        .on('data', (log) => setTimeout(()=> {
        if (this._isMounted){
        this.setState({loading:true});
        this.setState({Events_Blockchain:[...this.state.Events_Blockchain,log]});
        this.setState({active_length:this.state.Events_Blockchain.length})}
        this.setState({loading:false});
        },10000))

        await openEvents
        .getPastEvents("DeletedEvent", {
            fromBlock: 8181618,
            toBlock: this.state.latestblocks,
        })
        .then((events) => {
            console.log("eventsssss deletedEvents", events);
            this.setState({ Deleted_Events: events });
            return events;
        })
        .catch((err) => {
            console.error(err);
            this.setState({ Deleted_Events: [] });
        });

      }
      filterHideEvent = async () => {
		try {
			const get = await axios.get(`${API_URL}${REPORT_EVENT}`);
			console.log("get", get.data.result);
			this.setState({
				hideEvent: get.data.result,
			});
			return;
		} catch (error) {
			console.log("check error", error);
		}
	};
	
    goToEvent = (event_calendar)=>{
            let rawTitle = event_calendar.title;
            var titleRemovedSpaces = rawTitle;
	        titleRemovedSpaces = titleRemovedSpaces.replace(/ /g, '-');
            var pagetitle = titleRemovedSpaces.toLowerCase()
            .split(' ')
            .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
            .join(' ');
	        let titleURL;
            console.log("event-calendar",event_calendar);
            if (event_calendar.account=== this.account) {
                titleURL = "/event-stat/"+pagetitle+"/" + event_calendar.id;
            }
            else{
               titleURL = "/event/"+pagetitle+"/" + event_calendar.id;
            }
            this.props.history.push(titleURL);
        }
    
    render() {
        let body ='';
        const localizer = momentLocalizer(moment) // or globalizeLocalizer
        {
        let events_calendar = []
        let events_list = [];
        let skip = false;
        for (let i =0; i < this.state.Events_Blockchain.length; i++) {
            for (let j = 0; j < this.state.Deleted_Events.length; j++) {
                if (
                    this.state.Events_Blockchain[i].returnValues
                        .eventId ==
                    this.state.Deleted_Events[j].returnValues.eventId
                ) {
                    skip = true;
                }
            }
            if(!skip){
                for (let j = 0; j < this.state.hideEvent.length; j++) {
                    if (
                        this.state.Events_Blockchain[i].returnValues
                            .eventId ==
                        this.state.hideEvent[j].id
                    ) {
                        skip = true;
                    }
                }
            }
            if (!skip) {
                events_list.push(this.state.Events_Blockchain[i]);
            }
            skip = false;
        }
        for(var i = 0;i<events_list.length;i++){
            events_calendar.push({
            id:events_list[i].returnValues.eventId,
            title:events_list[i].returnValues.name,
            start:parseInt(events_list[i].returnValues.time,10)*1000,
            end:parseInt(events_list[i].returnValues.time,10)*1000,
            allDay:true,
            account:events_list[i].returnValues[10],
                })
            }
            console.log("calendar event",events_calendar);

        body = 
            <div style={{ height: '500pt'}}>
            <Calendar
              localizer={localizer}
              events={events_calendar}
              defaultDate={moment().toDate()}
              onSelectEvent={events_calendar =>this.goToEvent(events_calendar)}
              views={['month','day','agenda']} 
            />
            </div>          
            }
        
       return (
        <div className="retract-page-inner-wrapper-alternative calendarDiv">
        <div className="pl-2 pr-2">
            <h2 className="col-md-10 col-sm-12 col-xs-12"><i className="fa fa-calendar-alt"></i> Event Calendar</h2> 
        <hr/>
            {body}
          </div>      
        </div>  
        )
    }

    componentDidMount(){
        this.props.executeScroll();
        // window.scroll({
		// 	top: 0,
		// 	behavior: 'smooth'
		//   });
        this._isMounted = true;
        this.loadBlockchain();
        this.filterHideEvent();


    }

    componentWillUnmount(){
        this._isMounted = false;
    }
}
Calendars.contextTypes = {
	drizzle: PropTypes.object,
};

const mapStateToProps = (state) => {
	return {
		accounts: state.accounts,
	};
};

const AppContainer = drizzleConnect(Calendars, mapStateToProps);
export default AppContainer;