import React, { useState, useEffect } from "react";
import { API_URL, REPORT_EVENT, graphURL } from "../config/const";
import axios from "axios";
import { drizzleConnect } from "drizzle-react";
import PropTypes from "prop-types";

export const getEvents = (props, context) => {
    const [Deleted_Events, setDeleted_Events] = useState([]);
    const [MyEvents, setMyEvents] = useState([]);
    const [active_length, setActive_length] = useState(0);
    const [loading, setLoading] = useState(true);
    const [hideEvent, setHideEvent] = useState([]);
    const [_isMounted, set_isMounted] = useState(props._isMounted);
    useEffect(() => {
        console.log("i am ere", props)
        if (
            _isMounted
        ) {
            filterHideEvent();
            loadBockchain();

        }
        return () => {
            set_isMounted(false);
        }
    }, [MyEvents]);
    const filterHideEvent = async () => {
        try {
            const get = await axios.get(`${API_URL}${REPORT_EVENT}`);
            if (get.data.result.length != 0) {

                setHideEvent(get.data.result)
                console.log("I am Deleted_Events", get.data.result)

            }

            return;
        } catch (error) {
            // console.log("check error", error);
        }
    };
    const loadBockchain = async () => {
        if (_isMounted) {
            // if (this._isMounted) {

            // Graph BLOCK
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
            }).then((graphDeletedEvents) => {

                if (!graphDeletedEvents.data || !graphDeletedEvents.data.data == 'undefined') {
                    setDeleted_Events([]);
                } else {
                    setDeleted_Events(graphDeletedEvents.data.data.eventsRemoveds)
                    // this.setState({ Deleted_Events: graphDeletedEvents.data.data.eventsRemoveds });
                }
            }).catch((err) => {
                console.error("graph error here", err);
                setDeleted_Events([]);
                setLoading(false);
            })


            //Listen For My Newly Created Events

            await axios({
                url: graphURL,
                method: 'post',
                data: {
                    query: `{
                    users {
                  id
                  account
                  userEvents {
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
              }`
                }
            }).then((graphEvents) => {
                // console.log("GraphQL query response",Date.now(),graphEvents.data.data.users)
                if (!graphEvents.data || graphEvents.data.data == 'undefined') {
                    // console.log("GraphQL query -- graphEvents undefined")
                    setLoading(false);
                    setActive_length(0);

                } else {
                    if (props._isMounted) {
                        const dateTime = Date.now();
                        const dateNow = Math.floor(dateTime / 1000);

                        let userEvents = graphEvents.data.data.users.find((user) => user.account.toLowerCase() == props.accounts.toLowerCase())
                        console.log("graph userEvents", userEvents)
                        if (userEvents) {
                            let newsort = userEvents.userEvents
                                .concat()
                                .sort((a, b) => b.blockNumber - a.blockNumber)

                            setMyEvents(newsort);
                            setActive_length(newsort.length);


                        }
                        setLoading(false);
                    }

                }

            }).catch((err) => {
                setLoading(false);
                console.error("graph some error", err)
            })
            set_isMounted(false);
        }
        let filteredDeletedReported = [];
        let filteredDeleted = [];
        let skip = false;
        let skip2 = false;
        // console.log("Dashboard NewAndUpdatedEvent in dashboard after uniqueness this.state.MyEvents",this.state.MyEvents)
        console.log("GraphQL query newsort", MyEvents, "deleted", Deleted_Events);

        for (let i = 0; i < MyEvents.length; i++) {
            for (let j = 0; j < Deleted_Events.length; j++) {
                if (
                    MyEvents[i].eventId ==
                    Deleted_Events[j].eventId
                ) {
                    skip = true;
                    skip2 = true;
                }
            }
            if (!skip) {
                for (let j = 0; j < hideEvent.length; j++) {
                    if (
                        MyEvents[i].eventId ==
                        hideEvent[j].id
                    ) {
                        skip = true;
                    }
                }
            }
            if (!skip2) {

                filteredDeleted.push(MyEvents[i]);
            }
            if (!skip) {
                filteredDeletedReported.push(MyEvents[i]);
            }
            skip = false;
            skip2 = false;
        }
        console.log("filtered", filteredDeletedReported, filteredDeleted)
        // var array1 = this.state.MyEvents;
        // for (var key in this.state.MyEvents) {
        // 	for (var key2 in deletedArray) {
        // 		if (deletedArray[key] != this.state.MyEvents[key2]) {
        // 			array1.splice(key, 1);
        // 		}
        // 	}
        // }
        // console.log("Dashboard DeletedEvent in dashboard",deletedArray)
        // console.log("Dashboard DeletedEvent in dashboard deletedArray2",deletedArray2)
        setMyEvents(filteredDeletedReported);
        // this.setState(
        //     {
        //         // filtered only deleted events
        //         deletedArray2: deletedArray2,
        //         // filtered deleted and reported events
        //         deletedArray: deletedArray,
        //     },
        //     () => this.GetEventsRevenue(this.state.deletedArray)
        // );
    }
    return MyEvents;
}
