import React, { Component } from 'react';

class Done extends Component {

createNewEvent=()=>{
	this.props.createNewEvent()
	this.props.createNewEvent2()
}
componentWillUnmount=()=>{
	this.props.createNewEvent()
	this.props.createNewEvent2()
}

componentDidMount() {
	window.scroll({
		top: 0,
		behavior: "smooth",
	});
}
render(){
	return (
		<div className="mt-5 text-center">
			<h3 className="mt-5">Done, your event has been updated!</h3>
			<p className="emoji"><span role="img" aria-label="sunglasses">😎🎸</span></p>
			<p>We will notify you as soon as the transaction has been confirmed. It will be available for users shortly.</p>
			
		
		</div>
	);
}
}
export default Done;
