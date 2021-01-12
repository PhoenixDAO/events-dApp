import React, { Component } from 'react';

class Home extends Component {
	render() {
		return (
			<div className="home-wrapper">
				<h2>Welcome to the PhoenixDAO Events Marketplace.</h2>
				<hr />
				<p>The PhoenixDAO Events Marketplace is a dApp that allows people to create events and sell tickets online, with the option to make an event, paid or free.</p>
				<p>The tickets created on this service are ERC721 tokens, which means that users are able to move, gift, or sell those tickets to other users.</p>
				<p>The PhoenixDAO Events Marketplace is a dApp powered by the Ethereum blockchain. In order to create events or purchase tickets, you are required have an Ethereum wallet. If you do not have one currently, you can use {typeof InstallTrigger !== 'undefined'? <a target="_blank" style={{textAlign:"center"}} href="https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/"> [LINK]</a> : <a target="_blank" style={{textAlign:"center"}} href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn"> MetaMask</a>}.</p>
			</div>
		);
	}

	componentDidMount() {
		this.props.executeScroll();
	}
}
export default Home;
