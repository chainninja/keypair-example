import { Wallet } from '@ethersproject/wallet';

const hdPathString = `m/44'/60'/0'/0`;
const defaultPath = `m/44'/60'/0'/0/0`

export const getEthWalletFromMonenic = (mnemonic: string, childNum?: number): Wallet => {
  const path = childNum ? `${hdPathString}/${childNum}` : defaultPath;
  // console.log("path", {path})
  return Wallet.fromMnemonic(mnemonic, path)
  // console.log("getEthWalletFromMonenic:child", { child });
};


export const getEthWalletFromPrivateKey = (privateKey: string): Wallet => {
  // console.log("path", {path})
  return new Wallet(privateKey)
  // console.log("getEthWalletFromMonenic:child", { child });
};
