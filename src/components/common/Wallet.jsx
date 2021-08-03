import React from "react";
import roundlogo from "../Images/roundlogo.svg";
import Web3 from "web3";

const Wallet = () => {
	const openMetaMask = async () => {
		if (window.ethereum && window.ethereum.isMetaMask) {
			let web3 = new Web3(window.ethereum);
			try {
				const a = await window.ethereum.enable();
			} catch (e) {
				if ((e.code = -32002)) {
					console.log(
						"Connection request already pending. Please check MetaMask !"
					);
				}
			}
		} else {
			console.log(
				"MetaMask is not installed. Please install MetaMask to continue !"
			);
		}
	};
	const walletManager = [
		{
			img: "/images/metawallet.svg",
			name: "Metamask",
			coming: false,
			onclick: true,
		},
		{
			img: "/images/ledgerwallet.svg",
			name: "Ledger",
			coming: true,
			onclick: false,
		},
		{
			img: "/images/connectwallet.svg",
			name: "Wallet Connect",
			coming: true,
			onclick: false,
		},
		{
			img: "/images/coinbasewallet.svg",
			name: "Coinbase Wallet",
			coming: true,
			onclick: false,
		},
	].map((data) => {
		return (
			<div className="wallets-single">
				<div className="wallets-first">
					<div className="wallets-img-hldr">
						<img className="wallets-img" src={data.img} />
					</div>
					<div className="wallets-name-hldr">
						<span className="wallets-name">{data.name}</span>
					</div>
				</div>
				<div className="wallets-second">
					{data.coming ? (
						<div className="coming-hldr"> COMING SOON</div>
					) : (
						<div
							className="right-arrow-img-hldr"
							onClick={data.onclick ? openMetaMask : null}
						>
							<img
								className="right-arrow-img"
								src="/images/arrowright.svg"
							/>
						</div>
					)}
				</div>
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
			<div>
				<p className="wallets-footer">
					By connecting, I accept PhoenixDAO’s{" "}
					<span style={{ color: "#413AE2" }}>Terms of service</span>{" "}
				</p>
			</div>
		</div>
	);
};

export default Wallet;
