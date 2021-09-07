import React, { Component } from "react";
import { drizzleConnect } from "drizzle-react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import {
	API_URL,
	REPORT_EVENT,
	GET_USER_DETAIL,
	GLOBAL_NETWORK_ID,
	GLOBAL_NETWORK_ID_2,
	INFURA_URL,
	INFURA_URL_2,
} from "../config/const";
import axios from "axios";
import PhoenixDAOLoader from "./PhoenixDAOLoader";
import Event from "./Event";
import GetGraphApi from "../config/getGraphApi";

//Material UI styles
import { withStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";

import SearchBar from "./common/SearchBar";
import { ThumbsUpDownOutlined } from "@material-ui/icons";
import Header from "./common/Header";
import EmptyState from "./EmptyState";
import {
	getMessage,
	getUserDetails,
	loginWithMetaMask,
} from "../config/serverAPIs";
import Web3 from "web3";

let ethereum = window.ethereum;
let web3 = window.web3;
const useStyles = (theme) => ({
	sticky: {
		position: "sticky",
		zIndex: 1,
		top: 0,
		display: "flex",
		flexDirection: "column",
		background: `#fafafa !important`,
		opacity: `1 !important`,
	},
	root: {
		flexGrow: 1,
		width: "100%",
	},
	appBar: {
		"&.MuiPaper-elevation4": {
			boxShadow: "none",
		},
	},
	tabBar: {
		"&:hover, &:focus ": {
			outline: "none",
		},
		" &:active ": {
			borderBottom: "2.5px solid #413AE2",
		},
		"&.MuiTab-textColorPrimary.Mui-selected": {
			color: "#413AE2",
			borderBottom: "2.5px solid #413AE2",
		},
	},
	formControl: {
		margin: theme.spacing(1),
		minWidth: 120,
	},
	selectEmpty: {
		marginTop: theme.spacing(2),
	},
});

function a11yProps(index) {
	return {
		id: `scrollable-auto-tab-${index}`,
		"aria-controls": `scrollable-auto-tabpanel-${index}`,
	};
}

class Favorites extends Component {
	// _isMounted = false;

	constructor(props, context) {
		super(props);
		// console.log("props", props);
		this.state = {
			openEvents: "",
			upload: false,
			blocks: 5000000,
			latestblocks: 6000000,
			loading: true,
			Events_Blockchain: [],
			Deleted_Events: [],
			Updated_Events: [],
			UserFavoriteEvents: [],
			active_length: "",
			isOldestFirst: false,
			event_copy: [],
			prevPath: -1,
			hideEvent: [],
			selectedTab: 0,
			reload: false,
		};

		// this.contracts = context.drizzle.contracts;
		// this.eventCount =
		//     this.contracts["DaoEvents"].methods.getEventsCount.cacheCall();
		this.perPage = 18;
		this.topicClick = this.topicClick.bind(this);
		this.myRef = React.createRef();
		this.toggleSortDate = this.toggleSortDate.bind(this);
		this.getUserFavoritesEvent = this.getUserFavoritesEvent.bind(this);
		this.reloadData = this.reloadData.bind(this);
	}

	topicClick(slug) {
		this.props.history.push("/topic/" + slug + "/" + 1);
		window.scrollTo(0, 80);
	}

	readMoreClick(location) {
		this.props.history.push(location);
		// window.scrollTo(0, 0);
	}

	ctasClick(slug) {
		this.props.history.push("/" + slug);
		window.scroll({
			top: 0,
			behavior: "smooth",
		});
	}

	caruselClick(location) {
		this.props.history.push(location);
	}
	executeScroll = () => {
		this.myRef.current.scrollIntoView();
	};

	//Loads Blockhain Data,
	async loadBlockchain() {
		const graphURL = await GetGraphApi();

		// GRAPH BLOCK //
		// console.log("GraphQL query before call",Date.now())

		// await axios({
		//     url: graphURL,
		//     method: "post",
		//     data: {
		//         query: `
		// 		  {
		// 			eventsRemoveds {
		// 			  id
		// 			  eventId
		// 			}
		// 		  }
		// 		  `,
		//     },
		// })
		//     .then((graphDeletedEvents) => {
		//         // console.log("GraphQL query all deleted events",graphDeletedEvents.data.data)

		//         if (
		//             !graphDeletedEvents.data ||
		//             !graphDeletedEvents.data.data == "undefined"
		//         ) {
		//             this.setState({ Deleted_Events: [] });
		//         } else {
		//             this.setState({
		//                 Deleted_Events:
		//                     graphDeletedEvents.data.data.eventsRemoveds,
		//             });
		//         }
		//     })
		//     .catch((err) => {
		//         console.error(err);
		//         this.setState({ Deleted_Events: [] });
		//     });

		await axios({
			url: graphURL,
			method: "post",
			data: {
				query: `
			  {
				events {
                    id
					eventId
					owner
					name
					topic
					location
					city
					ipfsHash
					tktLimited
					tktTotalQuantity
					tktTotalQuantitySold
					oneTimeBuy
					token
					time
					onsite
					catTktQuantity
					catTktQuantitySold	
					categories
					prices
					eventRevenueInDollar
					eventRevenueInPhnx
				}
			  }
			  `,
			},
		})
			.then((graphEvents) => {
				// console.log("GraphQL query response",Date.now(),graphEvents.data.data.events)

				if (!graphEvents.data || graphEvents.data.data == "undefined") {
					// console.log("GraphQL query -- graphEvents undefined")
					this.setState({
						Events_Blockchain: [],
						active_length: 0,
						event_copy: [],
					});
				} else {
					// if (this._isMounted) {
					const dateTime = Date.now();
					const dateNow = Math.floor(dateTime / 1000);
					this.setState({ loading: true });

					let newsort = graphEvents.data.data.events;
					//     .concat()
					//     .sort((a, b) => b.blockNumber - a.blockNumber)
					//     .filter((activeEvents) => activeEvents.time >= dateNow);
					// console.log("GraphQL query newsort",newsort)

					this.setState({
						Events_Blockchain: newsort,
						active_length: newsort.length,
						event_copy: newsort,
					});
					setTimeout(() => {
						this.setState({ loading: false });
					}, 2000);
					// }
				}
			})
			.catch((err) => console.error(err));
	}

	//Search Active Events By Name
	updateSearch = (value) => {
		this.setState({ value }, () => {
			try {
				if (this.state.value !== "") {
					var filteredEvents = this.state.event_copy;
					filteredEvents = filteredEvents.filter((event) => {
						return (
							event.name
								.toLowerCase()
								.search(this.state.value.toLowerCase()) !== -1
						);
					});
				} else {
					filteredEvents = this.state.event_copy;
				}
			} catch (e) {
				console.log(e);
			}
			this.setState({
				Events_Blockchain: filteredEvents,
				active_length: filteredEvents.length,
			});
			this.props.history.push("/favorite/" + 1);
		});
	};

	//Sort Active Events By Date(Newest/Oldest)
	toggleSortDate = (e) => {
		let { value } = e.target;
		this.setState({ value }, () => {
			const { Events_Blockchain } = this.state;
			const { ended } = Events_Blockchain;
			var newPolls = ended;

			if (this.state.isOldestFirst) {
				newPolls = Events_Blockchain.concat().sort(
					(a, b) => a.eventId - b.eventId
				);
			} else {
				newPolls = Events_Blockchain.concat().sort(
					(a, b) => b.eventId - a.eventId
				);
			}

			this.setState({
				isOldestFirst: !this.state.isOldestFirst,
				Events_Blockchain: newPolls,
			});
		});
	};

	filterHideEvent = async () => {
		try {
			const get = await axios.get(`${API_URL}${REPORT_EVENT}`);
			this.setState({
				hideEvent: get.data.result,
			});
			return;
		} catch (error) {
			console.log("check error", error);
		}
	};

	// filterFavoriteEvent = async () => {
	//     try {
	//         const get = await axios.get(`${API_URL}${REPORT_EVENT}`);
	//         this.setState({
	//             hideEvent: get.data.result,
	//         });
	//         return;
	//     } catch (error) {
	//         console.log("check error", error);
	//     }
	// };
	getUserFavoritesEvent = async () => {
		console.log("loading2", this.state.loading);
		try {
			const token = localStorage.getItem("AUTH_TOKEN");
			const get = await axios.post(
				`${API_URL}${GET_USER_DETAIL}`,
				{
					address: this.props.accounts[0],
					networkId: this.props.web3.networkId,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			console.log("get data", get);
			this.setState({
				UserFavoriteEvents: get.data.result.userHldr.favourites,
			});
			return;
		} catch (error) {
			console.log("check error", error.response);
			if (error.response.status === 403) {
				const userDetails = await this.authMetaMask();
				if (!userDetails.error) {
					console.log("userDetails", userDetails);
					this.setState({
						userDetails: userDetails,
						open: userDetails.result.result.userHldr.firstTime,
					});
					localStorage.removeItem("AUTH_TOKEN");
					localStorage.setItem(
						"AUTH_TOKEN",
						userDetails.result.result.token
					);
					console.log("successfully signed in favourites");
					this.getUserFavoritesEvent();
				}
			}
		}
		// this.setState({reload:false});
	};

	authMetaMask = async () => {
		try {
			const publicAddress = await web3.eth.getAccounts();
			const networkId = await this.getNetworkId();
			console.log("Public address", publicAddress);
			console.log("networkId", networkId);
			const message = await getMessage();
			const sign = await this.handleSignMessage(
				publicAddress[0],
				message.result.result
			);
			const userData = await loginWithMetaMask({
				publicAddress: publicAddress[0],
				networkId: networkId,
				signature: sign,
				message: message.result.result,
			});
			return userData;
		} catch (err) {
			console.log(err);
		}
	};

	handleSignMessage = async (publicAddress, message) => {
		try {
			console.log("message", message);
			const sign = await web3.eth.sign(
				web3.utils.sha3(message),
				publicAddress
			);
			console.log("sign", sign);
			return sign;
		} catch (err) {
			console.log(err);
		}
	};

	reloadData = () => {
		this.setState({ reload: !this.state.reload });
	};
	onTabChange = (event, newValue) => {
		this.setState({ selectedTab: newValue });
	};

	render() {
		//when user is not connectd hide connect wallet button
		// console.log("accounts---->", this.props.accounts);

		const { classes } = this.props;
		let body = <PhoenixDAOLoader />;

		if (
			// typeof this.props.contracts["DaoEvents"].getEventsCount[
			// this.eventCount
			// ] !== "undefined" &&
			this.state.active_length !== "undefined"
		) {
			let count = this.state.Events_Blockchain.length;
			if (count === 0 && !this.state.loading) {
				body = (
					<EmptyState
						text="You have no Favourites 😔"
						btnText="Find Events"
						url="/upcomingevents/1"
					/>
				);
			}
			let currentPage = Number(this.props.match.params.page);
			let events_list = [];
			let skip = false;
			for (let i = 0; i < this.state.Events_Blockchain.length; i++) {
				for (let j = 0; j < this.state.Deleted_Events.length; j++) {
					if (
						this.state.Events_Blockchain[i].eventId ==
						this.state.Deleted_Events[j].eventId
					) {
						skip = true;
					}
				}
				if (!skip) {
					for (let j = 0; j < this.state.hideEvent.length; j++) {
						if (
							this.state.Events_Blockchain[i].eventId ==
							this.state.hideEvent[j].id
						) {
							skip = true;
						}
					}
				}
				if (!skip) {
					events_list.push(this.state.Events_Blockchain[i]);
				}
				skip = false;
			}
			//get favourite events from filtered event list array
			let favoriteEvents = events_list.filter((item) =>
				this.state.UserFavoriteEvents.includes(item.eventId)
			);

			favoriteEvents.reverse();
			// console.log("events_listt",favoriteEvents)
			let updated_list = [];
			count = favoriteEvents.length;
			if (isNaN(currentPage) || currentPage < 1) currentPage = 1;
			let end = currentPage * this.perPage;
			let start = end - this.perPage;
			if (end > count) end = count;
			let pages = Math.ceil(count / this.perPage);
			for (let i = start; i < end; i++) {
				updated_list.push(
					<Event
						toggleBuying={this.props.toggleDisabling}
						disabledStatus={this.props.disabledStatus}
						inquire={this.props.inquire}
						key={favoriteEvents[i].eventId}
						id={favoriteEvents[i].eventId}
						ipfs={favoriteEvents[i].ipfsHash}
						eventData={favoriteEvents[i]}
						myFavorites={true}
						reloadData={this.reloadData}
						loading={this.state.loading}
					/>
				);
			}

			let pagination = "";
			if (pages > 1) {
				let links = [];

				if (pages > 5 && currentPage >= 3) {
					for (
						let i = currentPage - 2;
						i <= currentPage + 2 && i <= pages;
						i++
					) {
						let active = i === currentPage ? "active" : "";
						links.push(
							<li className={"page-item " + active} key={i}>
								<Link
									to={"/favorite/" + i}
									onClick={() =>
										this.setState({
											prevPath: currentPage,
										})
									}
									className="page-link"
								>
									{i}
								</Link>
							</li>
						);
						if (this.state.prevPath != -1) {
							this.executeScroll({
								behavior: "smooth",
								block: "start",
							});
						}
					}
				} else if (pages > 5 && currentPage < 3) {
					for (let i = 1; i <= 5 && i <= pages; i++) {
						let active = i === currentPage ? "active" : "";
						links.push(
							<li className={"page-item " + active} key={i}>
								<Link
									to={"/favorite/" + i}
									onClick={() =>
										this.setState({
											prevPath: currentPage,
										})
									}
									className="page-link"
								>
									{i}
								</Link>
							</li>
						);
						if (this.state.prevPath != -1) {
							this.executeScroll({
								behavior: "smooth",
								block: "start",
							});
						}
					}
				} else {
					for (let i = 1; i <= pages; i++) {
						let active = i === currentPage ? "active" : "";
						links.push(
							<li className={"page-item " + active} key={i}>
								<Link
									to={"/favorite/" + i}
									onClick={() =>
										this.setState({
											prevPath: currentPage,
										})
									}
									className="page-link"
								>
									{i}
								</Link>
							</li>
						);
						if (this.state.prevPath != -1) {
							this.executeScroll({
								behavior: "smooth",
								block: "start",
							});
						}
					}
				}
				pagination = (
					<nav>
						<ul className="pagination justify-content-center">
							{links}
						</ul>
					</nav>
				);
			}
			if (updated_list.length == 0) {
				body = (
					<EmptyState
						text="You have no Favourites 😔"
						btnText="Find Events"
						url="/upcomingevents/1"
					/>
				);
			} else {
				body = (
					<div>
						<div className="row user-list mt-4">{updated_list}</div>
						{pagination}
					</div>
				);
			}
		}

		return (
			<React.Fragment>
				<div>
					<Header
						title="Favourites"
						searchBar={true}
						handleSearch={this.updateSearch}
					/>
					<div ref={this.myRef} />

					{body}
				</div>
			</React.Fragment>
		);
	}

	async getNetworkId() {
		try {
			if (window.ethereum && window.ethereum.isMetaMask) {
				web3 = new Web3(ethereum);
			} else if (typeof web3 !== "undefined") {
				web3 = new Web3(web3.currentProvider);
			} else {
				const network = await web3.eth.net.getId();
				let infura;
				if (network === GLOBAL_NETWORK_ID) {
					infura = INFURA_URL;
				} else if (network === GLOBAL_NETWORK_ID_2) {
					infura = INFURA_URL_2;
				}
				web3 = new Web3(new Web3.providers.HttpProvider(infura));
			}
			const networkId = await web3.eth.net.getId();
			console.log("This called getNetworkId", networkId);
			if (networkId === GLOBAL_NETWORK_ID) {
				return networkId;
			} else if (networkId === GLOBAL_NETWORK_ID_2) {
				return networkId;
			} else {
				console.log("network id not suported");
			}
			return null;
		} catch (err) {
			console.log("err", err);
		}
	}

	async componentDidMount() {
		if (typeof ethereum !== "undefined") {
			const a = ethereum.enable();
			web3 = new Web3(ethereum);
			const accounts = await web3.eth.getAccounts();
		} else if (typeof web3 !== "undefined") {
			window.web3 = new Web3(web3.currentProvider);
		} else {
			const network = await this.getNetworkId();
			let infura;
			if (network === GLOBAL_NETWORK_ID) {
				infura = INFURA_URL;
			} else if (network === GLOBAL_NETWORK_ID_2) {
				infura = INFURA_URL_2;
			}
			window.web3 = new Web3(new Web3.providers.HttpProvider(infura));
		}

		this.loadBlockchain();
		this.filterHideEvent();
		this.getUserFavoritesEvent();
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevState.reload !== this.state.reload) {
			console.log("prev", prevState, this.state.reload);
			this.getUserFavoritesEvent();
		}
	}
	componentWillUnmount() {
		// this._isMounted = false;

		// fix Warning: Can't perform a React state update on an unmounted component
		this.setState = (state, callback) => {
			return;
		};
	}
}

Favorites.contextTypes = {
	drizzle: PropTypes.object,
};

const mapStateToProps = (state) => {
	return {
		// contracts: state.contracts,
		accounts: state.accounts,
		web3: state.web3,
	};
};

const AppContainer = drizzleConnect(Favorites, mapStateToProps);
export default withStyles(useStyles)(AppContainer);
