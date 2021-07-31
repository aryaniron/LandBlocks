import { Wallets } from "fabric-network";
import FabricCAServices from "fabric-ca-client";
import { __dirname } from "./dirname.js";

import {
  buildCAClient,
  registerAndEnrollUser,
  enrollAdmin,
  isUserRegistered,
} from "./CAUtil.js";
import {
  buildCCPOrg1,
  buildCCPOrg2,
  buildWallet,
  buildCCPOrg3,
} from "./AppUtils.js";

import { getCCP } from "./buildCCP.js";
import path from "path";

export const registerUser = async ({ OrgMSP, userId }) => {
  let org = Number(OrgMSP.match(/\d/g).join(""));
  let ccp = getCCP(org);
  const caClient = buildCAClient(
    FabricCAServices,
    ccp,
    `ca.org${org}.example.com`
  );
  const walletPath = path.join(__dirname, "..", "wallets", `wallet-org${org}`);

  // setup the wallet to hold the credentials of the application user
  const wallet = await buildWallet(Wallets, walletPath);

  // in a real application this would be done on an administrative flow, and only once
  await enrollAdmin(caClient, wallet, OrgMSP);

  // in a real application this would be done only when a new user was required to be added
  // and would be part of an administrative flow
  let response = await registerAndEnrollUser(
    caClient,
    wallet,
    OrgMSP,
    userId,
    `org${org}.department1`
  );

  return response;
};

export const userLoginAndEnroll = async ({ OrgMSP, userId }) => {
  // setup the wallet to hold the credentials of the application user
  let org = Number(OrgMSP.match(/\d/g).join(""));

  const walletPath = path.join(__dirname, "..", "wallets", `wallet-org${org}`);

  const wallet = await buildWallet(Wallets, walletPath);

  let response = await isUserRegistered(wallet, userId);

  return response;
};

export const adminRegister = async () => {
  let ccp = getCCP(2);
  const caClient = buildCAClient(FabricCAServices, ccp, `ca.org2.example.com`);
  const walletPath = path.join(__dirname, "..", "wallets", `wallet-org2`);
  // setup the wallet to hold the credentials of the application user
  const wallet = await buildWallet(Wallets, walletPath);

  let response = await enrollAdmin(caClient, wallet, "Org2MSP");
  return response;
};
