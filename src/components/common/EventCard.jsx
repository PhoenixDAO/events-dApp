import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Link as RouterLink } from "react-router-dom";
import PropTypes from "prop-types";
import { drizzleConnect } from "drizzle-react";
import { API_URL, ADD_TO_FAVOURITES , REMOVE_FROM_FAVOURITES } from "../../config/const";
import { toast } from "react-toastify";
import NotifyReport from "../NotifyReport";
import axios from "axios";

import {
	Card,
	CardActionArea,
	CardMedia,
	CardContent,
	Button,
	Divider,
	Grid,
	Typography,
	Link,
} from "@material-ui/core";
import {
	DateRange,
	AccessTime,
	LocationOnOutlined,
	ConfirmationNumberOutlined,
	FavoriteBorder,
	Favorite,
	LaunchSharp,
	Send,
} from "@material-ui/icons";


import ShareModal from "../common/ShareModal";
import SendTicket from "../common/SendTicket";

const useStyles = makeStyles((theme) => ({
	root: {
		maxWidth: 345,
		"& .MuiCardContent-root": {
			padding: "16px 16px 0px",
		},
	},
	avatar: {
		backgroundColor: "red",
	},

	row: {
		display: "flex",
		borderTop: "1px solid #E4E4E7",
		marginLeft: "-16px",
		marginRight: "-16px",
		padding: "0px 16px",
	},
	text: {
		color: "#4E4E55",
		fontSize: 17,
		fontWeight: 500,
	},
	shareButton: {
		"&:hover": {
			backgroundColor: "transparent",
		},
		textTransform: "Capitalize",
		textAlign: "center",
		display: "flex",
		alignItems: "center",
		width: "100%",
		color: "#4E4E55",
		fontSize: 17,
		fontWeight: 500,
		"&:focus": {
			outline: "none",
		},
	},
	sendTicket: {
		"&:hover": {
			backgroundColor: "transparent",
		},
		textTransform: "Capitalize",
		textAlign: "center",
		display: "flex",
		alignItems: "center",
		width: "100%",
		color: "#4E4E55",
		fontSize: 17,
		fontWeight: 500,
		"&:focus": {
			outline: "none",
		},
		borderLeft: "1px solid #E4E4E7",
		borderRadius: "0px",
	},
	FavoriteIcon: {
		border: "none",
		backgroundColor: "transparent",
		fontSize: 15,
		fontWeight: 500,
		backgroundColor: "white",
		borderRadius: "50%",
		width: "32px",
		height: "32px",
		"&:focus": {
			outline: "none",
		},
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
}));

const EventCard = (props, context) => {
	const {
		event_data,
		date,
		image,
		locations,
		myEvent,
		myEventStatURL,
		titleURL,
		max_seats,
		revenue,
		dollarRevenue,
		ticket,
		sendTicket2,
		eventId,
		myFavorites,
		favoriteEvent
	} = props;

	useEffect(() => {
		setIcon(favoriteEvent);
	  }, [favoriteEvent]);
	const classes = useStyles();
	const [Icon, setIcon] = useState(false);

	const [open, setOpen] = useState(false);
	const [open2, setOpen2] = useState(false);
// changeIcon(favoriteEvent);
	const handleClickOpen = (e) => {
		setOpen(true);
		e.preventDefault();
	};
	const handleClose = () => {
		setOpen(false);
	};
	const handleClickOpen2 = (e) => {
		setOpen2(true);
		e.preventDefault();
	};
	const handleClose2 = () => {
		setOpen2(false);
	};
	const addTofavorite = async (e) => {
		e.preventDefault();
		setIcon(!Icon);
		try {
			let payload = {
				address: props.accounts,
				networkId: props.networkId,
				eventId: eventId,
			};

			//for add to favourite
			if(!Icon)
			{
				await axios.post(
					`${API_URL}${ADD_TO_FAVOURITES}`,
					payload
				);
				toast(<NotifyReport text={"Event add to favourites"} />, {
					position: "bottom-right",
					autoClose: true,
					pauseOnHover: true,
				});
			}
			//for remove from favourites
			else{
				await axios.post(
					`${API_URL}${REMOVE_FROM_FAVOURITES}`,
					payload
				);
				props.reloadData();

				toast(<NotifyReport text={"Event remove from favourites"} />, {
					position: "bottom-right",
					autoClose: true,
					pauseOnHover: true,
				});
			}

		
		} 
		catch (error) {
			// console.log("Consoleee notify report response catch",error)

			if (error.response && error.response.data) {
				// console.log("Consoleee notify report response error.response.data",error.response.data)
				toast(
					<NotifyReport
						text={error.response.data.responseMessage + "!"}
					/>,
					{
						position: "bottom-right",
						autoClose: true,
						pauseOnHover: true,
					}
				);
			}

			// this.props.history.push("/upcomingevents/1");

			// this.setState({
			// 	loading: false,
			// });
		}
	};
	return (
		<div>
			<ShareModal
				open={open}
				handleClose={handleClose}
				titleURL={titleURL}
			/>
			<SendTicket
				sendTicket2={sendTicket2}
				eventId={eventId}
				open={open2}
				handleClose={handleClose2}
				eventTitle={event_data.name}
			/>

			<Link
				underline="none"
				component={RouterLink}
				to={myEvent ? myEventStatURL : titleURL}
				style={{ textDecoration: "none" }}
			>
				<Card className={classes.root}>
					<CardActionArea>
						<div style={{ position: "relative" }}>
							<CardMedia
								component="img"
								alt={event_data.name}
								height="200"
								image={image}
								title={event_data.name}
							/>
							<div
								style={{
									position: "absolute",
									bottom: 0,
									left: 0,
									right: 0,
								}}
							>
								<div
									style={{
										display: "flex",
										justifyContent: "space-between",
										padding: 10,
										backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5)`,
									}}
								>
									<Typography
										style={{
											color: "#fff",
											fontSize: 17,
											fontWeight: 500,
										}}
									>
										<ConfirmationNumberOutlined fontSize="medium" />
										<span>&nbsp;</span>
										{event_data.sold}/{max_seats}
									</Typography>
									{!myEvent ? (
										<Typography
											className={classes.FavoriteIcon}
											component="button"
											onClick={addTofavorite}
										>

											{Icon ? <Favorite fontSize="small" style={{ color: "#413AE2" }} /> : <FavoriteBorder fontSize="small" />}
{Icon}
										</Typography>)
										: null}
								</div>
							</div>
						</div>

						<CardContent>
							<div
								style={{
									display: "flex",
									justifyContent: "space-between",
								}}
							>
								<Typography
									variant="h6"
									component="h2"
									style={{
										color: "#1E1E22",
										fontSize: 17,
										fontWeight: 700,
									}}
								>
									{event_data.sold >= 2 ? (
										<img
											src="/images/fire.png"
											className="event_badge-hot"
											alt="Hot Icon"
										/>
									) : (
										""
									)}
									{event_data.name}
								</Typography>

								<Typography
									style={{ color: "#413AE2" }}
									variant="body1"
									component="h2"
								>
									Free
								</Typography>
								{/* <div className={classes.eventinfo}>
									<span className={classes.PhnxPrice} >{event_data[3]
										? numeral(price).format("0.000") + "PHNX"
										: "FREE"}
									</span>
									<div style={{ color: "#56555D", fontSize: "14px" }}>
										{event_data[3]
											? "$" + numeral(
												price *
												this.state
													.PhoenixDAO_market
													.usd
											).format("0.000")
											: ""}
									</div>
								</div> */}
							</div>

							<br />

							<Typography
								variant="body2"
								color="textSecondary"
								component="p"
								gutterBottom
								className={classes.text}
							>
								<DateRange fontSize="small" />{" "}
								<span>&nbsp;</span>
								{date.toLocaleDateString()}
							</Typography>

							<Typography
								variant="body2"
								color="textSecondary"
								component="p"
								gutterBottom
								className={classes.text}
							>
								<AccessTime fontSize="small" />{" "}
								<span>&nbsp;</span>
								{date.toLocaleTimeString([], {
									hour: "2-digit",
									minute: "2-digit",
								})}
							</Typography>

							<Typography
								variant="body2"
								color="textSecondary"
								component="div"
								gutterBottom
								noWrap
								style={{ paddingBottom: "16px" }}
								className={classes.text}
							>
								<LocationOnOutlined fontSize="small" />{" "}
								<span>&nbsp;</span>
								{locations}
							</Typography>
							{/* For my events page */}
							{myEvent ? (
								<Grid item>
									<Divider style={{ marginBottom: "20px" }} />
									<Typography
										variant="body2"
										color="textSecondary"
										component="p"
										gutterBottom
										className={classes.text}
									>
										{"Ticket Sold: "}
										<span>&nbsp;</span>
										{event_data.sold}/{max_seats}
									</Typography>
									<Typography
										variant="body2"
										color="textSecondary"
										component="p"
										gutterBottom
										className={classes.text}
									>
										PHNX Revenue: {revenue} PHNX
									</Typography>
									<Typography
										variant="body2"
										color="textSecondary"
										component="p"
										gutterBottom
										className={classes.text}
										style={{ marginBottom: "20px" }}
									>
										Dollar Revenue: $ {dollarRevenue}
									</Typography>
									<Divider />
									<Button
										className={classes.shareButton}
										onClick={handleClickOpen}
									>
										<LaunchSharp
											style={{
												marginRight: "7px",
												fontSize: "19px",
											}}
										/>{" "}
										Share Event
									</Button>
								</Grid>
							) : // For my ticket page
							ticket ? (
								<Grid item className={classes.row}>
									<Button
										className={classes.shareButton}
										onClick={handleClickOpen}
									>
										<LaunchSharp
											style={{
												marginRight: "7px",
												fontSize: "19px",
											}}
										/>{" "}
										Share Event
									</Button>
									<Button
										className={classes.sendTicket}
										onClick={handleClickOpen2}
									>
										<Send
											style={{
												marginRight: "7px",
												fontSize: "19px",
											}}
										/>{" "}
										Send Ticket
									</Button>
								</Grid>
							) : // For my Favorite page
							myFavorites ? (
								<Grid item className={classes.row}>
									<Button
										className={classes.shareButton}
										onClick={handleClickOpen}
									>
										<LaunchSharp
											style={{
												marginRight: "7px",
												fontSize: "19px",
											}}
										/>{" "}
										Share Event
									</Button>
								</Grid>
							) : null}
						</CardContent>
					</CardActionArea>
				</Card>
			</Link>
		</div>
	);
};
EventCard.contextTypes = {
	drizzle: PropTypes.object,
};
const mapStateToProps = (state) => {

	return {
		contracts: state.contracts,
		accounts: state.accounts[0],

		networkId: state.web3.networkId,
	};
};

const AppContainer = drizzleConnect(EventCard, mapStateToProps);
export default AppContainer;
