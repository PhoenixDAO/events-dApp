import React, { Component } from 'react';
import { drizzleConnect } from 'drizzle-react';
import PropTypes from 'prop-types';

import ipfs from '../../utils/ipfs';

import Form from './Form';
import Loader from './Loader';
import Error from './Error';
import Done from './Done';
//import { Redirect } from 'react-router-dom';

class CreateEvent extends Component {
	constructor(props, context) {
		super(props);

		this.state = {
			done: false,
			upload: false,
			stage: 0,
			title: null,
			error: false,
			error_text: null,
			ipfs: null,
			fileImg: null,
			data: {
				name: null,
				description: null,
				time: 0,
				currency: null,
				price: 0,
				organizer: null,
				limited: false,
				seats: 0,
				type:null,
				
			}
		};

		this.contracts = context.drizzle.contracts;
	}

	
	createEvent = (name, description, location, time, file, organizer, type, topic, currency, price, limited, seats) => {

		this.setState({
			upload: true,
			redirect:false,
			stage: 25,
			title: 'Uploading event image...',
			data: {
				name: name,
				description: description,
				time: time,
				currency: currency,
				price: this.context.drizzle.web3.utils.toWei(price),
				organizer: organizer,
				limited: limited,
				seats: seats === '' ? 0 : parseInt(seats, 10),
				type: type,
				location:location
			}
		}, () => {
			this.stageUpdater(90);
			this.readFile(file);
		});
	}

	readFile = (file) => {
		let reader = new window.FileReader();
		console.log(file);
		reader.readAsDataURL(file);
		reader.onloadend = () => this.convertAndUpload(reader);
	}

    convertAndUpload = (reader) => {
		let pinit = process.env.NODE_ENV === 'production';

		let data = JSON.stringify({
			image: reader.result,
			text: this.state.data.description,
			location:this.state.data.location
		});

		let buffer = Buffer.from(data);

		ipfs.add(buffer, {pin: pinit}).then((hash) => {
			this.setState({
				stage: 95,
				title: 'Creating transaction...',
				ipfs: hash[0].hash
			});
			this.uploadTransaction();
		}).catch((error) => {
			this.setState({
				error: true,
				error_text: 'IPFS Error'
			});
		});
	};

	uploadTransaction = () => {
		let id = this.contracts['OpenEvents'].methods.createEvent.cacheSend(
			this.state.data.name,
			this.state.data.time,
			this.state.data.price,
			this.state.data.currency === 'eth' ? false : true,
			this.state.data.limited,
			this.state.data.seats,
			this.state.ipfs,
			this.state.data.type
		);

		this.transactionChecker(id)
		//this.setRedirect();
	}

	/*setRedirect=()=>{
		this.setState({
			redirect: true
		  })
		if(this.state.redirect){
			return <Redirect to='/'/>
		}
	}*/

	transactionChecker = (id) => {
		let tx_checker = setInterval(() => {
			let tx = this.props.transactionStack[id];
			if (typeof tx !== 'undefined') {
				this.setState({
					upload: false,
					done: true
				});
				clearInterval(tx_checker);
			}
		}, 100);
	}

	stageUpdater = (max) => {
		let updater = setInterval(() => {
			if (this.state.stage < max) {
				this.setState({
					stage: this.state.stage + 1
				});
			} else {
				clearInterval(updater);
			}
		}, 500);
	}


	render() {
		
		if (this.state.error) {
			return <Error message={this.state.error_text} />;
		}

		if (this.state.done) {
			return <Done/>
			;
		}

		let body =
			this.state.upload ?
				<Loader progress={this.state.stage} text={this.state.title} /> :
				<React.Fragment>
					<div className="row">
							<Form createEvent={this.createEvent} />
					</div>
				</React.Fragment>
		;

		return (
			<div>
				
				<h2><i className="fa fa-edit"></i> Create Event</h2>
				<hr />
				{body}
			</div>
		);
	}
}

CreateEvent.contextTypes = {
    drizzle: PropTypes.object
}

const mapStateToProps = state => {
    return {
		contracts: state.contracts,
		transactionStack: state.transactionStack
    };
};

const AppContainer = drizzleConnect(CreateEvent, mapStateToProps);
export default AppContainer;
