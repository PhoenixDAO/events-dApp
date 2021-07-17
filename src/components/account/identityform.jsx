import React, { useState } from "react";
import "./identityform.css";
import roundlogo from "../Images/roundlogo.svg";
import AlreadyForm from "./alreadyform";
import HolderForm from "./holderform";
import CustomForm from "./customform";
const IdentityForm = (props) => {
	const [selectImage, setSelectImage] = useState({});
	const [formType, setFormType] = useState("");

	const handleNextForm = (value, type) => {
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

	// const handle

	// const switchNextForm = (value) => {
	// 	setNextForm(value);
	// };
	const avatars = [
		{ img: "/images/metamask.svg", name: "Bennue", onclick: false },
		{ img: "/images/metamask.svg", name: "Milcham", onclick: false },
		{ img: "/images/metamask.svg", name: "Thunderbird", onclick: false },
		{ img: "/images/metamask.svg", name: "Garuda", onclick: false },
		{ img: "/images/metamask.svg", name: "Firebird", onclick: false },
		{ img: "/images/metamask.svg", name: "Custom", onclick: true },
	].map((data) => {
		return (
			<div className="single-avatar-hldr">
				{data.onclick ? (
					<div onClick={() => handleNextForm(true, "customform")}>
						<label for="file-upload" className="custom-file-upload">
							+
						</label>
						{/* <input
							id="file-upload"
							type="file"
							name="file"
							onChange={(e) => setFile(e.target.files[0])}
						/> */}
					</div>
				) : (
					<div
						onClick={(e) =>
							setSelectImage({ img: data.img, name: data.name })
						}
						className={
							selectImage.name === data.name
								? "select-av-img acc-av-hldr"
								: "acc-av-hldr"
						}
					>
						<img className="acc-av" src={data.img} />
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
					<div className="">
						<button
							className="avatar-select-btn"
							onClick={() => handleNextForm(true, "alreadyform")}
						>
							Select
						</button>
					</div>
				</div>
			) : (
				<HolderForm
					formtype={
						formType === "alreadyform" ? (
							<AlreadyForm selectImage={selectImage} />
						) : (
							<CustomForm />
						)
					}
				/>
				// <AlreadyForm selectImage={selectImage} />
			)}
		</div>
	);
};
export default IdentityForm;
