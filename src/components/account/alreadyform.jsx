import React from "react";
import "./alreadyform.css";
import roundlogo from "../Images/roundlogo.svg";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";
import IconButton from '@material-ui/core/IconButton';

const AlreadyForm = (props) => {
	const closeForm = (e) => {
		e.preventDefault()
		props.handleClose()
	}
	return (
		<div className="idn-hldr">
			<IconButton aria-label="delete" className="backArrow" onClick={props.toggleForm}>
				<KeyboardBackspaceIcon
					fontSize="40px"
					style={{ fill: "#1E1E22" }}
				/>
			</IconButton>
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
					Enter Events dApp
				</button>
			</div>
		</div>
	);
};
export default AlreadyForm;
