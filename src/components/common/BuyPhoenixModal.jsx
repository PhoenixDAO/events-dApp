import React, { useEffect, useState } from "react";
import roundlogo from "../Images/roundlogo.svg";
import transakSDK from "@transak/transak-sdk";

const settings = {
	apiKey: "e594e508-7690-4b13-bba0-4a79fc3353c8", // Your API Key
	environment: "STAGING", // STAGING/PRODUCTION
	defaultCryptoCurrency: "ETH",
	themeColor: "000000", // App theme color
	hostURL: window.location.origin,
	widgetHeight: "650px",
	widgetWidth: "500px",
};

const BuyPhoenixModal = (props) => {
	const [error, setError] = useState("");
	const transak = new transakSDK(settings);

	useEffect(() => {
		transak.on(transak.EVENTS.TRANSAK_WIDGET_CLOSE, (orderData) => {
			console.log("closed successfully widged")
            props.closeTransak()
		});
	}, []);

	const openTransak = () => {
		transak.init();
		props.handleClose();
		props.openTransak();
	};

	const buyPhnxManager = [
		{
			img: "/images/metawallet.svg",
			name: "Transact",
			coming: false,
			onclick: true,
		},
		{
			img: "/images/ledgerwallet.svg",
			name: "Quickswap",
			coming: true,
			onclick: false,
		},
		{
			img: "/images/connectwallet.svg",
			name: "Uniswap",
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
							onClick={data.onclick ? openTransak : null}
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
				<p className="wallets-subheading">Buy PHNX</p>
			</div>
			<div className="wallet-main-hldr">{buyPhnxManager}</div>
			<div>
				<p className="wallets-footer">
					By connecting, I accept PhoenixDAO’s{" "}
					<span style={{ color: "#413AE2" }}>Terms of service</span>{" "}
				</p>
			</div>
		</div>
	);
};

export default BuyPhoenixModal;
