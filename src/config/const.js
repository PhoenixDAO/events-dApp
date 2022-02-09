//Ethereum Mainnet

// export const INFURA_URL="https://mainnet.infura.io/v3/c89f216154d84b83bb9344a7d0a91108"
// export const INFURA_WEB_URL="wss://mainnet.infura.io/ws/v3/c89f216154d84b83bb9344a7d0a91108"
// export const GLOBAL_NETWORK_ID=1;
// export const explorerWithTX="https://etherscan.io/tx/"
// export const explorerWithAddress ="https://etherscan.io/address/"

//Matic Mainnet

// export const INFURA_URL="https://rpc-mainnet.maticvigil.com"
// export const INFURA_WEB_URL="wss://rpc-mainnet.matic.quiknode.pro"
// export const GLOBAL_NETWORK_ID=137;
// export const API_URL = "https://phoenix-event-dapp-backend.herokuapp.com/"
// export const REPORT_EVENT = "event/report";
// export const GET_USER_DETAIL ="user/details";
// export const REMOVE_FROM_FAVOURITES = "user/removeFromFavourites";
// export const ADD_TO_FAVOURITES ="user/addToFavourites";
// export const UPDATE_EVENT_VIEWS = "user/updateViews";
// export const explorerWithTX="https://explorer-mainnet.maticvigil.com/tx/"
// export const explorerWithAddress ="https://explorer-mainnet.maticvigil.com/address/"
// export const graphURL="https://api.thegraph.com/subgraphs/name/mudassir45/events-dapp"
// export const INFURA_URL_2 =
// 	"https://goerli.infura.io/v3/388c2e54484b4d90a0a54aa9238f1db7";
// export const INFURA_WEB_URL_2 =
// 	"wss://goerli.infura.io/ws/v3/388c2e54484b4d90a0a54aa9238f1db7";
//Matic Test

// export const INFURA_URL="https://rpc-mumbai.matic.today" //
// export const INFURA_WEB_URL="wss://ws-mumbai.matic.today/"

// export const GLOBAL_NETWORK_ID=80001;
// export const API_URL = "https://phoenix-event-dapp-backend-tst.herokuapp.com/"
// export const REPORT_EVENT = "event/report";
// export const GET_USER_DETAIL ="user/details";
// export const REMOVE_FROM_FAVOURITES = "user/removeFromFavourites";
// export const ADD_TO_FAVOURITES ="user/addToFavourites";
// export const UPDATE_EVENT_VIEWS = "user/updateViews";
// export const explorerWithTX="https://explorer-mumbai.maticvigil.com/tx/"
// export const explorerWithAddress ="https://explorer-mumbai.maticvigil.com/address/"
// export const graphURL="https://api.thegraph.com/subgraphs/name/mudassir45/events-dapp2"

import PhnxPriceLogo from "../components/Images/phnxPriceLogo.svg";
// import SolanaPriceLogo from "../components/Images/solanaPriceLogo.svg";
import EthPriceLogo from "../components/Images/ethPriceLogo.svg";
import MaticPriceLogo from "../components/Images/maticPriceLogo.svg";
import TetherPriceLogo from "../components/Images/tetherPriceLogo.svg";
import WethPriceLogo from "../components/Images/WethLogo.png";
import UsdcPriceLogo from "../components/Images/usdcLogo.webp";

import { WethAbi_Testnet } from "../services/tokenABIs/WethAbi";
import { UsdcAbi_Testnet } from "../services/tokenABIs/UsdcAbi";
import { UsdtAbi_Testnet } from "../services/tokenABIs/UsdtAbi";
import { MaticAbi_testnet } from "../services/tokenABIs/MaticAbi";
import { PhnxAbi_Testnet } from "../services/tokenABIs/PhnxAbi";

export const PhnxPriceApiCoingecko = `https://api.coingecko.com/api/v3/simple/price?ids=phoenixdao&vs_currencies=usd&include_market_cap=true&include_24hr_change=ture&include_last_updated_at=ture`;
export const EthPriceApiCoingecko = `https://api.coingecko.com/api/v3/simple/price?ids=Ethereum&vs_currencies=usd&include_market_cap=true&include_24hr_change=ture&include_last_updated_at=ture`;
export const MaticPriceApiCoingecko = `https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=usd&include_market_cap=true&include_24hr_change=ture&include_last_updated_at=ture`;
export const UsdtPriceApiCoingecko = `https://api.coingecko.com/api/v3/simple/price?ids=Tether&vs_currencies=usd&include_market_cap=true&include_24hr_change=ture&include_last_updated_at=ture`;
export const UsdcPriceApiCoingecko = `https://api.coingecko.com/api/v3/simple/price?ids=usd-coin&vs_currencies=usd&include_market_cap=true&include_24hr_change=ture&include_last_updated_at=ture`;
export const WethtPriceApiCoingecko = `https://api.coingecko.com/api/v3/simple/price?ids=weth&vs_currencies=usd&include_market_cap=true&include_24hr_change=ture&include_last_updated_at=ture`;

export const TokensListRinkbey = [
	{
		address: "0x521855AA99a80Cb467A12b1881f05CF9440c7023",
		abi: PhnxAbi_Testnet,
	},
	{
		address: "0xe6b8a5cf854791412c1f6efc7caf629f5df1c747",
		abi: MaticAbi_testnet,
	},
	{
		address: "0x0cEbA92298b655C827D224D33461B4A1F9C418a6",
		abi: UsdtAbi_Testnet,
	},
	{
		address: "0xeb8f08a975Ab53E34D8a0330E0D34de942C95926",
		abi: UsdcAbi_Testnet,
	},
	{
		address: "0xc778417E063141139Fce010982780140Aa0cD5Ab",
		abi: WethAbi_Testnet,
	},
];

export const RinkbeyNetworkArray = [
	{
		chainName: "Polygon",
		chainId: 137,
		networks: [
			{
				tokenName: "phnx",
				chainId: 137,
				image: PhnxPriceLogo,
				tokenAddress: "0x521855AA99a80Cb467A12b1881f05CF9440c7023",
			},
			{
				tokenName: "matic",
				chainId: 137,
				image: MaticPriceLogo,
				tokenAddress: "",
			},
			{
				tokenName: "usdt",
				chainId: 137,
				image: TetherPriceLogo,
				tokenAddress: "0x0cEbA92298b655C827D224D33461B4A1F9C418a6",
			},
			{
				tokenName: "usdc",
				chainId: 137,
				image: UsdcPriceLogo,
				tokenAddress: "0xeb8f08a975Ab53E34D8a0330E0D34de942C95926",
			},
			{
				tokenName: "weth",
				chainId: 137,
				image: WethPriceLogo,
				tokenAddress: "0xc778417E063141139Fce010982780140Aa0cD5Ab",
			},
		],
	},
	{
		chainName: "ethereum",
		chainId: 1,
		networks: [
			{
				tokenName: "phnx",
				chainId: 1,
				image: PhnxPriceLogo,
				tokenAddress: "0x521855AA99a80Cb467A12b1881f05CF9440c7023",
			},
			{
				tokenName: "ether",
				chainId: 1,
				image: EthPriceLogo,
				tokenAddress: "0xc778417E063141139Fce010982780140Aa0cD5Ab",
			},
			{
				tokenName: "usdt",
				chainId: 1,
				image: TetherPriceLogo,
				tokenAddress: "0x0cEbA92298b655C827D224D33461B4A1F9C418a6",
			},
			{
				tokenName: "usdc",
				chainId: 1,
				image: UsdcPriceLogo,
				tokenAddress: "0xeb8f08a975Ab53E34D8a0330E0D34de942C95926",
			},
			{
				tokenName: "weth",
				chainId: 1,
				image: WethPriceLogo,
				tokenAddress: "0xc778417E063141139Fce010982780140Aa0cD5Ab",
			},
		],
	},
];
// {
// 	tokenName: "tusdt",
// 	chainId: 137,
// 	image: TetherPriceLogo,
// 	tokenAddress: "0xd92e713d051c37ebb2561803a3b5fbabc4962431",
// },

export const MainNetworkArray = [
	{
		chainName: "Polygon",
		chainId: 137,
		networks: [
			{ tokenName: "phnx", chainId: 137, image: PhnxPriceLogo },
			{ tokenName: "matic", chainId: 137, image: MaticPriceLogo },
			{ tokenName: "usdt", chainId: 137, image: TetherPriceLogo },
		],
	},
	{
		chainName: "ethereum",
		chainId: 1,
		networks: [
			{ tokenName: "phnx", chainId: 1, image: PhnxPriceLogo },
			{ tokenName: "ether", chainId: 1, image: EthPriceLogo },
			{ tokenName: "usdt", chainId: 1, image: TetherPriceLogo },
		],
	},
];

//Rinkeby
export const INFURA_URL =
	"https://rinkeby.infura.io/v3/388c2e54484b4d90a0a54aa9238f1db7";
export const INFURA_WEB_URL =
	"wss://rinkeby.infura.io/ws/v3/388c2e54484b4d90a0a54aa9238f1db7";
// export const graphURLV1 =
// 	"https://api.thegraph.com/subgraphs/name/hakeemullahjan/eventcheck";
// previous rinkeby contract graph api address without isphnx field
// export const graphURLV1 =
// 	"https://api.thegraph.com/subgraphs/name/musfirazia/eventsdapp";
export const graphURLV1 =
	"https://api.thegraph.com/subgraphs/name/ijlal-ishaq/phnx-app";
// export const graphURLV1 =
// 	"https://api.thegraph.com/subgraphs/name/zainhasan97-razi/eventsgraph2";

// Ethereum mainnet
// export const INFURA_URL =
// 	"https://mainnet.infura.io/v3/3c62e62341b34568a512b8917a59ad63";
// export const INFURA_WEB_URL =
// 	"wss://mainnet.infura.io/ws/v3/3c62e62341b34568a512b8917a59ad63";
// export const graphURLV1 =
// 	"https://api.thegraph.com/subgraphs/name/musfirazia/event-subgraph";

//Matic Mainnet

export const INFURA_URL_2 =
	"https://speedy-nodes-nyc.moralis.io/27dcd9d4dd0ceef1ad3788eb/polygon/mainnet";
export const INFURA_WEB_URL_2 =
	"wss://speedy-nodes-nyc.moralis.io/27dcd9d4dd0ceef1ad3788eb/polygon/mainnet/ws";
// export const graphURLV2 =
// 	"https://api.thegraph.com/subgraphs/name/musfirazia/event-subgraphv2";

// export const graphURLV2 =
// 	"https://api.thegraph.com/subgraphs/name/zainhasan97-razi/eventssubgraph";

export const graphURLV2 =
	"https://api.thegraph.com/subgraphs/name/ijlal-ishaq/phnx-app-matic";

export const GLOBAL_NETWORK_ID = 4;
export const GLOBAL_NETWORK_ID_2 = 137;

// export const API_URL = "https://events.server.pehchan.me/";
export const API_URL = "https://events-api.phoenixdao.io/";
//"https://phoenix-event-dapp-backend-tst.herokuapp.com/";
// export const API_URL = "http://localhost:5000/";

export const REPORT_EVENT = "event/report";
export const GET_USER_DETAIL = "user/details";
export const GET_USER_EXIST_DETAIL = "user/detailsExist";
export const UPDATE_USER_DETAIL = "user/updateDetails";
export const REMOVE_FROM_FAVOURITES = "user/removeFromFavourites";
export const ADD_TO_FAVOURITES = "user/addToFavourites";
export const UPDATE_EVENT_VIEWS = "user/updateViews";
export const GET_MESSAGE = "user/getMessage";
export const LOGIN_METAMASK = "user/loginUserWithMetamask";
export const TWEET = "user/tweet";
export const explorerWithTX = "https://explorer-mainnet.maticvigil.com/tx/";
export const etherscanRinkbyTX = "https://rinkeby.etherscan.io/tx/";
export const etherscanMainnetTX = "https://etherscan.io/tx/";
export const etherscanRinkbyAddress = "https://rinkeby.etherscan.io/address/";
export const etherscanMainnetAddress = "https://etherscan.io/address/";

export const explorerWithAddress =
	"https://explorer-mainnet.maticvigil.com/address/";
// export const explorerWithTX = "https://rinkeby.etherscan.io/tx/";
// export const explorerWithAddress = "https://rinkeby.etherscan.io/address/";
// export const graphURL =
// 	"https://api.thegraph.com/subgraphs/name/nashaibakbar/eventcheck";
//for rinkeby

// //for goerli
// export const graphURLV2 =
// 	"https://api.thegraph.com/subgraphs/name/hakeemullahjan/eventcheck";

export const transakApi = process.env.REACT_APP_TRANSAK_API;
