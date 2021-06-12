import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import { drizzleConnect } from "drizzle-react";
import {
    Grid,
    IconButton,
    Button,
    FormControl,
    Select,
    Typography,
    Paper
} from "@material-ui/core";
import BuyPHNXButton from "./common/BuyPhnxButton"
import { KeyboardBackspace } from "@material-ui/icons";
import {getEvents} from "../utils/getEvents";
const useStyles = makeStyles((theme) => ({


    heading: {
        display: "flex",
        alignItems: "center",
        color: "#413AE2",
        fontSize: "28px",
        fontWeight: "600",
    },
    box2: {
        boxShadow: "none",
        border: "1px solid #E4E4E7",
        borderRadius: "8px",
        padding: "30px 20px",
        backgroundColor: "white",
        textAlign: "inherit",
        display: "flex",
        justifyContent:"space-between",
        alignItems:"center"
    },
    text1: {
        color: "#4E4E55",
        fontSize: "20px",
        fontWeight: 700,

    },
    text: {
        color: "#4E4E55",
        fontSize: "20px",
        fontWeight: 500,
        paddingLeft:"10px"

    },
    imageDiv:{
        display:"flex",
        alignItems:"center"

    }
}));

const EventsAnalytics = (props, context) => {
    const {
        // event_data,
        // date,

    } = props;
const [_isMounted,set_isMounted] =useState(true);
const [MyEvents, setMyEvents] = useState([]);

    useEffect(() => {
        // const result=getEvents();
        // console.log("result",result);

    });
    const classes = useStyles();
    let result;
    if(
        _isMounted
    )
    {
     result=getEvents({_isMounted:true,accounts:props.accounts});
        console.log("result",result)
    }



    return (

        <Grid container>
            <h3 className={classes.heading}>
                Events
                    </h3>
            <Grid container style={{ marginTop: "30px" }} item xs={12} spacing={3}>
                <Grid item lg={6} xl={6}>
                    <Paper className={classes.box2}>
                        <span className={classes.imageDiv}>
                            <img
                                src={"/images/icons/create.svg"}
                                alt="Event Price"
                            />
                            <Typography className={classes.text}>No. of Events Created</Typography>
                        </span>
                        <Typography className={classes.text1}>{result.length}</Typography>
                    </Paper>
                </Grid>
                <Grid item lg={6} xl={6}>
                    <Paper className={classes.box2}>
                        <span className={classes.imageDiv}>
                            <img
                                src={"/images/icons/views.svg"}
                                alt="Event Price"
                            />
                            <Typography className={classes.text}>Events Page Views</Typography>
                        </span>
                        <Typography className={classes.text1}>6</Typography>
                    </Paper>
                </Grid>
                <Grid item lg={6} xl={6}>
                    <Paper className={classes.box2}>
                        <span className={classes.imageDiv}>
                            <img
                                src={"/images/icons/Events.svg"}
                                alt="Event Price"
                            />
                            <Typography className={classes.text}>No. of Tickets bought</Typography>
                        </span>
                        <Typography className={classes.text1}>6</Typography>
                    </Paper>
                </Grid>
                <Grid item lg={6} xl={6}>
                    <Paper className={classes.box2}>
                        <span className={classes.imageDiv}>
                            <img
                                src={"/images/icons/favorite.svg"}
                                alt="Event Price"
                            />
                            <Typography className={classes.text}>No. of Favourites</Typography>
                        </span>
                        <Typography className={classes.text1}>6</Typography>
                    </Paper>
                </Grid>

            </Grid>


        </Grid>
    );
};
EventsAnalytics.contextTypes = {
    drizzle: PropTypes.object,
};
const mapStateToProps = (state) => {
    return {
        contracts: state.contracts,
        accounts: state.accounts[0],
        networkId: state.web3.networkId,
    };
};

const AppContainer = drizzleConnect(EventsAnalytics, mapStateToProps);
export default AppContainer;
