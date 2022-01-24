import React, { useState, useRef, useEffect } from "react";
import "./detailform.css";
import DialogueBox from "../common/DialogueBox";
import { drizzleConnect } from "drizzle-react";
import {
	getMessage,
	loginWithMetaMask,
	updateUserDetails,
} from "../../config/serverAPIs";
import PropTypes from "prop-types";
import IdentityForm from "./identityform";
import Tooltip from "@material-ui/core/Tooltip";
import ipfs from "../../utils/ipfs";
import {
	CircularProgress,
	MenuItem,
	Select,
	withStyles,
} from "@material-ui/core";
import Web3 from "web3";
import {
	GLOBAL_NETWORK_ID,
	GLOBAL_NETWORK_ID_2,
	INFURA_URL,
	INFURA_URL_2,
	// RinkbeyNetworkArray,
} from "../../config/const";

// import { useHistory } from "react-router-dom";
const useStyles = (theme) => ({
	detailSelect: {
		borderRadius: "5px",
		border: "1px solid #e4e4e4",
		width: "100%",
		paddingTop: "5px",
		paddingBottom: "5px",
		// paddingLeft: "10px",
		fontSize: "18px",
		"& .MuiSelect-select:focus": {
			background: "#fff",
		},
		"& .MuiSelect-select":{
			paddingLeft:"10px"
		}
	},
});
const DetailForm = (props) => {
	const [open, setOpen] = useState(false);
	const [organizer, setOrganizer] = useState("");
	const [avatarCustom, setAvatarCustom] = useState(false);
	const [alternateCurrency, setAlternateCurrency] = useState(null);
	const [avatar, setAvatar] = useState("");
	const [nextForm, setNextForm] = useState(false);
	const orgref = useRef(null);
	const [copytext, setCopyText] = useState("Copy");
	const [name, setName] = useState("Bennu");
	const [avatarNumber, setAvatarNumber] = useState(0);
	const [ipfsImage, setIpfsImage] = useState("");
	const [loading, setLoading] = useState(false);
	const [noDefaultCurrency, setNoDefaultCurrency] = useState(false);
	// const history = useHistory();

	// useEffect(()=>{},[])

	useEffect(() => {
		console.log(
			"This.props.tokenListContract at detailform",
			props.tokensListContract
		);
		// console.log("props.userDetails at detailform", props.userDetails);
		provideImage();
	}, [props.userDetails]);
	const imageData = (index) => {
		let myArray = [
			{ img: "/images/avatars/bennu.svg", name: "Bennu", onclick: false },
			{
				img: "/images/avatars/milcham.svg",
				name: "Milcham",
				onclick: false,
			},
			{
				img: "/images/avatars/thunderbird.svg",
				name: "Thunderbird",
				onclick: false,
			},
			{
				img: "/images/avatars/garuda.svg",
				name: "Garuda",
				onclick: false,
			},
			{
				img: "/images/avatars/firebird.svg",
				name: "Firebird",
				onclick: false,
			},
			{
				img: "/images/avatars/metamask.svg",
				name: "Custom",
				onclick: true,
			},
		];
		return myArray[index].img;
	};

	const web3Provider = async () => {
		let web3;
		try {
			if (window.ethereum && window.ethereum.isMetaMask) {
				web3 = new Web3(window.ethereum);
			} else if (typeof web3 !== "undefined") {
				web3 = new Web3(web3.currentProvider);
			} else {
				const network = await web3.eth.net.getId();
				let infura;
				if (network === GLOBAL_NETWORK_ID) {
					infura = INFURA_URL;
				} else if (network === GLOBAL_NETWORK_ID_2) {
					infura = INFURA_URL_2;
				}
				web3 = new Web3(new Web3.providers.HttpProvider(infura));
			}
			return web3;
		} catch (err) {
			console.log(err);
		}
	};

	const getNetworkId = async () => {
		let web3;
		try {
			if (window.ethereum && window.ethereum.isMetaMask) {
				web3 = new Web3(window.ethereum);
			} else if (typeof web3 !== "undefined") {
				web3 = new Web3(web3.currentProvider);
			} else {
				const network = await web3.eth.net.getId();
				let infura;
				if (network === GLOBAL_NETWORK_ID) {
					infura = INFURA_URL;
				} else if (network === GLOBAL_NETWORK_ID_2) {
					infura = INFURA_URL_2;
				}
				web3 = new Web3(new Web3.providers.HttpProvider(infura));
			}
			const networkId = await web3.eth.net.getId();
			console.log("This called getNetworkId", networkId);
			if (networkId === GLOBAL_NETWORK_ID) {
				return networkId;
			} else if (networkId === GLOBAL_NETWORK_ID_2) {
				return networkId;
			} else {
				console.log("network id not suported");
			}
			return null;
		} catch (err) {
			console.log("err", err);
		}
	};

	const authMetaMask = async () => {
		try {
			const web3 = await web3Provider();
			const publicAddress = await web3.eth.getAccounts();
			const networkId = await getNetworkId();
			const message = await getMessage();
			const sign = await props.handleSignMessage(
				publicAddress[0],
				message.result.result
			);
			const userData = await loginWithMetaMask({
				publicAddress: publicAddress[0],
				networkId: networkId,
				signature: sign,
				message: message.result.result,
			});
			return userData;
		} catch (err) {
			console.log(err);
		}
	};

	const handleSignMessage = async (publicAddress, message) => {
		try {
			const web3 = await web3Provider();
			const sign = await web3.eth.sign(
				web3.utils.sha3(message),
				publicAddress
			);
			return sign;
		} catch (err) {
			console.log(err);
		}
	};

	const provideImage = () => {
		if (Object.keys(props.userDetails).length > 0) {
			const avaCustom =
				props.userDetails.result.result.userHldr.avatarCustom;
			const avatarId =
				props.userDetails.result.result.userHldr.avatarNumber;
			const ava = props.userDetails.result.result.userHldr.avatar;
			const name = props.userDetails.result.result.userHldr.name;
			const org =
				props.userDetails.result.result.userHldr.organizerDetails;
			if (avaCustom) {
				setAvatar(ava);
			}
			setAvatarCustom(avaCustom);
			setAvatarNumber(avatarId);
			setName(name);
			setOrganizer(org);
		}
	};

	const renderImage = () => {
		if (avatarCustom) {
			ipfs.get(avatar)
				.then((f) => {
					let data = JSON.parse(f[0].content.toString());
					setIpfsImage(data.image0);
				})
				.catch((err) => {
					console.log("ipfs error", err);
				});
			// console.log("avatar ipfs image", avatar);
			if (ipfsImage) {
				// return <img src={ipfsImage} className="bird2" />;
				return ipfsImage;
			}
		} else {
			// return <img src={imageData(avatarNumber)} className="bird" />;
			return imageData(avatarNumber);
		}
	};

	const handleCopy = (value) => {
		navigator.clipboard.writeText(value);
		setCopyText("Copied!");
	};

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setNextForm(false);
		setOpen(false);
	};

	const handleAvatar = (value) => {
		setAvatar(value);
	};

	const handleCustomAvatar = (value) => {
		setAvatarCustom(value);
	};

	const handleName = (value) => {
		setName(value);
	};

	const handleAvatarNumber = (value) => {
		setAvatarNumber(value);
	};

	const updateUserInfo = async (e) => {
		e.preventDefault();
		// console.log('alternateCurrency =>> ', alternateCurrency)
		setLoading(true);
		const detail = await updateUserDetails({
			address: props.account,
			networkId: props.networkId,
			name: name, //we need to change this when the design is finalised
			organizerDetails: organizer,
			avatarCustom: avatarCustom, //we need to change this when the design is finalised
			avatarNumber: avatarNumber, //we need to change this when the design is finalised
			avatar: avatar,
			alternateCurrency: alternateCurrency,
		});
		setLoading(false);
		if (detail.error) {
			if (detail.message.response.status === 403) {
				const userDetails = await authMetaMask();
				if (!userDetails.error) {
					localStorage.removeItem("AUTH_TOKEN");
					localStorage.setItem(
						"AUTH_TOKEN",
						userDetails.result.result.token
					);
					updateUserInfo(e);
				}
			}
		} else {
			console.log("User detailss ==>>>> ", detail);
			props.setUserDetails(detail.result);
			props.history.push("/");
			// window.location.reload();
		}
	};

	useEffect(() => {
		if (
			props.userDetails &&
			props.userDetails.result &&
			props.userDetails.result.result &&
			props.userDetails.result.result.userHldr &&
			props.tokensListContract
		) {
			console.log(
				"UserDetails ,=>>",
				props.userDetails.result.result.userHldr.alternateCurrency
			);
			let defaultCurr =
				props.userDetails.result.result.userHldr.alternateCurrency;
			if (typeof defaultCurr == "string") {
				if (defaultCurr === "Dollar" || defaultCurr === "usd") {
					setAlternateCurrency(
						props.tokensListContract && props.tokensListContract[1]
					);
				}
				if (defaultCurr === "") {
					props.tokensListContract.map((v, i) => {
						if (v.tokenName == "phoenixdao") {
							setAlternateCurrency(props.tokensListContract[i]);
						}
					});
				}
			} else if (typeof defaultCurr == "object") {
				setAlternateCurrency(
					props.userDetails.result.result.userHldr.alternateCurrency
				);
			} else {
				props.tokensListContract.map((v, i) => {
					if (v.tokenName == "phoenixdao") {
						setAlternateCurrency(props.tokensListContract[i]);
					}
				});
			}
		}
	}, [props.userDetails, props.tokensListContract]);
	const { classes } = props;
	return (
		<div className="dtl-hldr">
			<div className="acc-basic-info">
				<img
					alt="banner"
					className="banner"
					src="/images/accountDetails.jpg"
				/>
				<div
					className="acc-av-hldr"
					style={{
						backgroundImage: `url(${renderImage()})`,
						height: "70px",
						backgroundSize: "cover",
						mozBackgroundSize: "cover",
						backgroundPosition: "center",
					}}
				>
					{/* {renderImage()} */}
				</div>
				<div className="acc-title-hlder">
					<p className="acc-title"> {name} </p>
					<div className="redirect-img-hldr" onClick={handleOpen}>
						<img
							className="redirect-img"
							src="/images/redirect.svg"
						/>
					</div>
				</div>
			</div>
			<div className="acc-form-hldr">
				<form>
					<div className="acc-form-prt">
						<div className="frm-single">
							<p className="acc-inpt-heading">WALLET ADDRESS</p>
							<div className="acc-wallet-input-holder">
								<div style={{ width: "100%" }}>
									<input
										className="acc-inpt"
										value={props.account}
									/>
								</div>
								<Tooltip title={copytext} arrow>
									<div
										className="acc-copy-img-holder"
										onMouseEnter={() => setCopyText("Copy")}
										onClick={() => {
											handleCopy(props.account);
										}}
									>
										<img
											className="acc-copy-img"
											src="/images/copy.svg"
										/>
									</div>
								</Tooltip>
							</div>
						</div>
					</div>
					<div className="acc-form-prt">
						<div className="frm-single">
							<p className="acc-inpt-heading">DEFAULT CURRENCY</p>

							<Select
								onChange={(e) => {
									setAlternateCurrency({
										tokenName: e.target.value,
										chainId: props.networkId,
									});
								}}
								value={
									alternateCurrency &&
									alternateCurrency.tokenName
								}
								labelId="demo-simple-select-outlined-label"
								id="demo-simple-select-outlined"
								fullWidth
								displayEmpty
								disableUnderline 
								className={classes.detailSelect}
								MenuProps={{
									classes: {
										paper: { maxHeight: "200px" },
									},
									getContentAnchorEl: null,
									anchorOrigin: {
										vertical: "bottom",
										horizontal: "left",
									},
								}}
							>
								{props.tokensListContract &&
									props.tokensListContract.map((v, i) => {
										return (
											<MenuItem
												value={v.tokenName}
												style={{
													fontFamily:
														"'Aeonik', sans-serif",
												}}
											>
												<img
													src={v.image}
													style={{
														height: "20px",
														marginRight: 10,
													}}
												/>
												{v.displayName}
											</MenuItem>
										);
									})}
							</Select>
						</div>
					</div>
					{/* <p>{alternateCurrency} {props.networkId}</p> */}
					<div className="acc-form-prt" style={{ marginTop: "40px" }}>
						<div>
							<h6 className="org-heading">Organizer details</h6>
							<p className="org-subheading">
								Use this field to add details about you as an
								organizer. This helps build trust as a event
								creator.
							</p>
						</div>
						<div className="frm-single">
							<p className="acc-inpt-heading">
								ORGANIZER DETAILS
							</p>
							<textarea
								value={organizer}
								className="acc-inpt"
								rows="4"
								cols="50"
								onChange={(e) => setOrganizer(e.target.value)}
								ref={orgref}
								maxLength="500"
							></textarea>
							<p className="org-subheading">
								Not more than 500 characters.
							</p>
						</div>
					</div>
					<div className="acc-form-prt frm-btn-hldr">
						<button
							className="acc-frm-btn"
							onClick={updateUserInfo}
							disabled={loading}
						>
							{loading ? (
								<CircularProgress
									style={{
										color: "white",
										width: "15px",
										height: "15px",
									}}
								/>
							) : (
								"Save"
							)}
						</button>
					</div>
				</form>
			</div>
			<DialogueBox open={open} handleClose={handleClose} maxWidth="sm">
				<IdentityForm
					setNextForm={setNextForm}
					goBack={props.goBack}
					nextForm={nextForm}
					name={name}
					avatarNumber={avatarNumber}
					avatarCustom={avatarCustom}
					handleName={handleName}
					handleAvatar={handleAvatar}
					handleCustomAvatar={handleCustomAvatar}
					handleClose={handleClose}
					handleAvatarNumber={handleAvatarNumber}
				/>
			</DialogueBox>
		</div>
	);
};

DetailForm.contextTypes = {
	drizzle: PropTypes.object,
};

const mapStateToProps = (state) => {
	return {
		accounts: state.accounts[0],
		networkId: state.web3.networkId,
	};
};

const AppContainer = drizzleConnect(DetailForm, mapStateToProps);
export default withStyles(useStyles)(AppContainer);

// export default DetailForm;
