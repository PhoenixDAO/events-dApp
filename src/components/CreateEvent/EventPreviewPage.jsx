import React, { Component } from 'react';
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import SocialMedia from "../common/SocialMedia";
import {
    CalendarTodayOutlined,
    ScheduleOutlined,
    LocationOnOutlined,
    PersonOutlined,
    ConfirmationNumberOutlined,
    ShoppingCartOutlined, ModeCommentOutlined
} from "@material-ui/icons";
import { withStyles } from "@material-ui/core/styles";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";

import {
    Button,
    Grid,
    Avatar,
    FormControl,
    Select,
    IconButton,
} from "@material-ui/core";
const styles = (theme) => ({
    root: {
        "& .MuiDialog-paperWidthSm": {
            maxWidth: "60%",
        }
    },
    share: {
        height: "45px",
        width: "180px",
        fontWeight: 700,
        color: "#413AE2",
        BorderColor: "#413AE2",
    },
    buy: {
        marginLeft: "13px",
        fontWeight: 700,
        width: "180px",
        height: "45px",
        backgroundColor: "#413AE2",
        [theme.breakpoints.down("xs")]: {
            marginLeft: "0px",
            marginTop: "20px",
            width: "160px",
        },
    },
    description: {
        marginTop: "35px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "end",
        paddingRight:"20px"
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: "center",
        color: theme.palette.text.secondary,
        height: "100%",
    },
    eventHeading: {
        marginBottom: "0px",
        marginTop: "22px",
        color: "#56555D",
        fontSize: "14px",
        "& .MuiSvgIcon-root": {
            fontSize: "16px",
            verticalAlign: "sub",
        },
    },
    ticketPrice: {
        fontSize: "18px",
        marginBottom: "0px",
        color: "#56555D",
    },
    eventDetails: {
        backgroundColor: "white",
        borderRadius: "5px",
        marginTop: "35px",
        padding: "30px",
        border:"1.23218px solid #E4E4E7",

    },
    eventinfo: {
        fontSize: "22px",
        fontWeight: "700",
    },
    PhnxPrice: {
        fontSize: "22px",
        fontWeight: "700",
        color: "#413AE2",
    },
    categoryGrid: {
        backgroundColor: "white",
        borderRadius: "8px",
        padding: "10px",
        paddingRight: "26px",
    },
    socialDiv: {
        display: "flex",
        justifyContent: "space-between",
        marginTop: "40px",
        [theme.breakpoints.down("xs")]: {
            display: "grid",
        },
    },
    header3:{
      
       display: "flex",
       justifyContent: "space-between",
       borderBottom: "1px solid #E4E4E7",
       paddingBottom: "10px",
       paddinTop: "40px",
   
   },
    ticketSelect: {

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
        "& .MuiSelect-select": {
            paddingRight: "32px !important",
        },
    },
    organizerDetails: {
        justifyContent: "center",
        textAlign: "center",
    },
    organizerDescription: {
        justifyContent: "center",
        textAlign: "center",
        display: "flex",
        margin: "10px auto",
        width: "80%",
        marginBottom: "80px",
    },
    row: {
        marginTop: "40px"
    },
    heading: {
        borderBottom: "1px solid #E4E4E7",
        fontWeight: "700",
        color: "black",
        paddingBottom: "10px",
        marginBottom: "20px"
    },
    avatar: {
        display: "inline-block",
        marginBottom: "10px",
        border: "1.4619px solid #D8D8D8",
        padding: "6px",
        background: "white",
        marginRight: "7px",
        marginTop: "-4px"
    }
});
class EventPreviewPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: this.props.open,

        }
    }

    render() {
        const { classes } = this.props;

        return (
            <Dialog
                className={classes.root}
                open={this.props.open}
                keepMounted
                onClose={this.props.handleClose}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogContent>
                    <Grid>

                        <Grid
                            style={{
                                marginBottom: "40px",
                                marginTop: "40px",
                            }}
                        >

                            <Grid className={classes.header3}>
                                <div style={{ display: "flex", alignItems: "center" }}>
                                  
                                    <h2>

                                        {this.props.title}
                                    </h2>
                                </div>
                                <div>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        style={{ marginRight: "10px" }}
                                        className={classes.buy}
                                        // disabled={
                                        //     true}
                                    >
                                        <ShoppingCartOutlined
                                            style={{ marginRight: "10px" }}
                                        />
                                    Buy Ticket
                                    </Button>
                                </div>
                            </Grid>
                            <br />
                            {/* {myEvent === true && (
                                <Link
                                    to={
                                        "/event-stat/" +
                                        pagetitle +
                                        "/" +
                                        this.props.match.params.id
                                    }
                                ></Link>
                            )} */}
                            <Grid lg={12}>
                                <img
                                    className="card-img-top event-image"
                                    src={this.props.image}
                                    alt="Event"
                                />
                            </Grid>
                            <Grid
                                container
                            >
                                <Grid
                                    lg={9}
                                    md={7}
                                    sm={12}
                                    xs={12}
                                    className={classes.description}
                                >
                                    <Grid container>
                                        {this.props.description}
                                    </Grid>

                                </Grid>
                                <Grid
                                    lg={3}
                                    md={5}
                                    sm={12}
                                    xs={12}
                                    className={classes.eventDetails}
                                >
                                    <p className={classes.ticketPrice}>
                                        <img
                                            src={"/images/phoenixdao.svg"}
                                            className="event_price-image"
                                            alt="Event Price"
                                        />
                                        TICKET PRICE
                                    </p>
                                    <FormControl
                                        variant="outlined"
                                        className={classes.ticketSelect}
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
                                            <option
                                                aria-label="None"
                                                value={this.props}
                                            />
                                            <option value={10}>
                                                Bronze Ticket
                                            </option>
                                            <option value={20}>
                                                Silver Ticket
                                            </option>
                                            <option value={30}>
                                                Golden Ticket
                                            </option>
                                        </Select>
                                    </FormControl>
                                    {/* {priceGrid} */}
                                    <p className={classes.eventHeading}>
                                        {" "}
                                        <CalendarTodayOutlined /> Date
                                    </p>
                                    <p className={classes.eventinfo}>
                                        {" "}
                                        {this.props.startDate}
                                    </p>
                                    <p className={classes.eventHeading}>
                                        <ScheduleOutlined /> Time
                                    </p>
                                    <p className={classes.eventinfo}>
                                        {" "}
                                        {this.props.startTime}
                                    </p>
                                    <p className={classes.eventHeading}>
                                        <LocationOnOutlined /> Location
                                    </p>
                                    <p className={classes.eventinfo}>
                                        {this.props.locations}
                                    </p>
                                    <p className={classes.eventHeading}>
                                        <PersonOutlined />
                                        Organizer
                                    </p>
                                    <p className={classes.eventinfo}>
                                        {this.props.eventOrganizer}
                                    </p>
                                    <p className={classes.eventHeading}>
                                        <ConfirmationNumberOutlined />
                                        Tickets Bought
                                    </p>
                                    <p className={classes.eventinfo}>
                                        0/{this.props.availability}
                                    </p>
                                </Grid>
                            </Grid>
                            {/* <Grid container className={classes.row}>
                                <div className="new-transaction-wrapper">
                                    <h2 className={classes.heading}>
                                        Ticket Purchases
                                    </h2>
                                    {this.state.load && <Loading />}
                                    <Grid container lg={12}>
                                        {this.state.pageTransactions.map(
                                            (sold, index) => (

                                                <p
                                                    className="sold_text col-sm-12 col-md-12 col-lg-6 col-xl-6"
                                                    key={index}
                                                >
                                                   
                                                    <Avatar
                                                        src="/images/metamask.svg"
                                                        className={classes.avatar}
                                                    />
                                                    Someone bought 1 ticket for{" "}
                                                    {this.props.title}
                                                    .
                                                </p>
                                            )
                                        )}
                                    </Grid>
                                    {!sold && (
                                        <p className="sold_text col-md-12 no-tickets">
                                            There are currently no purchases for
                                            this ticket.
                                        </p>
                                    )}
                                </div>
                                <div className="pagination">
                                    <JwPagination
                                        items={this.state.soldTicket}
                                        onChangePage={this.onChangePage}
                                        maxPages={5}
                                        pageSize={5}
                                        styles={customStyles}
                                    />
                                </div>
                            </Grid> */}

                            <Grid container className={classes.socialDiv}>
                                <Grid
                                    lg={2}
                                    md={3}
                                    sm={2}
                                    xs={6}
                                    className={classes.categoryGrid}
                                >
                                    <ModeCommentOutlined />
                                    Topic
                                    <div className={classes.eventinfo}>
                                        {this.props.topic}
                                    </div>
                                </Grid>
                                <Grid lg={10} md={9} sm={10} xs={12}>
                                    <SocialMedia />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid
                            alignItems="center"
                            className={classes.organizerDetails}
                        >
                            <Avatar
                                src="/images/icons/user.svg"
                                style={{
                                    display: "inline-block",
                                    marginBottom: "10px",
                                }}
                            />
                            <h3 style={{ fontWeight: "bold" }}>
                                {this.state.organizer}
                            </h3>
                            <Grid className={classes.organizerDescription}>
                                Him boisterous invitation dispatched had
                                connection inhabiting projection. By mutual
                                an mr danger garret edward an. Diverted as
                                strictly exertion addition no disposal by
                                stanhill. This call wife do so sigh no gate
                                felt. You and abode spite order get.
                                Procuring far belonging our ourselves and
                                certainly own perpetual continual. It
                                elsewhere of{" "}
                            </Grid>
                        </Grid>
                    </Grid>
                </DialogContent>

            </Dialog>
        )
    }
}
export default withStyles(styles, { withTheme: true })(EventPreviewPage);
