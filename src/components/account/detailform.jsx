import React from "react";
import "./detailform.css";
import CreateOutlinedIcon from "@material-ui/icons/CreateOutlined";
const DetailForm = () => {
	return (
		<div className="dtl-hldr">
			<div className="acc-basic-info">
				<div className="acc-av-hldr">
					<img className="acc-av" src="/images/metamask.svg" />
				</div>
				<div className="acc-title-hlder">
					<p className="acc-title"> Bennu </p>
					<CreateOutlinedIcon style={{ color: "blueviolet", width:"20px" }}  />
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
		</div>
	);
};
export default DetailForm;
