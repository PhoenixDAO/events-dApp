import React from "react";
import Header from "../common/Header";
import DetailForm from "./detailform";
const AccountDetail = (props) => {
	return (
		<div>
			<Header
				title="Account Details"
				page="accountdetails"
				phnxButton="true"
			/>
			<DetailForm account={props.account} />
		</div>
	);
};
export default AccountDetail;
