import React, { useState } from "react";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";
import { makeStyles } from "@material-ui/core/styles";
import { drizzleConnect } from "drizzle-react";
import PropTypes from "prop-types";
import clsx from "clsx";
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
import BuyPhoenixModal from "./BuyPhoenixModal";
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
	SearchAndBuyPheonixButtonMargin:{
		margin: theme.spacing(1)
	}
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
	search,
	handleSearch,
	allowBuy,
}) => {
	const classes = useStyles();
	const [openWallet, setOpenWallet] = useState(false);
	const [openBuyPhnx, setOpenBuyPhnx] = useState(false);
	const [transak, setTransak] = useState(false);
	const handleOpenWallet = () => {
		setOpenWallet(true);
	};

	const handleCloseWallet = () => {
		setOpenWallet(false);
	};

	const handleOpenBuyPhnx = () => {
		setOpenBuyPhnx(true);
	};

	const handleCloseBuyPhnx = () => {
		setOpenBuyPhnx(false);
	};

	const openTransak = () => {
		setTransak(true);
	};

	const closeTransak = () => {
		setTransak(false);
	};

	let connect = searchBar && Object.keys(accounts).length !== 0;

	return (
		<div
			className={clsx(
				"header-top",
				(page === "dashboard" || page === "myEvent") &&
					"header-top-dashboard"
			)}
			style={
				page === "dashboard" || page === "myEvent"
					? { borderBottom: "0px" }
					: null
			}
		>
			<Grid className="header3">
				{/* Back button Arrow */}
				<div
					className="header-heading"
					style={{ display: "flex", alignItems: "center" }}
				>
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

				{/* {page == "analytics" || page == "create" || phnxButton ? (
				<BuyPhnxButton />
			) : null} */}
				{/* {console.log("title page for dashboard", title.props.children[2].props.children)} */}
				{searchBar ? (
					<div className={(page=="dashboard")&&classes.SearchAndBuyPheonixButtonMargin}>
					<SearchBar
						connect={connect}
						handleSearch={handleSearch}
						search={search}
					/>
					</div>
				) : null}
				{Object.keys(accounts).length === 0 ? (
					<ConnectWalletButton onClick={handleOpenWallet} />
				) : buyTicket ? (
					<div>
						<Button
							variant="contained"
							color="primary"
							style={{ marginRight: "10px", marginBottom: "10px" }}
							className={classes.buy}
							onClick={() =>
								allowBuy() ? handleClickOpen2() : null
							}
							disabled={disabled}
						>
							<ShoppingCartOutlined
								style={{ marginRight: "10px" }}
							/>
							{buttonText}
						</Button>
					</div>
				) : page === "analytics" ||
					page === "create" ||
					page === "confirm-purchase" ||
					phnxButton ? (
						<div className={(page=="dashboard")&&classes.SearchAndBuyPheonixButtonMargin}>
					<BuyPhnxButton onClick={handleOpenBuyPhnx} />
					</div>
				) : null}
				<DialogueBox
					open={openWallet}
					handleClose={handleCloseWallet}
					maxWidth="xs"
				>
					{/* <IdentityForm setNextForm={setNextForm} nextForm={nextForm} /> */}
					<Wallet />
				</DialogueBox>
				<DialogueBox
					open={openBuyPhnx}
					handleClose={handleCloseBuyPhnx}
					maxWidth="xs"
				>
					<BuyPhoenixModal
						handleClose={handleCloseBuyPhnx}
						openTransak={openTransak}
						closeTransak={closeTransak}
						transak={transak}
						accounts={accounts}
					/>
				</DialogueBox>
			</Grid>
		</div>
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
