import * as bip39 from 'bip39';
import Wallet, { hdkey } from 'ethereumjs-wallet';
import { toBuffer } from 'ethereumjs-util';
const hdPathString = `m/44'/60'/0'/0`;

export const getEthWalletFromMonenic = (mnemonic: string, childNum: number): Wallet => {
  const seed = bip39.mnemonicToSeedSync(mnemonic);
  // console.log("getEthWalletFromMonenic:seed", { seed });
  const hdWallet = hdkey.fromMasterSeed(seed);
  // console.log("getEthWalletFromMonenic:hdWallet", { hdWallet });

  const root = hdWallet.derivePath(hdPathString);
  // console.log("getEthWalletFromMonenic:root", { root });

  const child = root.deriveChild(childNum);
  // console.log("getEthWalletFromMonenic:child", { child });

  return child.getWallet();
};

export const getEthWalletFromPrivateKey = (privateKey: string): Wallet => {
  return Wallet.fromPrivateKey(toBuffer(addHexPrefix(privateKey)));
};
export const getAddress = (wallet: Wallet) => {
  return addHexPrefix(wallet.getAddress().toString('hex'));
};

const addHexPrefix = (str: string) => {
  if (typeof str !== 'string' || str.match(/^-?0x/u)) {
    return str;
  }

  if (str.match(/^-?0X/u)) {
    return str.replace('0X', '0x');
  }

  if (str.startsWith('-')) {
    return str.replace('-', '-0x');
  }

  return `0x${str}`;
};