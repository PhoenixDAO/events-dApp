
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Error extends Component {
	constructor(props) {
		super(props);
	}
createNewEvent=()=>{
	this.props.createNewEvent()
	this.props.createNewEvent2()
}
render(){
	return (
		<div className="mt-5 text-center">
			<h3 className="mt-5">Ooops, we have an error!</h3>
            <p className="emoji2"><span role="img" aria-label="sweat">😓</span></p>
			<p>Something went wrong!</p> <Link
											to={{
												pathname: "/editevent",
												state: this.props
												
											}} ><button
											className="btn btn-dark"
									
										>
											try Again
										
										</button></Link>
			<code>{this.props.message}</code>
		</div>
	);
}
}
export default Error;
