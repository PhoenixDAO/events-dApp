import React, { useState, useRef, useEffect } from "react";
import "./detailform.css";
import DialogueBox from "../common/DialogueBox";
import { drizzleConnect } from "drizzle-react";
import { updateUserDetails } from "../../config/serverAPIs";
import PropTypes from "prop-types";
import IdentityForm from "./identityform";
import Tooltip from "@material-ui/core/Tooltip";
import ipfs from "../../utils/ipfs";

const DetailForm = (props) => {
	const [open, setOpen] = useState(false);
	const [organizer, setOrganizer] = useState("");
	const [avatarCustom, setAvatarCustom] = useState(false);
	const [alternateCurrency, setAlternateCurrency] = useState("Dollar");
	const [avatar, setAvatar] = useState("");
	const [nextForm, setNextForm] = useState(false);
	const orgref = useRef(null);
	const [copytext, setCopyText] = useState("Copy");
	const [name, setName] = useState("Bennu");
	const [avatarNumber, setAvatarNumber] = useState(0);
	const [ipfsImage, setIpfsImage] = useState("");
	useEffect(() => {
		console.log("this.props.userDetails", props.userDetails);
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

	const provideImage = () => {
		if (Object.keys(props.userDetails).length > 0) {
			console.log("userdetailsss", props.userDetails);
			const avaCustom = props.userDetails.result.result.avatarCustom;
			const avatarId = props.userDetails.result.result.avatarNumber;
			const ava = props.userDetails.result.result.avatar;
			const name = props.userDetails.result.result.name;
			const org = props.userDetails.result.result.organizerDetails;
			console.log("avatarCustom,", avaCustom);
			if (avaCustom) {
				// ipfs.get(ava).then((f) => {
				// 	let data = JSON.parse(f[0].content.toString());
				// 	console.log("Data image", data);
				// 	setAvatar(data.image0);
				// });
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
					console.log("Data image", data);
					setIpfsImage(data.image0);
				})
				.catch((err) => {
					console.log("ipfs error", err);
				});
			console.log("avatar ipfs image", avatar);
			if (ipfsImage) {
				return <img src={ipfsImage} className="bird2" />;
			}
		} else {
			return <img src={imageData(avatarNumber)} className="bird" />;
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
		if (detail.error) {
			console.log("error occured");
		} else {
			window.location.reload();
		}
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
				<img
					alt="banner"
					className="banner"
					src="/images/accountDetails.jpg"
				/>
				<div className="acc-av-hldr">{renderImage()}</div>
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
							<p className="acc-inpt-heading">
								ALTERNATIVE CURRENCY
							</p>
							<select
								className="acc-inpt acc-select"
								onChange={(e) =>
									setAlternateCurrency(e.target.value)
								}
								value={alternateCurrency}
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
