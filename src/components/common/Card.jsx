import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
    Grid,
    Typography,
} from "@material-ui/core";
import { SettingsSystemDaydreamSharp } from "@material-ui/icons";
import moment from "moment";
import { pricingFormatter } from "../../utils/pricingSuffix";

const useStyles = makeStyles((theme) => ({
    box: {
        border: "1px solid #E4E4E7",
        borderRadius: "8px",
        padding: "20px",
        "@media (min-width:735px)":{
            padding: "10px",
        },
        "&:active": {
            border: "8px solid #F2F2FD"
        },
        "&:focus": {
            border: "8px solid #F2F2FD",
            outline: "none"
        },
        backgroundColor: "white",
        maxWidth: "31%",
        textAlign: "inherit",
        [theme.breakpoints.down('sm')]: {
            maxWidth: "initial",
            margin: "10px",
        }
    },
    color: {
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
        // paddingTop: "15px"
    },
    liveRevenue: {
        color: "#A3A3A3",
        fontSize: "12px",
        "@media (min-width:735px)":{
            height: "20px",
        }
    },
    card:{
        display: "flex",
         alignItems: "center",
         [theme.breakpoints.down("md")]:{
            display: "grid",
         }
    }
}));

export const Card = (props) => {
    const {
        click,
        imageSrc,
        header,
        value,
        profit,
        color,
        diffrence,
        entity,
        days,
        liveDollarRevenue
    } = props;

    useEffect(() => {
        // getPhnxRevenue();

    }, []);
    const classes = useStyles();
    let timestamp = days === "custom" ?  Math.ceil(
        moment
            .duration(
                moment
                    .unix(props.endDate)
                    .diff(moment.unix(props.startDate))
            )
            .asDays()
    ) :  days/ 86400;
    return (
        <Grid lg={4} sm={12} xs={12} item className={classes.box} onClick={click} style={{ borderLeft: `4px solid ${color}` }} component="button">
            <img
                src={imageSrc}
                className={classes.phoenix}
                alt="Event Price"
            />
            <Typography className={classes.dollar}>{header}</Typography>
            <div className={classes.card}>
                <Typography className={classes.total}>{value}</Typography>
                <Typography className={(profit > 0 ? classes.green : classes.red)}>{profit.toFixed(0)}%</Typography>
            </div>
            <Typography className={classes.liveRevenue}> {liveDollarRevenue ? "$" + liveDollarRevenue + " (Current price)" : null} </Typography>
            <Typography className={classes.status}>You made {diffrence > 0 ? "an extra" : diffrence < 0 ? "a less" : null} <span style={diffrence > 0 ? { color: "#07A287" } : { color: "#F43C3C" }}>{(entity == "$")&& entity}{Math.abs(diffrence)} {(entity == "PHNX")&& entity}</span> {(entity == "Tickets")&& ((Math.abs(diffrence)>1)?"Tickets":"Ticket")} in the last {" "}
                {timestamp}  {timestamp > 1 ? "days" : "day"} </Typography>
        </Grid>
    );
};


