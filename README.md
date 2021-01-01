<p align="center">
  <a href="https://phoenixdao-events-dapp.herokuapp.com/" target="blank"><img src="https://phoenixdao-events-dapp.herokuapp.com/images/PhoenixDAO.png" width="100" alt="PhoenixDao logo" /></a>
</p>

# PhoenixDAO Events DApp

## What is it?
PhoenixDAO Events DApp it is a dApp based on Ethereum Blockchain that provides an ability to create events and sell tickets for events as ERC721 tokens.

## Use Cases

### Event creator.
A user can create an event: set up a title, description, image, date, price (The price can be set in Ethereum or in USD tokens), availability of seats (limited seats or not, if limited - the number of seats). When the event is created it is showed in the list of events. Other users can buy tickets for this event. All funds from the ticket's sale go to the event creator directly.

### Ticket buyer
A user can see the list of events and can choose and buy a ticket for it. The user can pay by Ethereum or USD tokens depends on event's settings. The user can see the list of all its tickets. The user can send its ticket to another user. All tickets are ERC721 tokens that means that users can do any action available for these type of tokens.

## PhoenixDAO Token
This dApp uses test tokens which user can receive on a special page.

* Functions/Modules 
  - Create Events
  - Buy Tickets
  - Send Tickets
  - 
  
### Integrated Stack
  - Web3
  - IPFS
  - Smartcontract


## File Structure
<pre>
├── avoiding_common_attacks.md
├── build
│   ├── app
│   │   ├── asset-manifest.json
│   │   ├── favicon.ico
│   │   ├── index.html
│   │   ├── service-worker.js
│   │   └── static
│   │       ├── css
│   │       ├── js
│   │       └── media
│   ├── asset-manifest.json
│   ├── contracts
│   │   ├── AddressUtils.json
│   │   ├── BasicToken.json
│   │   ├── Destructible.json
│   │   ├── ERC165.json
│   │   ├── ERC20Basic.json
│   │   ├── ERC20.json
│   │   ├── ERC721Basic.json
│   │   ├── ERC721BasicToken.json
│   │   ├── ERC721Enumerable.json
│   │   ├── ERC721.json
│   │   ├── ERC721Metadata.json
│   │   ├── ERC721Receiver.json
│   │   ├── ERC721Token.json
│   │   ├── Migrations.json
│   │   ├── OpenEvents.json
│   │   ├── OpenTicket.json
│   │   ├── Ownable.json
│   │   ├── Pausable.json
│   │   ├── SafeMath.json
│   │   ├── StableToken.json
│   │   ├── StandardToken.json
│   │   └── SupportsInterfaceWithLookup.json
│   ├── favicon.ico
│   ├── images
│   ├── index.html
│   ├── manifest.json
│   ├── _redirects
│   ├── service-worker.js
│   └── static
│       ├── css
│       ├── js
│       └── media
├── config.json
├── config-overrides.js
├── contracts
│   ├── Migrations.sol
│   ├── OpenEvents.sol
│   ├── OpenTicket.sol
│   └── StableToken.sol
├── debug.log
├── migrations
│   ├── 1_initial_migration.js
│   └── 2_deploy_contracts.js
├── package.json
├── package-lock.json
├── public
│   ├── index.html
│   ├── manifest.json
│   └── _redirects
├── README.md
├── src
│   ├── components
│   │   ├── App.jsx
│   │   ├── approvalModal.jsx
│   │   ├── Calendars.jsx
│   │   ├── CheckUser.jsx
│   │   ├── Clock.jsx
│   │   ├── CreateEvent
│   │   │   ├── Done.jsx
│   │   │   ├── Error.jsx
│   │   │   ├── Form.jsx
│   │   │   ├── index.jsx
│   │   │   ├── Loader.jsx
│   │   │   └── TimeAndDateLoader.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Event.jsx
│   │   ├── EventNotFound.jsx
│   │   ├── EventPage.jsx
│   │   ├── FindEvents.jsx
│   │   ├── Home.jsx
│   │   ├── Images
│   │   ├── LoadingApp.jsx
│   │   ├── Loading.jsx
│   │   ├── LocationLandingPage.jsx
│   │   ├── LocationsLandingPage.jsx
│   │   ├── MyEvents.jsx
│   │   ├── MyEventStat.jsx
│   │   ├── MyTickets.jsx
│   │   ├── NetworkError.jsx
│   │   ├── NotifyApprove.jsx
│   │   ├── NotifyApproveSuccess.jsx
│   │   ├── NotifyError.jsx
│   │   ├── NotifyEvent.jsx
│   │   ├── NotifyEventSuccess.jsx
│   │   ├── NotifyFaucet.jsx
│   │   ├── Notify.jsx
│   │   ├── NotifyNetwork.jsx
│   │   ├── NotifySuccessFaucet.jsx
│   │   ├── NotifySuccess.jsx
│   │   ├── PageNotFound.jsx
│   │   ├── PastEvents.jsx
│   │   ├── PhoenixDAOLoader.jsx
│   │   ├── Sidebar.jsx
│   │   ├── Ticket.jsx
│   │   ├── Token.jsx
│   │   ├── Topic.jsx
│   │   ├── TopicLandingPage.jsx
│   │   └── TopicsLandingPage.jsx
│   ├── config
│   │   ├── countries.json
│   │   ├── event_ctas.json
│   │   ├── hydrocontract_testnet.js
│   │   ├── location_ctas.json
│   │   ├── Moon.json
│   │   ├── OMG.js
│   │   ├── OMG.json
│   │   ├── OpenEvents.js
│   │   ├── OpenEvents.json
│   │   ├── phoenixDAOcontract_testnet.js
│   │   ├── sidebar.json
│   │   ├── slides_generic.json
│   │   ├── slides_locations.json
│   │   ├── StableToken.json
│   │   ├── states.json
│   │   ├── topics.json
│   │   └── types.json
│   ├── Error.jsx
│   ├── index.js
│   ├── styles
│   │   ├── main.css
│   │   └── Ticket.css
│   └── utils
│       └── ipfs.js
├── test
│   ├── OpenEvents.test.js
│   └── StableToken.test.js
├── truffle-config.js
└── yarn.lock
</pre>


## App Link
[PhoenixDAO Events DApp](https://phoenixdao-events-dapp.herokuapp.com/)

## Setup

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
