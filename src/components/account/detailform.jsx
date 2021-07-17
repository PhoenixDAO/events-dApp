import React, { useState } from "react";
import "./detailform.css";
import CreateOutlinedIcon from "@material-ui/icons/CreateOutlined";
import DialogueBox from "../common/DialogueBox";
import { drizzleConnect } from "drizzle-react";
import { updateUserDetails } from "../../config/serverAPIs";
import PropTypes from "prop-types";
import IdentityForm from "./identityform";
const DetailForm = (props) => {
	const [open, setOpen] = useState(false);
	const [organizer, setOrganizer] = useState("");
	const [avatarCustom, setAvatarCustom] = useState(false);
	const [alternateCurrency, setAlternateCurrency] = useState("Dollar");
	const [file, setFile] = useState({});
	const [nextForm, setNextForm] = useState(false);
	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setNextForm(false);
		setOpen(false);
	};

	const updateUserInfo = () => {
		updateUserDetails({
			address: props.account,
			networkId: props.networkId,
			name: "Bennue", //we need to change this when the design is finalised
			organizer,
			avatarCustom, //we need to change this when the design is finalised
			avatarNumber: 1, //we need to change this when the design is finalised
			alternateCurrency,
		});
	};

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
				<div className="acc-av-hldr">
					<img className="acc-av" src="/images/metamask.svg" />
				</div>
				<div className="acc-title-hlder">
					<p className="acc-title"> Bennu </p>
					<CreateOutlinedIcon
						onClick={handleOpen}
						style={{ color: "blueviolet", width: "20px" }}
					/>
				</div>
			</div>
			<div className="acc-form-hldr">
				<form>
					<div className="acc-form-prt">
						<div className="frm-single">
							<p className="acc-inpt-heading">WALLET ADDRESS</p>
							<input className="acc-inpt" value={props.account} />
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
					<div className="acc-form-prt">
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
							></textarea>
							<p className="org-subheading">
								Not more than 500 words.
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
				<IdentityForm setNextForm={setNextForm} nextForm={nextForm} />
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
