import React from 'react';
import makeBlockie from 'ethereum-blockies-base64';
// import { Link } from 'react-router-dom';
import { explorerWithTX, explorerWithAddress } from "../config/const";

function NotifySuccessSending(props) {
	return (
		<div className="notify">
			<a href={explorerWithTX+ props.hash} title={props.hash} target = "blank">
				<img src={makeBlockie(props.hash)} alt={props.hash} />
			</a>
			<a href={explorerWithTX + props.hash} title={props.hash} target = "blank">Ticket successfully sent!</a> 
            <a href={explorerWithTX + props.hash} title={props.hash} target = "blank"><p> Check out your transaction here</p></a> 

		</div>
	);
}

export default NotifySuccessSending;