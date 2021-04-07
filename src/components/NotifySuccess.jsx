import React from 'react';
import makeBlockie from 'ethereum-blockies-base64';
import { Link } from 'react-router-dom';
import { explorerWithTX, explorerWithAddress } from "../config/const";

function NotifySuccess(props) {
	return (
		<div className="notify">
			<a href={explorerWithTX + props.hash} title={props.hash} target = "blank">
				<img src={makeBlockie(props.hash)} alt={props.hash} />
			</a>
			<a href={explorerWithTX + props.hash} title={props.hash} target = "blank">Ticket purchase successful!</a> 
            <Link to={"/mytickets/1" }><p> Check out your TICKET here</p></Link>
		</div>
	);
}

export default NotifySuccess;