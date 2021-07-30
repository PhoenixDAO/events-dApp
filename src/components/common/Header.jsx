import React, { useState } from "react";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";
import { makeStyles } from "@material-ui/core/styles";
import { drizzleConnect } from "drizzle-react";
import PropTypes from "prop-types";
import {
	Button,
	Grid,
	Avatar,
	FormControl,
	Select,
	IconButton,
} from "@material-ui/core";
import { ShoppingCartOutlined, ModeCommentOutlined } from "@material-ui/icons";
import { nullFormat } from "numeral";
import BuyPhnxButton from "./BuyPhnxButton";
import ConnectWalletButton from "./ConnectWalletButton";
import SearchBar from "./SearchBar";
import DialogueBox from "./DialogueBox";
import Wallet from "./Wallet";
const useStyles = makeStyles((theme) => ({
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
}));

const Header = ({
	title,
	disabled,
	buttonText,
	goBack,
	page,
	phnxButton,
	searchBar,
	connectWallet,
	buyTicket,
	handleClickOpen2,
	accounts,
}) => {
	const classes = useStyles();
	const [open, setOpen] = useState(false);
	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};
	return (
		<Grid
			className="header3"
			style={
				page == "dashboard" || page == "myEvent"
					? { borderBottom: "0px" }
					: null
			}
		>
			{/* Back button Arrow */}
			<div style={{ display: "flex", alignItems: "center" }}>
				{page === "event" ||
				page === "topic" ||
				page === "accountdetails" ? (
					<IconButton aria-label="delete" onClick={goBack}>
						<KeyboardBackspaceIcon
							fontSize="large"
							style={{ fill: "#1E1E22" }}
						/>
					</IconButton>
				) : null}
				{/* Header Title */}
				<h2>{title}</h2>
			</div>

			{page == "analytics" || page == "create" || phnxButton ? (
				<BuyPhnxButton />
			) : null}

			{searchBar ? <SearchBar /> : null}

			{/* {Object.keys(accounts).length > 0 ? (
				<ConnectWalletButton onClick={handleOpen} />
			) : null} */}
			{connectWallet ? (
				<ConnectWalletButton />
			) : buyTicket ? (
				<div>
					<Button
						variant="contained"
						color="primary"
						style={{ marginRight: "10px" }}
						className={classes.buy}
						onClick={handleClickOpen2}
						disabled={disabled}
					>
						<ShoppingCartOutlined style={{ marginRight: "10px" }} />
						{buttonText}
					</Button>
				</div>
			) : null}
			<DialogueBox open={open} handleClose={handleClose} maxWidth="xs">
				{/* <IdentityForm setNextForm={setNextForm} nextForm={nextForm} /> */}
				<Wallet />
			</DialogueBox>
		</Grid>
	);
};

Header.contextTypes = {
	drizzle: PropTypes.object,
};

const mapStateToProps = (state) => {
	return {
		// contracts: state.contracts,
		accounts: state.accounts,
		transactionStack: state.transactionStack,
		web3: state.web3,
	};
};

const AppContainer = drizzleConnect(Header, mapStateToProps);
export default AppContainer;
