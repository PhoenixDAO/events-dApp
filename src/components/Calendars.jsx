import React, { Component } from 'react';
import {Calendar,momentLocalizer} from 'react-big-calendar';

// import { Link } from 'react-router-dom';
import moment from 'moment';
// import main from '../styles/main.css'

import 'react-big-calendar/lib/css/react-big-calendar.css';
import { API_URL, REPORT_EVENT,graphURL } from "../config/const";

import axios from "axios";
import { drizzleConnect } from "drizzle-react";
import PropTypes from "prop-types";
// import {INFURA_WEB_URL} from "../config/const";
// import Web3 from 'web3';
// import {Open_events_ABI, Open_events_Address} from '../config/OpenEvents';

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
    }

    async loadBlockchain() {
		// GRAPH BLOCK //
			await axios({
				url: graphURL,
				method: 'post',
				data: {
				  query: `
				  {
					eventsRemoveds {
					  id
					  eventId
					}
				  }
				  `
				}
			}).then((graphDeletedEvents)=>{
				if(!graphDeletedEvents.data || !graphDeletedEvents.data.data == 'undefined'){
					this.setState({ Deleted_Events: [] });
				}else{
					this.setState({ Deleted_Events: graphDeletedEvents.data.data.eventsRemoveds });
				}
			}).catch((err)=>{
				console.error(err);
				this.setState({ Deleted_Events: [] });
			})
			

		await axios({
			url: graphURL,
			method: 'post',
			data: {
			  query: `
			  {
				events {
				  id
				  eventId
				  name
				  time
				  price
				  token
				  limited
				  seats
				  sold
				  ipfs
				  category
				  owner
				  revenueOfEvent
				}
			  }
			  `
			}
		}).then((graphEvents)=>{
			// console.log("GraphQL query response",Date.now(),graphEvents.data.data.events)

			if(!graphEvents.data || graphEvents.data.data == 'undefined'){
				// console.log("GraphQL query -- graphEvents undefined")

				this.setState({ Events_Blockchain: [] ,
					active_length: 0,
					event_copy: []});
			}else{
				if (this._isMounted) {
				
					
					
					this.setState({
						Events_Blockchain: graphEvents.data.data.events,
						active_length: graphEvents.data.data.events.length,
						event_copy: graphEvents.data.data.events,
					});
				}

			}

		}).catch((err) => console.error(err))
		}

      filterHideEvent = async () => {
		try {
			const get = await axios.get(`${API_URL}${REPORT_EVENT}`);
			this.setState({
				hideEvent: get.data.result,
			});
			return;
		} catch (error) {
			// console.log("check error", error);
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
            if (event_calendar.account.toLowerCase()=== this.account.toLowerCase()) {
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
                    this.state.Events_Blockchain[i]
                        .eventId ==
                    this.state.Deleted_Events[j].eventId
                ) {
                    skip = true;
                }
            }
            if(!skip){
                for (let j = 0; j < this.state.hideEvent.length; j++) {
                    if (
                        this.state.Events_Blockchain[i]
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
            id:events_list[i].eventId,
            title:events_list[i].name,
            start:parseInt(events_list[i].time,10)*1000,
            end:parseInt(events_list[i].time,10)*1000,
            allDay:true,
            account:events_list[i].owner,
                })
            }
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