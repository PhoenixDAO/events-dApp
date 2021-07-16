import React, { useState } from "react";
import "./detailform.css";
import CreateOutlinedIcon from "@material-ui/icons/CreateOutlined";
import DialogueBox from "../common/DialogueBox";
import roundlogo from "../Images/roundlogo.svg";
import { drizzleConnect } from "drizzle-react";
import { updateUserDetails } from "../../config/serverAPIs";
import PropTypes from "prop-types";
const DetailForm = (props) => {
	const [open, setOpen] = useState(false);
	const [organizer, setOrganizer] = useState("");
	const [avatarCustom, setAvatarCustom] = useState(false);
	const [alternateCurrency, setAlternateCurrency] = useState("Dollar");
	const [selectImage, setSelectImage] = useState("");
	const [file, setFile] = useState({});
	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
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

	const uploadImage = () => {
		
	};

	const avatars = [
		{ img: "/images/metamask.svg", name: "Bennue", onclick: false },
		{ img: "/images/metamask.svg", name: "Bennue", onclick: false },
		{ img: "/images/metamask.svg", name: "Bennue", onclick: false },
		{ img: "/images/metamask.svg", name: "Bennue", onclick: false },
		{ img: "/images/metamask.svg", name: "Bennue", onclick: false },
		{ img: "/images/metamask.svg", name: "Custom", onclick: true },
	].map((data) => {
		return (
			<div
				className="single-avatar-hldr"
				onClick={(e) => setSelectImage(e.target.img)}
			>
				{data.onclick ? (
					<div>
						<label for="file-upload" className="custom-file-upload">
							+
						</label>
						<input
							id="file-upload"
							type="file"
							name="file"
							onChange={(e) => setFile(e.target.files[0])}
						/>
					</div>
				) : (
					<div className="acc-av-hldr">
						<img className="acc-av" src={data.img} />
					</div>
				)}
				<div className="acc-title-hlder">
					<p className="acc-title"> {data.name} </p>
				</div>
			</div>
		);
	});

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
			<DialogueBox open={open} handleClose={handleClose}>
				<div className="idn-hldr">
					<div className="idn-head">
						<div>
							<img
								style={{ height: "24px" }}
								src={roundlogo}
								alt="phnx logo"
							/>
						</div>
						<div>
							<p className="idn-heading">PhoenixDAO</p>
						</div>
					</div>
					<div className="idn-sub">
						<h5 className="idn-subhead1"> Choose your identity</h5>
						<p className="idn-subhead2">
							This will be used as your avatar in the dApp
						</p>
					</div>
					<div className="avatar-hldr">{avatars}</div>
					<div className="">
						<button className="avatar-select-btn">Select</button>
					</div>
				</div>
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
