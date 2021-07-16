import React, { useState } from "react";
import "./detailform.css";
import CreateOutlinedIcon from "@material-ui/icons/CreateOutlined";
import DialogueBox from "../common/DialogueBox";
import roundlogo from "../Images/roundlogo.svg";

const DetailForm = () => {
	const [open, setOpen] = useState(false);

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const avatars = [
		{ img: "/images/metamask.svg", name: "Bennue" },
		{ img: "/images/metamask.svg", name: "Bennue" },
		{ img: "/images/metamask.svg", name: "Bennue" },
		{ img: "/images/metamask.svg", name: "Bennue" },
		{ img: "/images/metamask.svg", name: "Bennue" },
		{ img: "/images/metamask.svg", name: "Bennue" },
	].map((data) => {
		return (
			<div className="single-avatar-hldr">
				<div className="acc-av-hldr">
					<img className="acc-av" src={data.img} />
				</div>
				<div className="acc-title-hlder">
					<p className="acc-title"> {data.name} </p>
				</div>
			</div>
		);
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
							<input className="acc-inpt" />
						</div>
					</div>
					<div className="acc-form-prt">
						<div className="frm-single">
							<p className="acc-inpt-heading">
								ALTERNATIVE CURRENCY
							</p>
							<input className="acc-inpt" />
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
							></textarea>
							<p className="org-subheading">
								Not more than 500 words.
							</p>
						</div>
					</div>
					<div className="acc-form-prt frm-btn-hldr">
						<button className="acc-frm-btn">Save</button>
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
export default DetailForm;
