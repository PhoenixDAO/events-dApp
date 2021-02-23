import React from 'react';
import makeBlockie from 'ethereum-blockies-base64';

function NotifyReport(props) {
	return (
		<div className="notify">
			<p>👎 {props.text}</p>
		</div>
	);
}

export default NotifyReport;