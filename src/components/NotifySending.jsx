import React from 'react';
import makeBlockie from 'ethereum-blockies-base64';

function NotifySending(props) {
	return (
		<div className="notify">
			<a href={"https://etherscan.io/tx/" + props.hash} title={props.hash} target="blank">
				<img src={makeBlockie(props.hash)} alt={props.hash} />
			</a>
			<a href={"https://etherscan.io/tx/" + props.hash} title={props.hash} target = "blank">Transaction sent!</a> <span role="img" aria-labelledby="rocket">🚀 {props.tx}</span>
			<p> Sending your ticket...</p>
		</div>
	);
}

export default NotifySending;
