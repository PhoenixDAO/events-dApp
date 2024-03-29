/*-------------------------------------------------------------------------------------------------*/

// MATIC MAINNET

// export const Open_events_Address = '0x95c8185eA36B70fB386492Fc48f6fd6186Db881A';

/*-------------------------------------------------------------------------------------------------*/

// RINKEBY TESTNET
// export const Open_events_Address = "0xa8b9A1dA93B4a96d9D0a464f6897A9A7D20c9874";


//Ethereum mainnet
export const Open_events_Address = "0xf48E0D934B505C80b6dD3ef4d178D7c8fB83f566";


export const Open_events_ABI =[{"inputs":[{"internalType":"address","name":"_token","type":"address"},{"internalType":"address","name":"_oracle","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":false,"internalType":"uint256","name":"eventId","type":"uint256"},{"components":[{"internalType":"bool","name":"oneTimeBuy","type":"bool"},{"internalType":"bool","name":"token","type":"bool"},{"internalType":"bool","name":"onsite","type":"bool"},{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"time","type":"uint256"},{"internalType":"uint256","name":"totalQuantity","type":"uint256"},{"internalType":"uint256","name":"totalQntySold","type":"uint256"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"topic","type":"string"},{"internalType":"string","name":"location","type":"string"},{"internalType":"string","name":"city","type":"string"},{"internalType":"string","name":"ipfsHash","type":"string"},{"internalType":"bool[]","name":"ticketLimited","type":"bool[]"},{"internalType":"uint256[]","name":"tktQnty","type":"uint256[]"},{"internalType":"uint256[]","name":"prices","type":"uint256[]"},{"internalType":"uint256[]","name":"tktQntySold","type":"uint256[]"},{"internalType":"string[]","name":"categories","type":"string[]"}],"indexed":false,"internalType":"struct IDaoEventsV2.Event","name":"","type":"tuple"}],"name":"CreatedEvent","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"components":[{"internalType":"uint256","name":"eventId","type":"uint256"},{"internalType":"uint256","name":"seatNo","type":"uint256"},{"internalType":"string","name":"boughtLocation","type":"string"},{"internalType":"string","name":"eventLocation","type":"string"}],"indexed":false,"internalType":"struct IDaoEventsV2.Ticket","name":"","type":"tuple"}],"name":"SoldTicketDetails1","type":"event"},{"anonymous":false,"inputs":[{"components":[{"internalType":"bool","name":"token","type":"bool"},{"internalType":"uint256","name":"eventId","type":"uint256"},{"internalType":"uint256","name":"seatNo","type":"uint256"},{"internalType":"address","name":"buyer","type":"address"},{"internalType":"uint256","name":"usdtPrice","type":"uint256"},{"internalType":"uint256","name":"phnxPrice","type":"uint256"},{"internalType":"uint256","name":"boughtTime","type":"uint256"},{"internalType":"uint256","name":"totalTktsSold","type":"uint256"},{"internalType":"uint256","name":"categoryTktsSold","type":"uint256"},{"internalType":"string","name":"category","type":"string"}],"indexed":false,"internalType":"struct IDaoEventsV2.SoldTicketStruct","name":"","type":"tuple"},{"indexed":false,"internalType":"address","name":"owner","type":"address"}],"name":"SoldTicketDetails2","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"USDT","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"components":[{"internalType":"uint256","name":"eventId","type":"uint256"},{"internalType":"uint256","name":"categoryIndex","type":"uint256"},{"internalType":"string","name":"boughtLocation","type":"string"}],"internalType":"struct IDaoEventsV2.BuyTicket","name":"_buyTicket","type":"tuple"}],"name":"buyTicket","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_token","type":"address"}],"name":"changeToken","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"internalType":"bool","name":"oneTimeBuy","type":"bool"},{"internalType":"bool","name":"token","type":"bool"},{"internalType":"bool","name":"onsite","type":"bool"},{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"time","type":"uint256"},{"internalType":"uint256","name":"totalQuantity","type":"uint256"},{"internalType":"uint256","name":"totalQntySold","type":"uint256"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"topic","type":"string"},{"internalType":"string","name":"location","type":"string"},{"internalType":"string","name":"city","type":"string"},{"internalType":"string","name":"ipfsHash","type":"string"},{"internalType":"bool[]","name":"ticketLimited","type":"bool[]"},{"internalType":"uint256[]","name":"tktQnty","type":"uint256[]"},{"internalType":"uint256[]","name":"prices","type":"uint256[]"},{"internalType":"uint256[]","name":"tktQntySold","type":"uint256[]"},{"internalType":"string[]","name":"categories","type":"string[]"}],"internalType":"struct IDaoEventsV2.Event","name":"_event","type":"tuple"}],"name":"createEvent","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"eventIds","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"eventRevenue","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"events","outputs":[{"internalType":"bool","name":"oneTimeBuy","type":"bool"},{"internalType":"bool","name":"token","type":"bool"},{"internalType":"bool","name":"onsite","type":"bool"},{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"time","type":"uint256"},{"internalType":"uint256","name":"totalQuantity","type":"uint256"},{"internalType":"uint256","name":"totalQntySold","type":"uint256"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"topic","type":"string"},{"internalType":"string","name":"location","type":"string"},{"internalType":"string","name":"city","type":"string"},{"internalType":"string","name":"ipfsHash","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_owner","type":"address"}],"name":"eventsOf","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_eventId","type":"uint256"}],"name":"getCategories","outputs":[{"internalType":"string[]","name":"","type":"string[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getEventsCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_eventId","type":"uint256"}],"name":"getPrices","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"}],"name":"getTicket","outputs":[{"components":[{"internalType":"uint256","name":"eventId","type":"uint256"},{"internalType":"uint256","name":"seatNo","type":"uint256"},{"internalType":"string","name":"boughtLocation","type":"string"},{"internalType":"string","name":"eventLocation","type":"string"}],"internalType":"struct IDaoEventsV2.Ticket","name":"_ticket","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_eventId","type":"uint256"}],"name":"getTicketLimited","outputs":[{"internalType":"bool[]","name":"","type":"bool[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_eventId","type":"uint256"}],"name":"getTktQnty","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_eventId","type":"uint256"}],"name":"getTktQntySold","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"oracle","outputs":[{"internalType":"contract IOracle","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"ticketIds","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"ticketsOf","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tokenAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}]
/*------------------------------------------------------------------------------------------------- */

//Matic mainnet
export const Open_events_Address_2 =
	"0xA646f4f936D9f23B47d0cD8D860cD5bf3679827b";
/*-------------------------------------------------------------------------------------------------*/

// ETHEREUM MAINNET

// export const Open_events_Address = '0xbdce36d77305cce80bf314279afed10ed7f56128';

/*-------------------------------------------------------------------------------------------------*/

// MATIC TESTNET

// export const Open_events_Address = '0xA3476f4D4fDC64F97170e54557952bD89FD4CA26';
export const Open_events_ABI_OFF = [
	{
		inputs: [
			{ internalType: "address", name: "_token", type: "address" },
			{ internalType: "address", name: "_oracle", type: "address" },
		],
		payable: false,
		stateMutability: "nonpayable",
		type: "constructor",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "owner",
				type: "address",
			},
			{
				indexed: true,
				internalType: "address",
				name: "approved",
				type: "address",
			},
			{
				indexed: true,
				internalType: "uint256",
				name: "tokenId",
				type: "uint256",
			},
		],
		name: "Approval",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "owner",
				type: "address",
			},
			{
				indexed: true,
				internalType: "address",
				name: "operator",
				type: "address",
			},
			{
				indexed: false,
				internalType: "bool",
				name: "approved",
				type: "bool",
			},
		],
		name: "ApprovalForAll",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "owner",
				type: "address",
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "eventId",
				type: "uint256",
			},
			{
				components: [
					{ internalType: "bool", name: "oneTimeBuy", type: "bool" },
					{ internalType: "bool", name: "token", type: "bool" },
					{ internalType: "address", name: "owner", type: "address" },
					{ internalType: "uint256", name: "time", type: "uint256" },
					{
						internalType: "uint256",
						name: "duration",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "totalQuantity",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "totalQntySold",
						type: "uint256",
					},
					{ internalType: "string", name: "name", type: "string" },
					{ internalType: "string", name: "topic", type: "string" },
					{
						internalType: "string",
						name: "location",
						type: "string",
					},
					{
						internalType: "string",
						name: "ipfsHash",
						type: "string",
					},
					{
						internalType: "bool[]",
						name: "ticketLimited",
						type: "bool[]",
					},
					{
						internalType: "uint256[]",
						name: "tktQnty",
						type: "uint256[]",
					},
					{
						internalType: "uint256[]",
						name: "prices",
						type: "uint256[]",
					},
					{
						internalType: "uint256[]",
						name: "tktQntySold",
						type: "uint256[]",
					},
					{
						internalType: "string[]",
						name: "categories",
						type: "string[]",
					},
				],
				indexed: false,
				internalType: "struct IDaoEventsV2.Event",
				name: "",
				type: "tuple",
			},
		],
		name: "CreatedEvent",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "previousOwner",
				type: "address",
			},
			{
				indexed: true,
				internalType: "address",
				name: "newOwner",
				type: "address",
			},
		],
		name: "OwnershipTransferred",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				components: [
					{
						internalType: "uint256",
						name: "eventId",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "seatNo",
						type: "uint256",
					},
					{
						internalType: "string",
						name: "boughtLocation",
						type: "string",
					},
					{
						internalType: "string",
						name: "eventLocation",
						type: "string",
					},
				],
				indexed: false,
				internalType: "struct IDaoEventsV2.Ticket",
				name: "",
				type: "tuple",
			},
		],
		name: "SoldTicketDetails1",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				components: [
					{ internalType: "bool", name: "token", type: "bool" },
					{
						internalType: "uint256",
						name: "eventId",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "seatNo",
						type: "uint256",
					},
					{ internalType: "address", name: "buyer", type: "address" },
					{
						internalType: "uint256",
						name: "usdtPrice",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "phnxPrice",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "boughtTime",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "totalTktsSold",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "categoryTktsSold",
						type: "uint256",
					},
					{
						internalType: "string",
						name: "category",
						type: "string",
					},
				],
				indexed: false,
				internalType: "struct IDaoEventsV2.SoldTicketStruct",
				name: "",
				type: "tuple",
			},
			{
				indexed: false,
				internalType: "address",
				name: "owner",
				type: "address",
			},
		],
		name: "SoldTicketDetails2",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "from",
				type: "address",
			},
			{
				indexed: true,
				internalType: "address",
				name: "to",
				type: "address",
			},
			{
				indexed: true,
				internalType: "uint256",
				name: "tokenId",
				type: "uint256",
			},
		],
		name: "Transfer",
		type: "event",
	},
	{
		constant: true,
		inputs: [],
		name: "USDT",
		outputs: [{ internalType: "address", name: "", type: "address" }],
		payable: false,
		stateMutability: "view",
		type: "function",
	},
	{
		constant: false,
		inputs: [
			{ internalType: "address", name: "to", type: "address" },
			{ internalType: "uint256", name: "tokenId", type: "uint256" },
		],
		name: "approve",
		outputs: [],
		payable: false,
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		constant: true,
		inputs: [{ internalType: "address", name: "owner", type: "address" }],
		name: "balanceOf",
		outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		payable: false,
		stateMutability: "view",
		type: "function",
	},
	{
		constant: true,
		inputs: [],
		name: "baseURI",
		outputs: [{ internalType: "string", name: "", type: "string" }],
		payable: false,
		stateMutability: "view",
		type: "function",
	},
	{
		constant: false,
		inputs: [
			{
				components: [
					{
						internalType: "uint256",
						name: "eventId",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "categoryIndex",
						type: "uint256",
					},
					{
						internalType: "string",
						name: "boughtLocation",
						type: "string",
					},
				],
				internalType: "struct IDaoEventsV2.BuyTicket",
				name: "_buyTicket",
				type: "tuple",
			},
		],
		name: "buyTicket",
		outputs: [],
		payable: false,
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		constant: false,
		inputs: [{ internalType: "address", name: "_token", type: "address" }],
		name: "changeToken",
		outputs: [],
		payable: false,
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		constant: false,
		inputs: [
			{
				components: [
					{ internalType: "bool", name: "oneTimeBuy", type: "bool" },
					{ internalType: "bool", name: "token", type: "bool" },
					{ internalType: "address", name: "owner", type: "address" },
					{ internalType: "uint256", name: "time", type: "uint256" },
					{
						internalType: "uint256",
						name: "duration",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "totalQuantity",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "totalQntySold",
						type: "uint256",
					},
					{ internalType: "string", name: "name", type: "string" },
					{ internalType: "string", name: "topic", type: "string" },
					{
						internalType: "string",
						name: "location",
						type: "string",
					},
					{
						internalType: "string",
						name: "ipfsHash",
						type: "string",
					},
					{
						internalType: "bool[]",
						name: "ticketLimited",
						type: "bool[]",
					},
					{
						internalType: "uint256[]",
						name: "tktQnty",
						type: "uint256[]",
					},
					{
						internalType: "uint256[]",
						name: "prices",
						type: "uint256[]",
					},
					{
						internalType: "uint256[]",
						name: "tktQntySold",
						type: "uint256[]",
					},
					{
						internalType: "string[]",
						name: "categories",
						type: "string[]",
					},
				],
				internalType: "struct IDaoEventsV2.Event",
				name: "_event",
				type: "tuple",
			},
		],
		name: "createEvent",
		outputs: [],
		payable: false,
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		constant: true,
		inputs: [],
		name: "eventIds",
		outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		payable: false,
		stateMutability: "view",
		type: "function",
	},
	{
		constant: true,
		inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		name: "eventRevenue",
		outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		payable: false,
		stateMutability: "view",
		type: "function",
	},
	{
		constant: true,
		inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		name: "events",
		outputs: [
			{ internalType: "bool", name: "oneTimeBuy", type: "bool" },
			{ internalType: "bool", name: "token", type: "bool" },
			{ internalType: "address", name: "owner", type: "address" },
			{ internalType: "uint256", name: "time", type: "uint256" },
			{ internalType: "uint256", name: "duration", type: "uint256" },
			{ internalType: "uint256", name: "totalQuantity", type: "uint256" },
			{ internalType: "uint256", name: "totalQntySold", type: "uint256" },
			{ internalType: "string", name: "name", type: "string" },
			{ internalType: "string", name: "topic", type: "string" },
			{ internalType: "string", name: "location", type: "string" },
			{ internalType: "string", name: "ipfsHash", type: "string" },
		],
		payable: false,
		stateMutability: "view",
		type: "function",
	},
	{
		constant: true,
		inputs: [{ internalType: "address", name: "_owner", type: "address" }],
		name: "eventsOf",
		outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
		payable: false,
		stateMutability: "view",
		type: "function",
	},
	{
		constant: true,
		inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
		name: "getApproved",
		outputs: [{ internalType: "address", name: "", type: "address" }],
		payable: false,
		stateMutability: "view",
		type: "function",
	},
	{
		constant: true,
		inputs: [],
		name: "getEventsCount",
		outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		payable: false,
		stateMutability: "view",
		type: "function",
	},
	{
		constant: true,
		inputs: [{ internalType: "uint256", name: "_id", type: "uint256" }],
		name: "getTicket",
		outputs: [
			{
				components: [
					{
						internalType: "uint256",
						name: "eventId",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "seatNo",
						type: "uint256",
					},
					{
						internalType: "string",
						name: "boughtLocation",
						type: "string",
					},
					{
						internalType: "string",
						name: "eventLocation",
						type: "string",
					},
				],
				internalType: "struct IDaoEventsV2.Ticket",
				name: "_ticket",
				type: "tuple",
			},
		],
		payable: false,
		stateMutability: "view",
		type: "function",
	},
	{
		constant: true,
		inputs: [
			{ internalType: "address", name: "owner", type: "address" },
			{ internalType: "address", name: "operator", type: "address" },
		],
		name: "isApprovedForAll",
		outputs: [{ internalType: "bool", name: "", type: "bool" }],
		payable: false,
		stateMutability: "view",
		type: "function",
	},
	{
		constant: true,
		inputs: [],
		name: "isOwner",
		outputs: [{ internalType: "bool", name: "", type: "bool" }],
		payable: false,
		stateMutability: "view",
		type: "function",
	},
	{
		constant: true,
		inputs: [],
		name: "name",
		outputs: [{ internalType: "string", name: "", type: "string" }],
		payable: false,
		stateMutability: "view",
		type: "function",
	},
	{
		constant: true,
		inputs: [],
		name: "oracle",
		outputs: [
			{ internalType: "contract IOracle", name: "", type: "address" },
		],
		payable: false,
		stateMutability: "view",
		type: "function",
	},
	{
		constant: true,
		inputs: [],
		name: "owner",
		outputs: [{ internalType: "address", name: "", type: "address" }],
		payable: false,
		stateMutability: "view",
		type: "function",
	},
	{
		constant: true,
		inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
		name: "ownerOf",
		outputs: [{ internalType: "address", name: "", type: "address" }],
		payable: false,
		stateMutability: "view",
		type: "function",
	},
	{
		constant: false,
		inputs: [],
		name: "renounceOwnership",
		outputs: [],
		payable: false,
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		constant: false,
		inputs: [
			{ internalType: "address", name: "from", type: "address" },
			{ internalType: "address", name: "to", type: "address" },
			{ internalType: "uint256", name: "tokenId", type: "uint256" },
		],
		name: "safeTransferFrom",
		outputs: [],
		payable: false,
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		constant: false,
		inputs: [
			{ internalType: "address", name: "from", type: "address" },
			{ internalType: "address", name: "to", type: "address" },
			{ internalType: "uint256", name: "tokenId", type: "uint256" },
			{ internalType: "bytes", name: "_data", type: "bytes" },
		],
		name: "safeTransferFrom",
		outputs: [],
		payable: false,
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		constant: false,
		inputs: [
			{ internalType: "address", name: "to", type: "address" },
			{ internalType: "bool", name: "approved", type: "bool" },
		],
		name: "setApprovalForAll",
		outputs: [],
		payable: false,
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		constant: true,
		inputs: [
			{ internalType: "bytes4", name: "interfaceId", type: "bytes4" },
		],
		name: "supportsInterface",
		outputs: [{ internalType: "bool", name: "", type: "bool" }],
		payable: false,
		stateMutability: "view",
		type: "function",
	},
	{
		constant: true,
		inputs: [],
		name: "symbol",
		outputs: [{ internalType: "string", name: "", type: "string" }],
		payable: false,
		stateMutability: "view",
		type: "function",
	},
	{
		constant: true,
		inputs: [],
		name: "ticketIds",
		outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		payable: false,
		stateMutability: "view",
		type: "function",
	},
	{
		constant: true,
		inputs: [{ internalType: "address", name: "owner", type: "address" }],
		name: "ticketsOf",
		outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
		payable: false,
		stateMutability: "view",
		type: "function",
	},
	{
		constant: true,
		inputs: [],
		name: "tokenAddress",
		outputs: [{ internalType: "address", name: "", type: "address" }],
		payable: false,
		stateMutability: "view",
		type: "function",
	},
	{
		constant: true,
		inputs: [{ internalType: "uint256", name: "index", type: "uint256" }],
		name: "tokenByIndex",
		outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		payable: false,
		stateMutability: "view",
		type: "function",
	},
	{
		constant: true,
		inputs: [
			{ internalType: "address", name: "owner", type: "address" },
			{ internalType: "uint256", name: "index", type: "uint256" },
		],
		name: "tokenOfOwnerByIndex",
		outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		payable: false,
		stateMutability: "view",
		type: "function",
	},
	{
		constant: true,
		inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
		name: "tokenURI",
		outputs: [{ internalType: "string", name: "", type: "string" }],
		payable: false,
		stateMutability: "view",
		type: "function",
	},
	{
		constant: true,
		inputs: [],
		name: "totalSupply",
		outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		payable: false,
		stateMutability: "view",
		type: "function",
	},
	{
		constant: false,
		inputs: [
			{ internalType: "address", name: "from", type: "address" },
			{ internalType: "address", name: "to", type: "address" },
			{ internalType: "uint256", name: "tokenId", type: "uint256" },
		],
		name: "transferFrom",
		outputs: [],
		payable: false,
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		constant: false,
		inputs: [
			{ internalType: "address", name: "newOwner", type: "address" },
		],
		name: "transferOwnership",
		outputs: [],
		payable: false,
		stateMutability: "nonpayable",
		type: "function",
	},
];

/*-------------------------------------------------------------------------------------------------*/
