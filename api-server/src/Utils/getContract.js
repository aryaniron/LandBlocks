import { getCCP } from "./buildCCP.js";
import { Wallets, Gateway } from "fabric-network";
import path from "path";
import { __dirname } from "./dirname.js";
import { buildWallet } from "./AppUtils.js";

export const getContract = async (chaincodeName, userId, org) => {
  const channelName = "mychannel";
  let num = Number(org.match(/\d/g).join(""));
  const ccp = getCCP(num);

  const walletPath = path.join(__dirname, "..", "wallets", `wallet-org${num}`);

  const wallet = await buildWallet(Wallets, walletPath);

  const gateway = new Gateway();

  await gateway.connect(ccp, {
    wallet,
    identity: userId,
    discovery: { enabled: true, asLocalhost: false },
    eventHandlerOptions: { strategy: null }, // using asLocalhost as this gateway is using a fabric network deployed locally
  });

  // Build a network instance based on the channel where the smart contract is deployed
  const network = await gateway.getNetwork(channelName);

  // Get the contract from the network.
  const contract = network.getContract(chaincodeName);
  return contract;
};

export const getIdentity = async ({ userId, org }) => {
  let num = Number(org.match(/\d/g).join(""));
  const walletPath = path.join(__dirname, "..", "wallets", `wallet-org${num}`);
  const wallet = await buildWallet(Wallets, walletPath);
  const identity = await wallet.get(userId);
  return identity;
};
