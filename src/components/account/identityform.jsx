import React, { useState } from "react";
import "./identityform.css";
import roundlogo from "../Images/roundlogo.svg";
import AlreadyForm from "./alreadyform";
import HolderForm from "./holderform";
import CustomForm from "./customform";

const IdentityForm = (props) => {
	const [selectImage, setSelectImage] = useState({});
	const [formType, setFormType] = useState("");
	const [name, setName] = useState(props.name);
	const [avatarNumber, setavatarNumber] = useState(props.avatarNumber);
	const [avatarCustom, setavatarCustom] = useState(props.avatarCustom);
	const handleNextForm = (e, value, type) => {
		e.preventDefault();
		if (type === "alreadyform") {
			if (selectImage.name) {
				props.handleAvatarNumber(avatarNumber);
				props.handleName(name);
				props.handleCustomAvatar(avatarCustom);
				setFormType(type);
				props.setNextForm(value);
			}
		} else {
			setFormType(type);
			props.setNextForm(value);
		}
	};

	const handleSelectedAvatar = (e, { index, detail, img, name }) => {
		e.preventDefault();
		setSelectImage({ img, detail, name });
		setName(name);
		setavatarCustom(false);
		setavatarNumber(index);
		// props.handleAvatarNumber(index);
		// props.handleName(name);
		// props.handleCustomAvatar(false);
	};
	const toggleForm = () => {
		props.setNextForm("");
	};
	const avatars = [
		{
			img: "/images/avatars/bennu.svg",
			name: "Bennu",
			detail: "The creature called Bennu was known to be a bird that was similar to a heron. Bennu was said to have lived on top of stones and obelisks. The Bennu was reborn over every 500 years rather than a thousand",
			onclick: false,
		},
		{
			img: "/images/avatars/milcham.svg",
			name: "Milcham",
			detail: "The Milcham bird was said to have refused the fruit in the garden of Eden and was therefore rewarded for its faithfulness. Every 1,000 years, the Milcham bird would end one cycle of life",
			onclick: false,
		},
		{
			img: "/images/avatars/thunderbird.svg",
			name: "Thunderbird",
			detail: "Similarly to Garuda, the Thunderbird is known to guard against the evil serpent figure and is thought of as a protector. Many legends suggest that Thunderbirds had the ability to shapeshift into human form.",
			onclick: false,
		},
		{
			img: "/images/avatars/garuda.svg",
			name: "Garuda",
			detail: "Garuda is a solar bird that is known to be the mount of the god Vishnu and was also seen as a protector against the evil serpent. He is known to have been described as ‘the King of all birds",
			onclick: false,
		},
		{
			img: "/images/avatars/firebird.svg",
			name: "Firebird",
			detail: "The Firebird was also different from the traditional Phoenix because of its life cycle. It symbolizes the different seasons. The bird finishes its life cycle in the fall months but is revived again in the spring",
			onclick: false,
		},
		{ img: "/images/avatars/metamask.svg", name: "Custom", onclick: true },
	].map((data, i) => {
		return (
			<div className="single-avatar-hldr">
				{data.onclick ? (
					<div onClick={(e) => handleNextForm(e, true, "customform")}>
						<label
							for="file-upload"
							className="custom-file-upload-idn"
						>
							+
						</label>
					</div>
				) : (
					<div
						onClick={(e) =>
							handleSelectedAvatar(e, {
								index: i,
								detail: data.detail,
								img: data.img,
								name: data.name,
							})
						}
						className={
							selectImage.name === data.name
								? "select-av-img idn-av-hldr"
								: "idn-av-hldr"
						}
					>
						<img className="idn-av" src={data.img} />
					</div>
				)}
				<div className="acc-title-hlder">
					<p className="acc-title"> {data.name} </p>
				</div>
			</div>
		);
	});

	return (
		<div>
			{!props.nextForm ? (
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
					<div className="avatar-select-div">
						<button
							className="avatar-select-btn"
							onClick={(e) =>
								handleNextForm(e, true, "alreadyform")
							}
						>
							Select
						</button>
					</div>
				</div>
			) : (
				<HolderForm
					formtype={
						formType === "alreadyform" ? (
							<AlreadyForm
								selectImage={selectImage}
								toggleForm={toggleForm}
								handleClose={props.handleClose}
								handleAvatarNumber={props.handleAvatarNumber}
								handleCustomAvatar={props.handleCustomAvatar}
							/>
						) : (
							<CustomForm
								handleCustomAvatar={props.handleCustomAvatar}
								handleName={props.handleName}
								handleClose={props.handleClose}
								handleAvatar={props.handleAvatar}
								toggleForm={toggleForm}
							/>
						)
					}
				/>
				// <AlreadyForm selectImage={selectImage} />
			)}
		</div>
	);
};
export default IdentityForm;
