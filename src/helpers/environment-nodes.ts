import { ethers } from "ethers";

interface ICurrentStats {
    failedConnectionCount: number;
    lastFailedConnectionAt: number;
  }  

export const minutesAgo = (x: number) => {
    const now = new Date().getTime();
    return new Date(now - x * 60000).getTime();
  };

/**
 * Access `process.env` in an environment helper
 * Usage: `EnvHelper.env`
 * - Other static methods can be added as needed per
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/static
 */
 export class EnvHelper {
    /**
     * @returns `process.env`
     */
    static env = process.env;
    static alchemyTestnetURI = `https://eth-rinkeby.alchemyapi.io/v2/${EnvHelper.env.REACT_APP_TESTNET_ALCHEMY}`;
    static whitespaceRegex = /\s+/;
  
    /**
     * Returns env contingent segment api key
     * @returns segment
     */
    static getSegmentKey() {
      return EnvHelper.env.REACT_APP_SEGMENT_API_KEY;
    }
  
    static isNotEmpty(envVariable: string) {
      if (envVariable.length > 10) {
        return true;
      } else {
        return false;
      }
    }
  
    /**
     * in development environment will return the `ethers` community api key so that devs don't need to add elements to their .env
     * @returns Array of Alchemy API URIs or empty set
     */
    static getAlchemyAPIKeyList() {
      let ALCHEMY_ID_LIST: string[];
  
      // split the provided API keys on whitespace
      if (EnvHelper.env.REACT_APP_ALCHEMY_IDS && EnvHelper.isNotEmpty(EnvHelper.env.REACT_APP_ALCHEMY_IDS)) {
        ALCHEMY_ID_LIST = EnvHelper.env.REACT_APP_ALCHEMY_IDS.split(EnvHelper.whitespaceRegex);
      } else {
        ALCHEMY_ID_LIST = [];
      }
  
      // now add the uri path
      if (ALCHEMY_ID_LIST.length > 0) {
        ALCHEMY_ID_LIST = ALCHEMY_ID_LIST.map(alchemyID => `https://eth-mainnet.alchemyapi.io/v2/${alchemyID}`);
      } else {
        ALCHEMY_ID_LIST = [];
      }
      return ALCHEMY_ID_LIST;
    }
  
    /**
     * NOTE(appleseed): Infura IDs are only used as Fallbacks & are not Mandatory
     * @returns {Array} Array of Infura API Ids
     */
    static getInfuraIdList() {
      let INFURA_ID_LIST: string[];
  
      // split the provided API keys on whitespace
      if (EnvHelper.env.REACT_APP_INFURA_IDS && EnvHelper.isNotEmpty(EnvHelper.env.REACT_APP_INFURA_IDS)) {
        INFURA_ID_LIST = EnvHelper.env.REACT_APP_INFURA_IDS.split(new RegExp(EnvHelper.whitespaceRegex));
      } else {
        INFURA_ID_LIST = [];
      }
  
      // now add the uri path
      if (INFURA_ID_LIST.length > 0) {
        INFURA_ID_LIST = INFURA_ID_LIST.map(infuraID => `https://mainnet.infura.io/v3/${infuraID}`);
      } else {
        INFURA_ID_LIST = [];
      }
      return INFURA_ID_LIST;
    }
  
    /**
     * @returns {Array} Array of node url addresses or empty set
     * node url addresses can be whitespace-separated string of "https" addresses
     * - functionality for Websocket addresses has been deprecated due to issues with WalletConnect
     *     - WalletConnect Issue: https://github.com/WalletConnect/walletconnect-monorepo/issues/193
     */
    static getSelfHostedNode() {
      let URI_LIST: string[];
      if (EnvHelper.env.REACT_APP_SELF_HOSTED_NODE && EnvHelper.isNotEmpty(EnvHelper.env.REACT_APP_SELF_HOSTED_NODE)) {
        URI_LIST = EnvHelper.env.REACT_APP_SELF_HOSTED_NODE.split(new RegExp(EnvHelper.whitespaceRegex));
      } else {
        URI_LIST = [];
      }
      return URI_LIST;
    }
  
    /**
     * in development will always return the `ethers` community key url even if .env is blank
     * in prod if .env is blank API connections will fail
     * @returns array of API urls
     */
    static getAPIUris() {
      let ALL_URIs = EnvHelper.getSelfHostedNode();
      if (EnvHelper.env.NODE_ENV === "development" && ALL_URIs.length === 0) {
        // push in the common ethers key in development
        ALL_URIs.push("https://api.avax.network/ext/bc/C/rpc");
      }
      if (ALL_URIs.length === 0) console.error("API keys must be set in the .env");
      return ALL_URIs;
    }
  
    static getFallbackURIs() {
      const ALL_URIs = [...EnvHelper.getAlchemyAPIKeyList(), ...EnvHelper.getInfuraIdList()];
      return ALL_URIs;
    }
  
    static getGeoapifyAPIKey() {
      var apiKey = EnvHelper.env.REACT_APP_GEOAPIFY_API_KEY;
      if (!apiKey) {
        console.warn("Missing REACT_APP_GEOAPIFY_API_KEY environment variable");
        return null;
      }
  
      return apiKey;
    }
 }


    /**
 * NodeHelper used to parse which nodes are valid / invalid, working / not working
 * NodeHelper.currentRemovedNodes is Object representing invalidNodes
 * NodeHelper.logBadConnectionWithTimer logs connection stats for Nodes
 * NodeHelper.getNodesUris returns an array of valid node uris
 */
export class NodeHelper {
    static _invalidNodesKey = "invalidNodes";
    static _maxFailedConnections = 1;
    /**
     * failedConnectionsMinuteLimit is the number of minutes that _maxFailedConnections must occur within
     * for the node to be blocked.
     */
    static _failedConnectionsMinutesLimit = 15;
  
    // use sessionStorage so that we don't have to worry about resetting the invalidNodes list
    static _storage = window.sessionStorage;
  
    static currentRemovedNodes = JSON.parse(NodeHelper._storage.getItem(NodeHelper._invalidNodesKey) || "{}");
    static currentRemovedNodesURIs = Object.keys(NodeHelper.currentRemovedNodes);
  
    /**
     * remove the invalidNodes list entirely
     * should be used as a failsafe IF we have invalidated ALL nodes AND we have no fallbacks
     */
    static _emptyInvalidNodesList() {
      // if all nodes are removed && there are no fallbacks, then empty the list
      if (
        EnvHelper.getFallbackURIs().length === 0 &&
        Object.keys(NodeHelper.currentRemovedNodes).length === EnvHelper.getAPIUris().length
      ) {
        NodeHelper._storage.removeItem(NodeHelper._invalidNodesKey);
      }
    }
  
    static _updateConnectionStatsForProvider(currentStats: ICurrentStats) {
      const failedAt = new Date().getTime();
      const failedConnectionCount = currentStats.failedConnectionCount || 0;
      if (
        failedConnectionCount > 0 &&
        currentStats.lastFailedConnectionAt > minutesAgo(NodeHelper._failedConnectionsMinutesLimit)
      ) {
        // more than 0 failed connections in the last (15) minutes
        currentStats = {
          lastFailedConnectionAt: failedAt,
          failedConnectionCount: failedConnectionCount + 1,
        };
      } else {
        currentStats = {
          lastFailedConnectionAt: failedAt,
          failedConnectionCount: 1,
        };
      }
      return currentStats;
    }
  
    static _removeNodeFromProviders(providerKey: string, providerUrl: string) {
      // get Object of current removed Nodes
      // key = providerUrl, value = removedAt Timestamp
      let currentRemovedNodesObj = NodeHelper.currentRemovedNodes;
      if (Object.keys(currentRemovedNodesObj).includes(providerUrl)) {
        // already on the removed nodes list
      } else {
        // add to list
        currentRemovedNodesObj[providerUrl] = new Date().getTime();
        NodeHelper._storage.setItem(NodeHelper._invalidNodesKey, JSON.stringify(currentRemovedNodesObj));
        // remove connection stats for this Node
        NodeHelper._storage.removeItem(providerKey);
      }
  
      // will only empty if no Fallbacks are provided
      NodeHelper._emptyInvalidNodesList();
    }
  
    /**
     * adds a bad connection stat to NodeHelper._storage for a given node
     * if greater than `_maxFailedConnections` previous failures in last `_failedConnectionsMinuteLimit` minutes will remove node from list
     * @param provider an Ethers provider
     */
    static logBadConnectionWithTimer(providerUrl: string) {
      const providerKey: string = "-nodeHelper:" + providerUrl;
  
      let currentConnectionStats = JSON.parse(NodeHelper._storage.getItem(providerKey) || "{}");
      currentConnectionStats = NodeHelper._updateConnectionStatsForProvider(currentConnectionStats);
      if (currentConnectionStats.failedConnectionCount >= NodeHelper._maxFailedConnections) {
        // then remove this node from our provider list for 24 hours
        NodeHelper._removeNodeFromProviders(providerKey, providerUrl);
      } else {
        NodeHelper._storage.setItem(providerKey, JSON.stringify(currentConnectionStats));
      }
    }
  
    /**
     * returns Array of APIURIs where NOT on invalidNodes list
     */
    static getNodesUris = () => {
      let allURIs = EnvHelper.getAPIUris();
      let invalidNodes = NodeHelper.currentRemovedNodesURIs;
      // filter invalidNodes out of allURIs
      // this allows duplicates in allURIs, removes both if invalid, & allows both if valid
      allURIs = allURIs.filter(item => !invalidNodes.includes(item));
  
      // return the remaining elements
      if (allURIs.length === 0) {
        // the invalidNodes list will be emptied when the user starts a new session
        // In the meantime use the fallbacks
        allURIs = EnvHelper.getFallbackURIs();
      }
      return allURIs;
    };
  
    /**
     * stores a retry check to be used to prevent constant Node Health retries
     * returns true if we haven't previously retried, else false
     * @returns boolean
     */
    static retryOnInvalid = () => {
      const storageKey = "-nodeHelper:retry";
      if (!NodeHelper._storage.getItem(storageKey)) {
        NodeHelper._storage.setItem(storageKey, "true");
        // if we haven't previously retried then return true
        return true;
      }
      return false;
    };
  
    /**
     * iterate through all the nodes we have with a chainId check.
     * - log the failing nodes
     * - _maxFailedConnections fails in < _failedConnectionsMinutesLimit sends the node to the invalidNodes list
     * returns an Array of working mainnet nodes
     */
    static checkAllNodesStatus = async () => {
      return await Promise.all(
        NodeHelper.getNodesUris().map(async URI => {
          let workingUrl = await NodeHelper.checkNodeStatus(URI);
          return workingUrl;
        }),
      );
    };
  
    /**
     * 403 errors are not caught by fetch so we check response.status, too
     * this func returns a workingURL string or false;
     */
    static checkNodeStatus = async (url: string) => {
      // 1. confirm peerCount > 0 (as a HexValue)
      let liveURL;
      liveURL = await NodeHelper.queryNodeStatus({
        url: url,
        body: JSON.stringify({ method: "net_peerCount", params: [], id: 74, jsonrpc: "2.0" }),
        nodeMethod: "net_peerCount",
      });
      // 2. confirm eth_syncing === false
      if (liveURL) {
        liveURL = await NodeHelper.queryNodeStatus({
          url: url,
          body: JSON.stringify({ method: "eth_syncing", params: [], id: 67, jsonrpc: "2.0" }),
          nodeMethod: "eth_syncing",
        });
      }
      return liveURL;
    };
  
    static queryNodeStatus = async ({ url, body, nodeMethod }: { url: string; body: string; nodeMethod: string }) => {
      let liveURL: boolean | string;
      try {
        let resp = await fetch(url, {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: body,
        });
        if (!resp.ok) {
          throw Error("failed node connection");
        } else {
          // response came back but is it healthy?
          let jsonResponse = await resp.json();
          if (NodeHelper.validityCheck({ nodeMethod, resultVal: jsonResponse.result })) {
            liveURL = url;
          } else {
            throw Error("no suitable peers");
          }
        }
      } catch {
        // some other type of issue
        NodeHelper.logBadConnectionWithTimer(url);
        liveURL = false;
      }
      return liveURL;
    };
  
    /**
     * handles different validityCheck for different node health endpoints
     * * `net_peerCount` should be > 0 (0x0 as a Hex Value). If it is === 0 then queries will timeout within ethers.js
     * * `net_peerCount` === 0 whenever the node has recently restarted.
     * * `eth_syncing` should be false. If not false then queries will fail within ethers.js
     * * `eth_syncing` is not false whenever the node is connected to a peer that is still syncing.
     * @param nodeMethod "net_peerCount" || "eth_syncing"
     * @param resultVal the result object from the nodeMethod json query
     * @returns true if valid node, false if invalid
     */
    static validityCheck = ({ nodeMethod, resultVal }: { nodeMethod: string; resultVal: string | boolean }) => {
      switch (nodeMethod) {
        case "net_peerCount":
          if (resultVal === ethers.utils.hexValue(0)) {
            return false;
          } else {
            return true;
          }
          break;
        case "eth_syncing":
          return resultVal === false;
          break;
        default:
          return false;
      }
    };
  }