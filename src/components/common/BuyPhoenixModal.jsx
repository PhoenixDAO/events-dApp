import React, { useEffect, useState } from "react";
import roundlogo from "../Images/roundlogo.svg";
import transakSDK from "@transak/transak-sdk";
import { transakApi } from "../../config/const";
import { Link } from "react-router-dom";

const BuyPhoenixModal = (props) => {
	const [error, setError] = useState("");
	const settings = {
		apiKey: transakApi, // Your API Key
		environment: "PRODUCTION", // STAGING/PRODUCTION
		defaultCryptoCurrency: "ETH",
		walletAddress: props.accounts[0],
		themeColor: "000000", // App theme color
		hostURL: window.location.origin,
		widgetHeight: "642px",
		widgetWidth: "500px",
		networks: "ethereum,polygon",
	};
	const transak = new transakSDK(settings);

	useEffect(() => {
		console.log("setttings", props.accounts[0]);
		transak.on(transak.EVENTS.TRANSAK_WIDGET_CLOSE, (orderData) => {
			console.log("closed successfully widged");
			props.closeTransak();
		});
	}, []);

	const openTransak = () => {
		transak.init();
		props.handleClose();
		props.openTransak();
	};

	const buyPhnxManager = [
		{
			img: "/images/transak.svg",
			name: "Transak",
			coming: false,
			onclick: true,
		},
		{
			img: "/images/QuickSwap.svg",
			name: "Quickswap",
			coming: true,
			onclick: false,
		},
		{
			img: "/images/Uniswap.svg",
			name: "Uniswap",
			coming: true,
			onclick: false,
		},
		{
			img: "/images/coinbase.svg",
			name: "Coinbase Wallet",
			coming: true,
			onclick: false,
		},
	].map((data) => {
		return (
			<div
				className="wallets-single"
				onClick={data.onclick ? openTransak : null}
				style={data.onclick ? { cursor: "pointer" } : null}
			>
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
						<div className="right-arrow-img-hldr">
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
				<p className="wallets-subheading">Buy PHNX</p>
			</div>
			<div className="wallet-main-hldr">{buyPhnxManager}</div>
			<div>
				<p className="wallets-footer">
					By connecting, I accept PhoenixDAO’s{" "}
					<Link to="/terms-and-conditions">
						<span style={{ color: "#413AE2" }}>
							Terms of service
						</span>{" "}
					</Link>
				</p>
			</div>
		</div>
	);
};

export default BuyPhoenixModal;
