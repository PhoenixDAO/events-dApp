import React from "react";
import Header from "../common/Header";
import DetailForm from "./detailform";
const AccountDetail = (props) => {
	const goBack = () => {
		props.history.goBack();
	};
	return (
		<div>
			<Header
				title="Account Details"
				page="accountdetails"
				phnxButton="true"
				goBack={goBack}
			/>
			<DetailForm
				account={props.account}
				userDetails={props.userDetails}
				setUserDetails={props.setUserDetails}
				history={props.history}
			/>
		</div>
	);
};
export default AccountDetail;
