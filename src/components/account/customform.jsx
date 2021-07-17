import React, { useState } from "react";
import "./customform.css";
import roundlogo from "../Images/roundlogo.svg";

const CustomForm = () => {
	const [file, setFile] = useState({});
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
				<p className="idn-subhead2">Create your own custom Avatar</p>
				<div>
					<label for="file-upload" className="custom-file-upload1">
						<span style={{ marginTop: "20px" }}>+ </span>
					</label>
					<input
						id="file-upload"
						type="file"
						name="file"
						onChange={(e) => setFile(e.target.files[0])}
					/>
				</div>
			</div>
			<div>
				<div className="frm-single">
					<p className="avatar-name-heading">AVATAR NAME</p>
					<input className="avatar-name-inpt" />
				</div>
			</div>
			<div className="" style={{marginTop:"20px"}}>
				<button
					className="avatar-select-btn"
					// onClick={() => handleNextForm(true, "alreadyform")}
				>
					Save
				</button>
			</div>
		</div>
	);
};
export default CustomForm;
