import React, { useState, useEffect } from "react";
import {
	Button,
	ClickAwayListener,
	Grow,
	ListItemIcon,
	ListItemText,
	makeStyles,
	MenuItem,
	MenuList,
	Paper,
	Popper,
	Select,
} from "@material-ui/core";
import PropTypes from "prop-types";
import { drizzleConnect } from "drizzle-react";
// import PhnxPriceLogo from "../Images/phnxPriceLogo.svg";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
// import { RinkbeyNetworkArray } from "../../config/const";

const useStyles = makeStyles((theme) => ({
	menuPaper: {
		maxHeight: "200px",
	},
	networkIcon: {
		minWidth: "20px",
		alignItems: "center",
		paddingRight: "4px",
	},
	PhnxPrice: {
		// fontSize: "22px
		fontWeight: "700",
		justifyContent: "right",
		display: "flex",
		fontSize: "16px",
		padding: "0px",
		color: "#413AE2",
		textAlign: "end",
		fontFamily: "'Aeonik', sans-serif",
	},
	PhnxPriceEventPage: {
		fontSize: "22px",
		fontWeight: "700",
		color: "#413AE2",
		display: "flex",
		wordBreak: "break-word",
	},
	menuItem: {
		flex: "none",
	},
}));

// function PriceSelectBox({ value, token, isEventPage }) {
function PriceSelectBox(props) {
	const classes = useStyles();
	const [price, setPrice] = React.useState({
		token: props.token,
		amount: props.value,
	});
	const [open, setOpen] = React.useState(false);
	const anchorRef = React.useRef(null);

	const handleToggle = () => {
		setOpen((prevOpen) => !prevOpen);
	};

	const handleClose = (event) => {
		if (anchorRef.current && anchorRef.current.contains(event.target)) {
			return;
		}
		setOpen(false);
	};

	function handleListKeyDown(event) {
		if (event.key === "Tab") {
			event.preventDefault();
			setOpen(false);
		}
	}
	const prevOpen = React.useRef(open);
	React.useEffect(() => {
		if (prevOpen.current === true && open === false) {
			anchorRef.current.focus();
		}

		prevOpen.current = open;
	}, [open]);

	React.useEffect(() => {
		if (props.value) {
			setPrice({ token: props.token, amount: props.value });
		}
	}, [props.value]);

	const handleChangeInPrice = (event) => {
		event.preventDefault();
		let { myValue } = event.currentTarget.dataset;
		// if (myValue) {
		// 	[
		// 		...RinkbeyNetworkArray[props.networkId == 137 ? 0 : 1].networks,
		// 	].map((v, i) => {
		// 		if (v.tokenName == myValue) {
		// 			props.setSelectedToken(v);
		// 		}
		// 	});
		// }
		if (myValue && props.tokensListContract) {
			props.tokensListContract.map((v, i) => {
				if (v.tokenName == myValue) {
					props.setSelectedToken(v);
				}
			});
		}
		// props.setSelectedToken(myValue)
		// console.log("hello: ", myValue)
		//   use myValue for change in currency
		// and according to the return value from coingecko setPrice
	};
	return (
		<div>
			<div style={{ display: "flex", justifyContent: "right" }}>
				<Button
					ref={anchorRef}
					aria-controls={open ? "menu-list-grow" : undefined}
					aria-haspopup="true"
					onTouchStart={(event) => event.stopPropagation()}
					onMouseDown={(event) => event.stopPropagation()}
					value={props.token}
					onClick={(event) => {
						// Prevent CardActionArea Click
						event.preventDefault();
						handleToggle(event);
					}}
					className={
						props.isEventPage
							? classes.PhnxPriceEventPage
							: classes.PhnxPrice
					}
				>
					<img
						src={props.selectedToken && props.selectedToken.image}
						style={{
							height: props.isEventPage ? "25px" : "20px",
							marginRight: "4px",
						}}
					/>
					{price.amount
						? `${
								props.isPHNX
									? price.amount
									: (Number(price.amount) * 1.02)
											.toString()
											.slice(0, 7)
						  }` // If token is not Phnx it's price will be shown 102%
						: `__`}
					{console.log(
						"price.amount at PriceSelectBox",
						props.isPHNX
					)}
					<ArrowDropDownIcon
						style={{ color: "rgba(0, 0, 0, 0.7)" }}
					/>
				</Button>
				<Popper
					open={open}
					anchorEl={anchorRef.current}
					role={undefined}
					transition
					style={{ zIndex: "1331" }}
				>
					{({ TransitionProps, placement }) => (
						<Grow
							{...TransitionProps}
							style={{
								transformOrigin:
									placement === "bottom"
										? "center top"
										: "center bottom",
							}}
						>
							<Paper>
								<ClickAwayListener onClickAway={handleClose}>
									<MenuList
										autoFocusItem={open}
										id="menu-list-grow"
										onKeyDown={handleListKeyDown}
									>
										{/* {[
											...RinkbeyNetworkArray[
												props.networkId == 137 ? 0 : 1
											].networks,
										].map((data) => { */}
										{props.tokensListContract &&
											props.tokensListContract.map(
												(data, i) => {
													return (
														<MenuItem
															value={
																data.tokenName
															}
															data-my-value={
																data.tokenName
															}
															onTouchStart={(
																event
															) =>
																event.stopPropagation()
															}
															onMouseDown={(
																event
															) =>
																event.stopPropagation()
															}
															onClick={(
																event
															) => {
																// Prevent CardActionArea Click
																handleChangeInPrice(
																	event
																);
																handleToggle(
																	event
																);
															}}
														>
															<ListItemIcon
																className={
																	classes.networkIcon
																}
															>
																<img
																	src={
																		data.image
																	}
																	style={{
																		height: "20px",
																	}}
																/>
															</ListItemIcon>
															<ListItemText
																className={
																	classes.menuItem
																}
															>
																{
																	data.displayName
																}
															</ListItemText>
														</MenuItem>
													);
												}
											)}
									</MenuList>
								</ClickAwayListener>
							</Paper>
						</Grow>
					)}
				</Popper>
			</div>
		</div>
	);
}
PriceSelectBox.contextTypes = {
	drizzle: PropTypes.object,
};
const mapStateToProps = (state) => {
	return {
		accounts: state.accounts[0],
		networkId: state.web3.networkId,
	};
};

const AppContainer = drizzleConnect(PriceSelectBox, mapStateToProps);
export default AppContainer;

// export default PriceSelectBox;
