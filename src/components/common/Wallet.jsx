import React from "react";
import roundlogo from "../Images/roundlogo.svg";

const Wallet = () => {
	const walletManager = [
		{
			img: "/images/metawallet.svg",
			name: "Metamask"
		}
	].map((data) => {
		return (
			<div className="wallets-single">
				<img className="wallets-img" src={data} />
				<hr />
			</div>
		);
	});
	return (
		<div className="">
			<div className="wallets-head">
				<div>
					<img
						style={{ height: "24px" }}
						src={roundlogo}
						alt="phnx logo"
					/>
				</div>
				<div>
					<p className="wallets-heading">PhoenixDAO</p>
				</div>
			</div>
			<div>
				<p className="wallets-subheading">Connect to Ethereum Wallet</p>
			</div>
			<div className="wallet-main-hldr">{walletManager}</div>
		</div>
	);
};

export default Wallet;
