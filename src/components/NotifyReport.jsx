import React from 'react';

function NotifyReport(props) {
	return (
		<div className="notify">
			<p>👎 {props.text}</p>
		</div>
	);
}

export default NotifyReport;