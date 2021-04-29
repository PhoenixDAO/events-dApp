import React from 'react';
import makeBlockie from 'ethereum-blockies-base64';
import { explorerWithTX } from "../config/const";

function NotifyFaucet(props) {
	return (
		<div className="notify">
			<a href={explorerWithTX + props.hash} title={props.hash} target="blank">
				<img src={makeBlockie(props.hash)} alt={props.hash} />
			</a>
			<a href={explorerWithTX + props.hash} title={props.hash} target = "blank">Request for 10,000 PHNX</a> <span role="img" aria-labelledby="rocket">🚀 {props.tx}</span>
            <p className="mt-1">Your token request has been sent</p>
		</div>
	);
}

export default NotifyFaucet;
