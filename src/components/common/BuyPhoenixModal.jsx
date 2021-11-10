import React, { useEffect, useState } from "react";
import roundlogo from "../Images/roundlogo.svg";
import transakSDK from "@transak/transak-sdk";
import { GLOBAL_NETWORK_ID, transakApi } from "../../config/const";
import { Link } from "react-router-dom";
import UniswapModal from "../UniswapModal";
import { setActiveLink } from "react-scroll/modules/mixins/scroller";

const BuyPhoenixModal = (props) => {
	const settings = {
		apiKey: transakApi, // Your API Key
		environment: "PRODUCTION", // STAGING/PRODUCTION
		defaultCryptoCurrency: "ETH",
		walletAddress: props.accounts[0],
		themeColor: "000000", // App theme color
		hostURL: window.location.origin,
		widgetHeight: "642px",
		widgetWidth: "500px",
		networks:props.chain,
		//  network: chainId,
	};
	const transak = new transakSDK(settings);
	const [openUni, setOpenUniswap] = useState(false);
	const [link, setLink] = useState("");

	useEffect(() => {
		transak.on(transak.EVENTS.TRANSAK_WIDGET_CLOSE, (orderData) => {
			props.closeTransak();
		});
	}, []);

	const openTransak = async () => {
		transak.init();
		props.handleClose();
		props.openTransak();
	};
	
	const UniswaphandleClose = () => {
		setOpenUniswap(false);

		};
	const openUniswap =  () =>{
		setOpenUniswap(true);
		props.handleClose();
		setLink("https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0x38a2fdc11f526ddd5a607c1f251c065f40fbf2f7");


	}
	const openquickswap =  () =>{
		setOpenUniswap(true);
		setLink("https://quickswap.exchange/#/swap?outputCurrency=0x92c59f1cc9a322670cca29594e4d994d48bdfd36");
		props.handleClose();

	}
	const buyPhnxManager = [
		{
			img: "/images/transak.svg",
			name: "Transak",
			coming: false,
			transak: true,
		},
		{
			img: "/images/QuickSwap.svg",
			name: "Quickswap",
			coming: true,
			onclick: true,
			quickswap:true,
			link:"https://quickswap.exchange/#/swap?outputCurrency=0x92c59f1cc9a322670cca29594e4d994d48bdfd36"
		},
		{
			img: "/images/Uniswap.svg",
			name: "Uniswap",
			coming: true,
			uniswap: true,
			onclick:true
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
				onClick={data.uniswap? openUniswap: data.quickswap? openquickswap: null}
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
				<UniswapModal
					open={openUni}
					handleClose={UniswaphandleClose}
					link={link}
				/>
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
