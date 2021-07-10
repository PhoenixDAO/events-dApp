import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
    Grid,
    Typography,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
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
        paddingTop: "15px"
    },

}));

export const Card = (props) => {
    const {
        click,
        imageSrc,
        header,
        value,
        profit,
        color
    } = props;

    useEffect(() => {
        // getPhnxRevenue();

    }, []);
    const classes = useStyles();
    return (
        <Grid lg={4} sm={12} xs={12} item className={classes.box} onClick={click} style={{ borderLeft: `4px solid ${color}` }} component="button">
            <img
                src={imageSrc}
                className={classes.phoenix}
                alt="Event Price"
            />
            <Typography className={classes.dollar}>{header}</Typography>
            <div style={{ display: "flex", alignItems: "center" }}>
                <Typography className={classes.total}>{value}</Typography>
                <Typography className={classes.red}>{profit}</Typography>
            </div>

            <Typography className={classes.status}>You made an extra $300k in the last 7 days</Typography>
        </Grid>
    );
};


