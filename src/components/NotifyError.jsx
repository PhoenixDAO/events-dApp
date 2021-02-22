import React from 'react';
import makeBlockie from 'ethereum-blockies-base64';
import { Link } from 'react-router-dom';

function NotifyError(props) {
	console.log("props in notifyerror",props)
	return (
		<div className="notify">			
            <p className="emoji2"><span role="img" aria-label="sweat">😓</span></p>
			<p>Transaction {props.error &&props.error.code==4001? "Rejected": "failed"}, Please try again.</p>
		</div>
	);
}

export default NotifyError;