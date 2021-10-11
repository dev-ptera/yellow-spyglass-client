# [YellowSpyglass](https://www.yellowspyglass.com/) Client

This is a [Banano](https://banano.cc/) network explorer, written in Angular.  It currently supports the following pages & features:

## Pages

#### [Explore](https://www.yellowspyglass.com/) 
See address history & block hash information

#### [Wallets](https://www.yellowspyglass.com/wallets)
See banano distribution by account balance & the list of top banano holders

#### [Known Accounts](https://www.yellowspyglass.com/known-accounts)
A list of exchanges, developer funds, and other known addresses

#### [Vanity MonKeys](https://www.yellowspyglass.com/vanity)
A showcase of custom vanity monKeys, for special monkeys. 

#### [Network](https://www.yellowspyglass.com/network)
Distribution, Quorum, & Nakamoto Coefficient statistics for banano.

#### [Representatives](https://www.yellowspyglass.com/representatives)
The list of representatives that process transactions on the banano network.

#### [Node](https://www.yellowspyglass.com/monitor)
Information about the node running the Yellow Spyglass.
    
## Features
- Bookmarks.............................Quickly save hashes or addresses for future reference
- Themes....................................Currently supports a light and dark mode
- Representative Insights.....See which representatives are online/offline
- Rich List Insights...................Quickly see if top banano holders are voting for online reps
- Account Insights...................Generate a high-level chart of an account balance over time & account stats
    


## Local Development

### build
`yarn build`

### serve
`yarn start`

### deploy
`yarn build && firebase deploy`

### testing / code quality
`yarn prettier && yarn test && yarn lint`

## Hosting

Firebase hosts this application.


## Issues or Feature Requests

Please feel free to add any feature requests or bug reports to the issues tab found [here](https://github.com/dev-ptera/yellow-spyglass-client/issues).
