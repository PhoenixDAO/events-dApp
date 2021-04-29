import React from 'react';
import makeBlockie from 'ethereum-blockies-base64';
import { explorerWithTX } from "../config/const";

function NotifySending(props) {
	return (
		<div className="notify">
			<a href={explorerWithTX + props.hash} title={props.hash} target="blank">
				<img src={makeBlockie(props.hash)} alt={props.hash} />
			</a>
			<a href={explorerWithTX + props.hash} title={props.hash} target = "blank">Transaction sent!</a> <span role="img" aria-labelledby="rocket">🚀 {props.tx}</span>
			<p> Sending your ticket...</p>
		</div>
	);
}

export default NotifySending;
