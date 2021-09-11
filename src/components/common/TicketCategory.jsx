import React from "react";
import { Grid, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import editIcon from "../Images/editIcon.png";
import deleteIcon from "../Images/deleteIcon.png";
import { pricingFormatter } from "../../utils/pricingSuffix";

const useStyles = makeStyles((theme) => ({
	ticketCard: {
		padding: "18px 20px !important",
		borderRadius: "5px",
		border: "1px solid #E4E4E7",
		background: `linear-gradient(270deg, rgba(94, 91, 255, 0.12) 0%, rgba(124, 118, 255, 0) 131.25%)`,
	},
	ticketNameCat: {
		overflow: "hidden",
		wordBreak: "break-word",
		fontSize: 20,
		fontWeight: 400,
		color: "#1E1E22",
		fontFamily: "'Aeonik', sans-serif",
	},
	ticketAvailabilityCat: {
		fontSize: 14,
		fontWeight: 400,
		color: "#73727D",
		fontFamily: "'Aeonik', sans-serif",
	},
	dollarPriceCat: {
		fontSize: 20,
		fontWeight: 700,
		color: "#413AE2",
		fontFamily: "'Aeonik', sans-serif",
	},
	phnxPriceCat: {
		fontSize: 16,
		fontWeight: 500,
		color: "#4E4E55",
		fontFamily: "'Aeonik', sans-serif",
	},
}));

const TicketCategory = ({ cat, index }) => {
	const classes = useStyles();

	return (
		<div key={index} style={{ marginBottom: 20 }}>
			<Grid container>
				<Grid
					className={classes.ticketCard}
					container
					item
					xs={10}
					sm={10}
					md={11}
					lg={11}
					xl={11}
					justify="space-between"
					direction="row"
				>
					<Grid
						item
						direction="column"
						xs={12}
						sm={12}
						md={9}
						lg={9}
						xl={9}
					>
						<p className={classes.ticketNameCat}>
							{cat.ticketName}
							{` Ticket`}
						</p>
						<p className={classes.ticketAvailabilityCat}>
							{cat.ticketAvailability
								? cat.noOfTickets
								: `Unlimited  Tickets`}
						</p>
					</Grid>
					<Grid
						xs={12}
						sm={12}
						md={3}
						lg={3}
						xl={3}
						item
						direction="column"
						style={{
							textAlign: "end",
						}}
					>
						<p
							className={classes.dollarPriceCat}
							title={"$" + cat.dollarPrice}
						>
							{
								// cat.dollarPrice
								pricingFormatter(cat.dollarPrice, "$")
							}
						</p>
						<p
							className={classes.phnxPriceCat}
							title={cat.phnxPrice + " PHNX"}
						>
							{
								// cat.phnxPrice
								pricingFormatter(cat.phnxPrice, "PHNX")
							}
						</p>
					</Grid>
				</Grid>
				<Grid
					item
					container
					xs={2}
					sm={2}
					md={1}
					lg={1}
					xl={1}
					direction="column"
					justify="space-evenly"
					alignContent="flex-start"
				>
					<Grid item>
						<Button
							// onClick={handleSubmit((data) =>
							// 	handleEditTicketCategory(data, index, cat)
							// )}
							style={{
								justifyContent: "center",
							}}
						>
							<img src={editIcon} alt="editIcon" />
						</Button>
					</Grid>
					<Grid item>
						<Button
							// onClick={handleSubmit((data) =>
							// 	handleDeleteTicketCategory(data, index, cat)
							// )}
							style={{
								justifyContent: "center",
							}}
						>
							<img src={deleteIcon} alt="deleteIcon" />
						</Button>
					</Grid>
				</Grid>
			</Grid>
		</div>
	);
};

export default TicketCategory;
