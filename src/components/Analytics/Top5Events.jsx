import React from "react";
import { useStyles } from "./styles";
import { Grid, FormControl, Select, MenuItem } from "@material-ui/core";
const Top5Events = (props) => {
	const classes = useStyles();
	return (
		<Grid className={classes.Top5Events}>
			<Grid className={classes.row}>
				<h2 className={classes.heading2}>Top 5 Events</h2>
				<FormControl variant="outlined" className={classes.select}>
					<Select
						labelId="demo-simple-select-outlined-label"
						id="demo-simple-select-outlined"
						fullWidth
						value={props.timeStamp}
						value={props.revenueCategory}
						onChange={props.handleRevenue}
						displayEmpty
						MenuProps={{
							classes: {
								paper: classes.menuPaper,
							},
							getContentAnchorEl: null,
							anchorOrigin: {
								vertical: "bottom",
								horizontal: "left",
							},
						}}
					>
						<MenuItem
							value="eventRevenueInPhnx"
							style={{
								fontFamily: "'Aeonik', sans-serif",
							}}
						>
							PHNX
						</MenuItem>
						<MenuItem
							value="eventRevenueInDollar"
							style={{
								fontFamily: "'Aeonik', sans-serif",
							}}
						>
							Dollar
						</MenuItem>
					</Select>
				</FormControl>
			</Grid>

			<Grid className={classes.box} style={{ marginTop: "30px" }}>
				<Grid className={classes.row2}>
					<Grid className={classes.header} lg={3}>
						No of Tickets
					</Grid>
					<Grid className={classes.header} lg={6}>
						Event Name
					</Grid>
					<Grid
						className={classes.header}
						style={{ textAlign: "end" }}
						lg={3}
					>
						Revenue
					</Grid>
				</Grid>
				{props.children}
			</Grid>
		</Grid>
	);
};

export default Top5Events;
