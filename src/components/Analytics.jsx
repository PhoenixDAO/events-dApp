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
} from "@material-ui/core";
import BuyPHNXButton from "./common/BuyPhnxButton"
import { KeyboardBackspace } from "@material-ui/icons";


const useStyles = makeStyles((theme) => ({
    content: {
        backgroundColor: "white",
        margin: "40px 0px",
        padding: "40px",
        borderRadius: "8px"
    },
    select: {
        width: "170px",
        marginTop: "10px",
        marginBottom: "10px",
        height: "40px",
        "& .MuiSelect-outlined": {
            padding: "10px",
        },
        [theme.breakpoints.down("xs")]: {
            width: "auto",
            minWidth: "141px",
        },
    },
    row: {
        display: "flex",
        justifyContent: "space-between",
        width: "100%",
        alignItems: "flexEnd",

    },
    heading: {
        display: "flex",
        alignItems: "center",
        color: "#413AE2",
        fontSize: "28px",
        fontWeight: "600",
        marginBottom: "20px"
    },
    box: {
        border: "1px solid #E4E4E7",
        borderRadius: "8px",
        padding: "20px",
        "&:active": {
            border: "8px solid #F2F2FD"
        },
        "&:focus": {
            border: "8px solid #F2F2FD",
            outline: "none"
        },
        backgroundColor: "white"
    },
    yellow: {
        borderLeft: "4px solid #E5AB00",
    },
    blue:{
        borderLeft: "4px solid #413AE2",

    },
    purple:{
        borderLeft: "4px solid #963AE2",

    },
    dollar: {
        color: "#73727D",
        textTransform: "uppercase"
    },
    total: {
        color: "#1E1E22",
        fontSize: "24px",
        fontWeight: "700",
        paddingRight: "10px"
    },
    green: {
        backgroundColor: "#E6FEF3",
        color: '#07A287',
        width: "57px",
        textAlign: "center",
        borderRadius: "10px"
    },
    red: {
        backgroundColor: "#FEECEC",
        color: '#F43C3C',
        width: "57px",
        textAlign: "center",
        borderRadius: "10px"
    },
    status: {
        fontSize: "14px",
        color: "#73727D",
        paddingTop: "15px"

    }
}));

const Analytics = (props, context) => {
    const {
        // event_data,
        // date,

    } = props;

    useEffect(() => {
    });
    const classes = useStyles();
    const goBack = () => {
        this.props.history.goBack();
    }


    return (
        <div>
            <Grid className="header3">
                <h2>
                    <IconButton
                        aria-label="delete"
                        onClick={goBack}
                    >
                        <KeyboardBackspace
                            fontSize="large"
                            style={{ fill: "#1E1E22" }}
                        />
                    </IconButton>
                    <span>&nbsp;&nbsp;</span>
                    Analytics
                </h2>
                <div>
                    <BuyPHNXButton />
                </div>
            </Grid>
            <Grid container className={classes.content}>
                <Grid className={classes.row}>
                    <h3 className={classes.heading}>
                        Earnings
                    </h3>
                    <FormControl
                        variant="outlined"
                        className={classes.select}
                    >
                        <Select
                            native
                            // value={state.age}
                            // onChange={handleChange}
                            inputProps={{
                                name: "age",
                                id: "outlined-age-native-simple",
                            }}
                        >

                            <option value="Today">
                                Today
                            </option>
                            <option
                                aria-label="None"
                                value="Yesterday"
                            >
                                Yesterday
                                </option>
                            <option value="Last 7 Days">
                                Last 7 Days
												</option>
                            <option value="Last 28 Days">
                                Last 28 Days
												</option>
                            <option value="Last 90 Days">
                                Last 90 Days
												</option>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid container>
                    <Grid lg={4} className={[classes.box, classes.yellow]} component="button">
                        <img
                            src={"/images/icons/Dollar.png"}
                            className={classes.phoenix}
                            alt="Event Price"
                        />
                        <Typography className={classes.dollar}>Dollar Revenue</Typography>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <Typography className={classes.total}>$2640</Typography>
                            <Typography className={classes.red}>+10%</Typography>
                        </div>

                        <Typography className={classes.status}>You made an extra $300k in the last 7 days</Typography>
                    </Grid>
                    <Grid lg={4} className={[classes.box, classes.blue]} component="button">
                        <img
                            src={"/images/icons/Dollar.png"}
                            className={classes.phoenix}
                            alt="Event Price"
                        />
                        <Typography className={classes.dollar}>Dollar Revenue</Typography>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <Typography className={classes.total}>$2640</Typography>
                            <Typography className={classes.red}>+10%</Typography>
                        </div>

                        <Typography className={classes.status}>You made an extra $300k in the last 7 days</Typography>
                    </Grid>
                    <Grid lg={4} className={[classes.box, classes.purple]} component="button">
                        <img
                            src={"/images/icons/Dollar.png"}
                            className={classes.phoenix}
                            alt="Event Price"
                        />
                        <Typography className={classes.dollar}>Dollar Revenue</Typography>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <Typography className={classes.total}>$2640</Typography>
                            <Typography className={classes.red}>+10%</Typography>
                        </div>

                        <Typography className={classes.status}>You made an extra $300k in the last 7 days</Typography>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
};
Analytics.contextTypes = {
    drizzle: PropTypes.object,
};
const mapStateToProps = (state) => {

    return {
        contracts: state.contracts,
        accounts: state.accounts[0],
        networkId: state.web3.networkId,
    };
};

const AppContainer = drizzleConnect(Analytics, mapStateToProps);
export default AppContainer;
