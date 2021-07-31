import React, { useState, useRef } from "react";
import "./detailform.css";
import CreateOutlinedIcon from "@material-ui/icons/CreateOutlined";
import DialogueBox from "../common/DialogueBox";
import { drizzleConnect } from "drizzle-react";
import { updateUserDetails } from "../../config/serverAPIs";
import PropTypes from "prop-types";
import IdentityForm from "./identityform";
import Tooltip from "@material-ui/core/Tooltip";

const DetailForm = (props) => {
	const [open, setOpen] = useState(false);
	const [organizer, setOrganizer] = useState("");
	const [avatarCustom, setAvatarCustom] = useState(false);
	const [alternateCurrency, setAlternateCurrency] = useState("Dollar");
	const [avatar, setAvatar] = useState("");
	const [file, setFile] = useState({});
	const [nextForm, setNextForm] = useState(false);
	const orgref = useRef(null);
	const [copytext, setCopyText] = useState("Copy");
	const [name, setName] = useState("Bennu");
	const [avatarNumber, setAvatarNumber] = useState(0);

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

	const updateUserInfo = (e) => {
		e.preventDefault();
		console.log({
			address: props.account,
			networkId: props.networkId,
			name: name, //we need to change this when the design is finalised
			organizerDetails: organizer,
			avatarCustom: avatarCustom, //we need to change this when the design is finalised
			avatarNumber: avatarNumber, //we need to change this when the design is finalised
			avatar: avatar,
			alternateCurrency: alternateCurrency,
		});
		updateUserDetails({
			address: props.account,
			networkId: props.networkId,
			name: "fgfg", //we need to change this when the design is finalised
			organizerDetails: organizer,
			avatarCustom: avatarCustom, //we need to change this when the design is finalised
			avatarNumber: avatarNumber, //we need to change this when the design is finalised
			avatar: avatar,
			alternateCurrency: alternateCurrency,
		});
	};


	// const orgDetails = (e) => {
	// 	// if (e.target.value.split(" ").length <= 500) {
	// 	// 	orgref.current.enabled;
	// 	setOrganizer(e.target.value);
	// 	// } else {
	// 	// 	e.preventDefault();
	// 	// 	console.log("Length of organizer details exceeded");
	// 	// }
	// };

	const currency = [
		{ name: "Dollar", flag: "" },
		{ name: "Euro", flag: "" },
		{ name: "British Pound", flag: "" },
	].map((data) => {
		return <option value={data.name}>{data.name}</option>;
	});

	return (
		<div className="dtl-hldr">
			<div className="acc-basic-info">
			<img alt="banner"  className="banner" src="/images/accountDetails.jpg" />

				<div className="acc-av-hldr">

					<img className="acc-av" src="/images/metamask.svg" />
				</div>
				<div className="acc-title-hlder">
					<p className="acc-title"> Bennu </p>
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
											handleCopy("Copied");
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
							<p className="acc-inpt-heading">
								ALTERNATIVE CURRENCY
							</p>
							<select
								className="acc-inpt acc-select"
								onChange={(e) =>
									setAlternateCurrency(e.target.value)
								}
								value={organizer}
							>
								{currency}
							</select>
						</div>
					</div>
					<div className="acc-form-prt" style={{ marginTop: "70px" }}>
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
						>
							Save
						</button>
					</div>
				</form>
			</div>
			<DialogueBox open={open} handleClose={handleClose} maxWidth="sm">
				<IdentityForm setNextForm={setNextForm}
				goBack={props.goBack}
					nextForm={nextForm}
					handleName={handleName}
					handleAvatar={handleAvatar}
					handleCustomAvatar={handleCustomAvatar}
					handleClose={handleClose}
					handleAvatarNumber={handleAvatarNumber} />
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
export default AppContainer;

// export default DetailForm;
