import React from 'react';
import makeBlockie from 'ethereum-blockies-base64';
import { Link } from 'react-router-dom';
import { explorerWithTX, explorerWithAddress } from "../config/const";


function NotifySuccessFaucet(props) {
	return (
		<div className="notify">
			<a href={explorerWithTX + props.hash} title={props.hash} target = "blank">
				<img src={makeBlockie(props.hash)} alt={props.hash} />
			</a>
			<a href={explorerWithTX + props.hash} title={props.hash} target = "blank">10,000 PHNX recieved!</a> 
            <Link to={"/token/" }><p> Check your balance here.</p></Link>
		</div>
	);
}

export default NotifySuccessFaucet;
