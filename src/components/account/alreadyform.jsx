import React from "react";
import "./alreadyform.css";
import roundlogo from "../Images/roundlogo.svg";

const AlreadyForm = (props) => {
	const closeForm=(e)=>{
		e.preventDefault()
		props.handleClose()
	}
	return (
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
			<div className="already-div">
				<div className="already-av-holder">
					<img
						className="already-av-img"
						src={props.selectImage.img}
					/>
				</div>
				<p className="already-av-text"> {props.selectImage.name}</p>
				<p className="alread-av-desc">
					{props.selectImage.detail}
				</p>
			</div>
			<div className="flexClass">
				<button
					className="already-select-btn"
					onClick={closeForm}
				>
					Enter Events Dapp
				</button>
			</div>
		</div>
	);
};
export default AlreadyForm;
