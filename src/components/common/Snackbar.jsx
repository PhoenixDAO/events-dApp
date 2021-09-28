import Snackbar from "@material-ui/core/Snackbar";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    snackbar: {
        backgroundColor: "white"
    }
}));

const SnackBar = (open, message, handleClose) => {
    const classes = useStyles();

    return (
        <div>
        <Snackbar
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            open={open}
            onClose={handleClose}
            message={message}
            autoHideDuration={3000}
            key={"bottom" + "center"}
        />
        </div>
    );
};

export default SnackBar;
