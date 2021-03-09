export const Open_events_Address = '0x7A5473c28BF64ebF67Dee5Dfb65117837dC42EC8';

export const Open_events_ABI =  [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_token",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "approved",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "Approval",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "approved",
				"type": "bool"
			}
		],
		"name": "ApprovalForAll",
		"type": "event"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_eventId",
				"type": "uint256"
			}
		],
		"name": "buyTicket",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "address",
				"name": "_token",
				"type": "address"
			}
		],
		"name": "chengeToken",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "eventId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "time",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "token",
				"type": "bool"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "limited",
				"type": "bool"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "seats",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "sold",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "ipfs",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "category",
				"type": "string"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "CreatedEvent",
		"type": "event"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_time",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_price",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "_token",
				"type": "bool"
			},
			{
				"internalType": "bool",
				"name": "_limited",
				"type": "bool"
			},
			{
				"internalType": "uint256",
				"name": "_seats",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_ipfs",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_category",
				"type": "string"
			}
		],
		"name": "createEvent",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "eventId",
				"type": "uint256"
			}
		],
		"name": "DeletedEvent",
		"type": "event"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			}
		],
		"name": "deleteEvent",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "eventId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "time",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "token",
				"type": "bool"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "limited",
				"type": "bool"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "seats",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "sold",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "ipfs",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "category",
				"type": "string"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "NewAndUpdatedEvent",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "renounceOwnership",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "safeTransferFrom",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"internalType": "bytes",
				"name": "_data",
				"type": "bytes"
			}
		],
		"name": "safeTransferFrom",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "approved",
				"type": "bool"
			}
		],
		"name": "setApprovalForAll",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "buyer",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "eventId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "ticketId",
				"type": "uint256"
			}
		],
		"name": "SoldTicket",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "eventId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "time",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "seats",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "ipfs",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "category",
				"type": "string"
			}
		],
		"name": "UpdatedEvent",
		"type": "event"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_eventId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_time",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_price",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "_token",
				"type": "bool"
			},
			{
				"internalType": "bool",
				"name": "_limited",
				"type": "bool"
			},
			{
				"internalType": "uint256",
				"name": "_seats",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_ipfs",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_category",
				"type": "string"
			}
		],
		"name": "updateEvent",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "_eventIds",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "_ticketIds",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "eventRevenue",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "events",
		"outputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "time",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "token",
				"type": "bool"
			},
			{
				"internalType": "bool",
				"name": "limited",
				"type": "bool"
			},
			{
				"internalType": "uint256",
				"name": "seats",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "sold",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "ipfs",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "category",
				"type": "string"
			},
			{
				"internalType": "address payable",
				"name": "owner",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "address",
				"name": "_owner",
				"type": "address"
			}
		],
		"name": "eventsOf",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "getApproved",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getEventsCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			}
		],
		"name": "getTicket",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			}
		],
		"name": "isApprovedForAll",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "isOwner",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "name",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "ownerOf",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "bytes4",
				"name": "interfaceId",
				"type": "bytes4"
			}
		],
		"name": "supportsInterface",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "symbol",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "ticketsOf",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "tokenByIndex",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "tokenOfOwnerByIndex",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			}
		],
		"name": "tokenOwner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "tokenURI",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "totalSupply",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
]



// export const Open_events_Address = '0xd5d6627bb34b7e667954a539b36a2608f511b06a';
// export const Open_events_ABI = [{
//         "constant": true,
//         "inputs": [{
//             "name": "_interfaceId",
//             "type": "bytes4"
//         }],
//         "name": "supportsInterface",
//         "outputs": [{
//             "name": "",
//             "type": "bool"
//         }],
//         "payable": false,
//         "stateMutability": "view",
//         "type": "function"
//     },
//     {
//         "constant": true,
//         "inputs": [],
//         "name": "name",
//         "outputs": [{
//             "name": "",
//             "type": "string"
//         }],
//         "payable": false,
//         "stateMutability": "view",
//         "type": "function"
//     },
//     {
//         "constant": true,
//         "inputs": [{
//             "name": "_tokenId",
//             "type": "uint256"
//         }],
//         "name": "getApproved",
//         "outputs": [{
//             "name": "",
//             "type": "address"
//         }],
//         "payable": false,
//         "stateMutability": "view",
//         "type": "function"
//     },
//     {
//         "constant": false,
//         "inputs": [{
//                 "name": "_to",
//                 "type": "address"
//             },
//             {
//                 "name": "_tokenId",
//                 "type": "uint256"
//             }
//         ],
//         "name": "approve",
//         "outputs": [],
//         "payable": false,
//         "stateMutability": "nonpayable",
//         "type": "function"
//     },
//     {
//         "constant": true,
//         "inputs": [],
//         "name": "totalSupply",
//         "outputs": [{
//             "name": "",
//             "type": "uint256"
//         }],
//         "payable": false,
//         "stateMutability": "view",
//         "type": "function"
//     },
//     {
//         "constant": true,
//         "inputs": [],
//         "name": "InterfaceId_ERC165",
//         "outputs": [{
//             "name": "",
//             "type": "bytes4"
//         }],
//         "payable": false,
//         "stateMutability": "view",
//         "type": "function"
//     },
//     {
//         "constant": false,
//         "inputs": [{
//                 "name": "_from",
//                 "type": "address"
//             },
//             {
//                 "name": "_to",
//                 "type": "address"
//             },
//             {
//                 "name": "_tokenId",
//                 "type": "uint256"
//             }
//         ],
//         "name": "transferFrom",
//         "outputs": [],
//         "payable": false,
//         "stateMutability": "nonpayable",
//         "type": "function"
//     },
//     {
//         "constant": true,
//         "inputs": [{
//                 "name": "_owner",
//                 "type": "address"
//             },
//             {
//                 "name": "_index",
//                 "type": "uint256"
//             }
//         ],
//         "name": "tokenOfOwnerByIndex",
//         "outputs": [{
//             "name": "",
//             "type": "uint256"
//         }],
//         "payable": false,
//         "stateMutability": "view",
//         "type": "function"
//     },
//     {
//         "constant": true,
//         "inputs": [],
//         "name": "getEventsCount",
//         "outputs": [{
//             "name": "",
//             "type": "uint256"
//         }],
//         "payable": false,
//         "stateMutability": "view",
//         "type": "function"
//     },
//     {
//         "constant": true,
//         "inputs": [{
//             "name": "_owner",
//             "type": "address"
//         }],
//         "name": "ticketsOf",
//         "outputs": [{
//             "name": "",
//             "type": "uint256[]"
//         }],
//         "payable": false,
//         "stateMutability": "view",
//         "type": "function"
//     },
//     {
//         "constant": false,
//         "inputs": [{
//             "name": "_token",
//             "type": "address"
//         }],
//         "name": "chengeToken",
//         "outputs": [],
//         "payable": false,
//         "stateMutability": "nonpayable",
//         "type": "function"
//     },
//     {
//         "constant": false,
//         "inputs": [],
//         "name": "unpause",
//         "outputs": [],
//         "payable": false,
//         "stateMutability": "nonpayable",
//         "type": "function"
//     },
//     {
//         "constant": false,
//         "inputs": [{
//                 "name": "_from",
//                 "type": "address"
//             },
//             {
//                 "name": "_to",
//                 "type": "address"
//             },
//             {
//                 "name": "_tokenId",
//                 "type": "uint256"
//             }
//         ],
//         "name": "safeTransferFrom",
//         "outputs": [],
//         "payable": false,
//         "stateMutability": "nonpayable",
//         "type": "function"
//     },
//     {
//         "constant": true,
//         "inputs": [{
//             "name": "_tokenId",
//             "type": "uint256"
//         }],
//         "name": "exists",
//         "outputs": [{
//             "name": "",
//             "type": "bool"
//         }],
//         "payable": false,
//         "stateMutability": "view",
//         "type": "function"
//     },
//     {
//         "constant": true,
//         "inputs": [{
//             "name": "_index",
//             "type": "uint256"
//         }],
//         "name": "tokenByIndex",
//         "outputs": [{
//             "name": "",
//             "type": "uint256"
//         }],
//         "payable": false,
//         "stateMutability": "view",
//         "type": "function"
//     },
//     {
//         "constant": true,
//         "inputs": [],
//         "name": "paused",
//         "outputs": [{
//             "name": "",
//             "type": "bool"
//         }],
//         "payable": false,
//         "stateMutability": "view",
//         "type": "function"
//     },
//     {
//         "constant": true,
//         "inputs": [{
//             "name": "_tokenId",
//             "type": "uint256"
//         }],
//         "name": "ownerOf",
//         "outputs": [{
//             "name": "",
//             "type": "address"
//         }],
//         "payable": false,
//         "stateMutability": "view",
//         "type": "function"
//     },
//     {
//         "constant": false,
//         "inputs": [{
//             "name": "_eventId",
//             "type": "uint256"
//         }],
//         "name": "buyTicket",
//         "outputs": [],
//         "payable": true,
//         "stateMutability": "payable",
//         "type": "function"
//     },
//     {
//         "constant": true,
//         "inputs": [{
//             "name": "_owner",
//             "type": "address"
//         }],
//         "name": "eventsOf",
//         "outputs": [{
//             "name": "",
//             "type": "uint256[]"
//         }],
//         "payable": false,
//         "stateMutability": "view",
//         "type": "function"
//     },
//     {
//         "constant": true,
//         "inputs": [{
//             "name": "_id",
//             "type": "uint256"
//         }],
//         "name": "getEvent",
//         "outputs": [{
//                 "name": "name",
//                 "type": "string"
//             },
//             {
//                 "name": "time",
//                 "type": "uint256"
//             },
//             {
//                 "name": "price",
//                 "type": "uint256"
//             },
//             {
//                 "name": "token",
//                 "type": "bool"
//             },
//             {
//                 "name": "limited",
//                 "type": "bool"
//             },
//             {
//                 "name": "seats",
//                 "type": "uint256"
//             },
//             {
//                 "name": "sold",
//                 "type": "uint256"
//             },
//             {
//                 "name": "ipfs",
//                 "type": "string"
//             },
//             {
//                 "name": "category",
//                 "type": "string"
//             },
//             {
//                 "name": "owner",
//                 "type": "address"
//             }
//         ],
//         "payable": false,
//         "stateMutability": "view",
//         "type": "function"
//     },
//     {
//         "constant": true,
//         "inputs": [{
//             "name": "_owner",
//             "type": "address"
//         }],
//         "name": "balanceOf",
//         "outputs": [{
//             "name": "",
//             "type": "uint256"
//         }],
//         "payable": false,
//         "stateMutability": "view",
//         "type": "function"
//     },
//     {
//         "constant": false,
//         "inputs": [],
//         "name": "renounceOwnership",
//         "outputs": [],
//         "payable": false,
//         "stateMutability": "nonpayable",
//         "type": "function"
//     },
//     {
//         "constant": true,
//         "inputs": [{
//             "name": "_id",
//             "type": "uint256"
//         }],
//         "name": "getTicket",
//         "outputs": [{
//                 "name": "",
//                 "type": "uint256"
//             },
//             {
//                 "name": "",
//                 "type": "uint256"
//             }
//         ],
//         "payable": false,
//         "stateMutability": "view",
//         "type": "function"
//     },
//     {
//         "constant": false,
//         "inputs": [],
//         "name": "destroy",
//         "outputs": [],
//         "payable": false,
//         "stateMutability": "nonpayable",
//         "type": "function"
//     },
//     {
//         "constant": false,
//         "inputs": [],
//         "name": "pause",
//         "outputs": [],
//         "payable": false,
//         "stateMutability": "nonpayable",
//         "type": "function"
//     },
//     {
//         "constant": true,
//         "inputs": [],
//         "name": "owner",
//         "outputs": [{
//             "name": "",
//             "type": "address"
//         }],
//         "payable": false,
//         "stateMutability": "view",
//         "type": "function"
//     },
//     {
//         "constant": true,
//         "inputs": [],
//         "name": "symbol",
//         "outputs": [{
//             "name": "",
//             "type": "string"
//         }],
//         "payable": false,
//         "stateMutability": "view",
//         "type": "function"
//     },
//     {
//         "constant": false,
//         "inputs": [{
//                 "name": "_to",
//                 "type": "address"
//             },
//             {
//                 "name": "_approved",
//                 "type": "bool"
//             }
//         ],
//         "name": "setApprovalForAll",
//         "outputs": [],
//         "payable": false,
//         "stateMutability": "nonpayable",
//         "type": "function"
//     },
//     {
//         "constant": false,
//         "inputs": [{
//                 "name": "_from",
//                 "type": "address"
//             },
//             {
//                 "name": "_to",
//                 "type": "address"
//             },
//             {
//                 "name": "_tokenId",
//                 "type": "uint256"
//             },
//             {
//                 "name": "_data",
//                 "type": "bytes"
//             }
//         ],
//         "name": "safeTransferFrom",
//         "outputs": [],
//         "payable": false,
//         "stateMutability": "nonpayable",
//         "type": "function"
//     },
//     {
//         "constant": true,
//         "inputs": [{
//             "name": "_tokenId",
//             "type": "uint256"
//         }],
//         "name": "tokenURI",
//         "outputs": [{
//             "name": "",
//             "type": "string"
//         }],
//         "payable": false,
//         "stateMutability": "view",
//         "type": "function"
//     },
//     {
//         "constant": true,
//         "inputs": [{
//                 "name": "_owner",
//                 "type": "address"
//             },
//             {
//                 "name": "_operator",
//                 "type": "address"
//             }
//         ],
//         "name": "isApprovedForAll",
//         "outputs": [{
//             "name": "",
//             "type": "bool"
//         }],
//         "payable": false,
//         "stateMutability": "view",
//         "type": "function"
//     },
//     {
//         "constant": false,
//         "inputs": [{
//             "name": "_newOwner",
//             "type": "address"
//         }],
//         "name": "transferOwnership",
//         "outputs": [],
//         "payable": false,
//         "stateMutability": "nonpayable",
//         "type": "function"
//     },
//     {
//         "constant": false,
//         "inputs": [{
//             "name": "_recipient",
//             "type": "address"
//         }],
//         "name": "destroyAndSend",
//         "outputs": [],
//         "payable": false,
//         "stateMutability": "nonpayable",
//         "type": "function"
//     },
//     {
//         "constant": false,
//         "inputs": [{
//                 "name": "_name",
//                 "type": "string"
//             },
//             {
//                 "name": "_time",
//                 "type": "uint256"
//             },
//             {
//                 "name": "_price",
//                 "type": "uint256"
//             },
//             {
//                 "name": "_token",
//                 "type": "bool"
//             },
//             {
//                 "name": "_limited",
//                 "type": "bool"
//             },
//             {
//                 "name": "_seats",
//                 "type": "uint256"
//             },
//             {
//                 "name": "_ipfs",
//                 "type": "string"
//             },
//             {
//                 "name": "_category",
//                 "type": "string"
//             }
//         ],
//         "name": "createEvent",
//         "outputs": [],
//         "payable": false,
//         "stateMutability": "nonpayable",
//         "type": "function"
//     },
//     {
//         "inputs": [{
//             "name": "_token",
//             "type": "address"
//         }],
//         "payable": false,
//         "stateMutability": "nonpayable",
//         "type": "constructor"
//     },
//     {
//         "anonymous": false,
//         "inputs": [{
//                 "indexed": true,
//                 "name": "owner",
//                 "type": "address"
//             },
//             {
//                 "indexed": false,
//                 "name": "eventId",
//                 "type": "uint256"
//             },
//             {
//                 "indexed": false,
//                 "name": "name",
//                 "type": "string"
//             },
//             {
//                 "indexed": false,
//                 "name": "time",
//                 "type": "uint256"
//             },
//             {
//                 "indexed": false,
//                 "name": "price",
//                 "type": "uint256"
//             },
//             {
//                 "indexed": false,
//                 "name": "token",
//                 "type": "bool"
//             },
//             {
//                 "indexed": false,
//                 "name": "limited",
//                 "type": "bool"
//             },
//             {
//                 "indexed": false,
//                 "name": "seats",
//                 "type": "uint256"
//             },
//             {
//                 "indexed": false,
//                 "name": "sold",
//                 "type": "uint256"
//             },
//             {
//                 "indexed": false,
//                 "name": "ipfs",
//                 "type": "string"
//             },
//             {
//                 "indexed": false,
//                 "name": "category",
//                 "type": "string"
//             }
//         ],
//         "name": "CreatedEvent",
//         "type": "event"
//     },
//     {
//         "anonymous": false,
//         "inputs": [{
//                 "indexed": true,
//                 "name": "buyer",
//                 "type": "address"
//             },
//             {
//                 "indexed": true,
//                 "name": "eventId",
//                 "type": "uint256"
//             },
//             {
//                 "indexed": false,
//                 "name": "ticketId",
//                 "type": "uint256"
//             }
//         ],
//         "name": "SoldTicket",
//         "type": "event"
//     },
//     {
//         "anonymous": false,
//         "inputs": [],
//         "name": "Pause",
//         "type": "event"
//     },
//     {
//         "anonymous": false,
//         "inputs": [],
//         "name": "Unpause",
//         "type": "event"
//     },
//     {
//         "anonymous": false,
//         "inputs": [{
//             "indexed": true,
//             "name": "previousOwner",
//             "type": "address"
//         }],
//         "name": "OwnershipRenounced",
//         "type": "event"
//     },
//     {
//         "anonymous": false,
//         "inputs": [{
//                 "indexed": true,
//                 "name": "previousOwner",
//                 "type": "address"
//             },
//             {
//                 "indexed": true,
//                 "name": "newOwner",
//                 "type": "address"
//             }
//         ],
//         "name": "OwnershipTransferred",
//         "type": "event"
//     },
//     {
//         "anonymous": false,
//         "inputs": [{
//                 "indexed": true,
//                 "name": "_from",
//                 "type": "address"
//             },
//             {
//                 "indexed": true,
//                 "name": "_to",
//                 "type": "address"
//             },
//             {
//                 "indexed": true,
//                 "name": "_tokenId",
//                 "type": "uint256"
//             }
//         ],
//         "name": "Transfer",
//         "type": "event"
//     },
//     {
//         "anonymous": false,
//         "inputs": [{
//                 "indexed": true,
//                 "name": "_owner",
//                 "type": "address"
//             },
//             {
//                 "indexed": true,
//                 "name": "_approved",
//                 "type": "address"
//             },
//             {
//                 "indexed": true,
//                 "name": "_tokenId",
//                 "type": "uint256"
//             }
//         ],
//         "name": "Approval",
//         "type": "event"
//     },
//     {
//         "anonymous": false,
//         "inputs": [{
//                 "indexed": true,
//                 "name": "_owner",
//                 "type": "address"
//             },
//             {
//                 "indexed": true,
//                 "name": "_operator",
//                 "type": "address"
//             },
//             {
//                 "indexed": false,
//                 "name": "_approved",
//                 "type": "bool"
//             }
//         ],
//         "name": "ApprovalForAll",
//         "type": "event"
//     }
// ]