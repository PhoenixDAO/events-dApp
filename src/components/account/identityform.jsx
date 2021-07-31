import React, { useState } from "react";
import "./identityform.css";
import roundlogo from "../Images/roundlogo.svg";
import AlreadyForm from "./alreadyform";
import HolderForm from "./holderform";
import CustomForm from "./customform";

const IdentityForm = (props) => {
	const [selectImage, setSelectImage] = useState({});
	const [formType, setFormType] = useState("");

	const handleNextForm = (e, value, type) => {
		e.preventDefault();
		if (type === "alreadyform") {
			if (selectImage.name) {
				setFormType(type);
				props.setNextForm(value);
			}
		} else {
			setFormType(type);
			props.setNextForm(value);
		}
	};

	const handleSelectedAvatar = (e, { index, img, name }) => {
		e.preventDefault();
		setSelectImage({ img, name });
		// props.handleAvatarNumber(index);
		// props.handleName(name);
	};
	const toggleForm = () => {
		props.setNextForm("");
	}
	const avatars = [

		{ img: "/images/avatars/bennu.svg", name: "Bennu", onclick: false },
		{ img: "/images/avatars/milcham.svg", name: "Milcham", onclick: false },
		{ img: "/images/avatars/thunderbird.svg", name: "Thunderbird", onclick: false },
		{ img: "/images/avatars/garuda.svg", name: "Garuda", onclick: false },
		{ img: "/images/avatars/firebird.svg", name: "Firebird", onclick: false },
		{ img: "/images/avatars/metamask.svg", name: "Custom", onclick: true },
	].map((data) => {
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
