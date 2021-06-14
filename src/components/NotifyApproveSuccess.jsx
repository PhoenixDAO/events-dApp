import React from 'react';
import makeBlockie from 'ethereum-blockies-base64';
import { explorerWithTX, explorerWithAddress } from "../config/const";

function NotifyApproveSuccess(props) {
	return (
		<div className="notify">
			<a href={explorerWithTX + props.hash} title={props.hash} target = "blank">
				<img src={makeBlockie(props.hash)} alt={props.hash} />
			</a>
			<a href={explorerWithTX + props.hash} title={props.hash} target = "blank">Transaction successful!</a>
            <p> You can buy a ticket now.</p>
		</div>
	);
}

export default NotifyApproveSuccess;