import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import { drizzleConnect } from "drizzle-react";
import {
    Grid,
    Typography,
    Paper
} from "@material-ui/core";
import { getEvents } from "../../utils/getEvents";
import { Favorite } from "@material-ui/icons";
const useStyles = makeStyles((theme) => ({
    heading: {
        display: "flex",
        alignItems: "center",
        color: "#413AE2",
        fontSize: "28px",
        fontWeight: "600",
    },
    box2: {
        height:"100%",
        boxShadow: "none",
        border: "1px solid #E4E4E7",
        borderRadius: "8px",
        padding: "30px 20px",
        backgroundColor: "white",
        textAlign: "inherit",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
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
        paddingLeft: "10px"

    },
    imageDiv: {
        display: "flex",
        alignItems: "center"

    },
    "@media (min-width:960px)":{
        cardPadding1:{
            paddingRight:"7px",
            paddingBottom: "7px"
        },
        cardPadding2:{
            paddingLeft:"7px",
            paddingBottom:"7px"
        },
        cardPadding3:{
            paddingTop:"7px",
            paddingRight:"7px"
        },
        cardPadding4:{
            paddingTop:"7px",
            paddingLeft:"7px"
        }
    },
    "@media (max-width:960px)":{
        cardPadding1:{
            paddingBottom:"7px"
        },
        cardPadding2:{
            paddingBottom:"7px"
        },
        cardPadding3:{
            paddingBottom:"7px",
        },
        cardPadding4:{
            paddingBottom:"7px",
        }
    }
}));

const EventsAnalytics = (props) => {
    const [userDetails, setUserDetails] = useState(null)
    const [_isMounted, set_isMounted] = useState(true);
    // const [MyEvents, setMyEvents] = useState([]);

    useEffect(() => {
        setUserDetails(props.userDetails);

    }, [props.userDetails]);
    const classes = useStyles();
    let favouriteLength = (props.userDetails.favourites) ? props.userDetails.favourites.length : 0;

    return (

        <Grid container>
            <h3 className={classes.heading}>
                Events
            </h3>
            <Grid container style={{ marginTop: "30px" }} item xs={12}  >
                <Grid item lg={6} xl={6} md={6} xs={12} sm={12} className={`${classes.cardPadding1} `} >
                    <Paper className={classes.box2}>
                        <span className={classes.imageDiv}>
                            <img
                                src={"/images/icons/create.svg"}
                                alt="Event Price"
                            />
                            <Typography className={classes.text}>No. of Events Created</Typography>
                        </span>
                        <Typography className={classes.text1}>{props.createdEvents}</Typography>
                    </Paper>
                </Grid>
                <Grid item lg={6} xl={6} md={6} xs={12} sm={12}  className={`${classes.cardPadding2} `} >
                    <Paper className={classes.box2}>
                        <span className={classes.imageDiv}>
                            <img
                                src={"/images/icons/views.svg"}
                                alt="Event Price"
                            />
                            <Typography className={classes.text}>Events Page Views</Typography>
                        </span>
                        <Typography className={classes.text1}>{userDetails && userDetails.totalViewsOnCreatedEvents ? userDetails.totalViewsOnCreatedEvents : "-"}</Typography>

                    </Paper>
                </Grid>
                <Grid item lg={6} xl={6} md={6} xs={12} sm={12} className={`${classes.cardPadding3} `}>
                    <Paper className={classes.box2}>
                        <span className={classes.imageDiv}>
                            <img
                                src={"/images/icons/Events.svg"}
                                alt="Event Price"
                            />
                            <Typography className={classes.text}>No. of Tickets bought</Typography>
                        </span>
                        <Typography className={classes.text1}>{props.ticketBought}</Typography>
                    </Paper>
                </Grid>
                <Grid item lg={6} xl={6} md={6} xs={12} sm={12}  className={`${classes.cardPadding4} `} >
                    <Paper className={classes.box2}>
                        <span className={classes.imageDiv}>
                            <img
                                src={"/images/icons/favorite.svg"}
                                alt="Event Price"
                            />
                            <Typography className={classes.text}>No. of Favourites</Typography>
                        </span>
                        <Typography className={classes.text1}>{userDetails && userDetails.favourites ? userDetails.favourites.length : "-"}</Typography>

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
        accounts: state.accounts[0],
        networkId: state.web3.networkId,
    };
};

const AppContainer = drizzleConnect(EventsAnalytics, mapStateToProps);
export default AppContainer;
