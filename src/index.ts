import * as bip39 from 'bip39';
import * as EthWallet from './EthWallet';
import * as EthWallet2 from './EthWallet2';
import * as sigUtil from '@metamask/eth-sig-util';
import dotenv from "dotenv"
import { Wallet } from '@ethersproject/wallet';

dotenv.config()

const mnemonic  = process.env.MNEMONIC || "";
const pk1  = process.env.PRIVATE_KEY1 || "";
const pk2  = process.env.PRIVATE_KEY2 || "";


const message = 'HelloWorld';
(async () => {
  // const mnemonic = bip39.generateMnemonic();
  // const mnemonic = 'rifle price ranch issue mosquito fortune equip limb black one decorate order';

  const ethWallet1 = EthWallet.getEthWalletFromMonenic(mnemonic, 0);
  const ethWallet2 = EthWallet.getEthWalletFromMonenic(mnemonic, 1);

  const ethWallet11 = EthWallet.getEthWalletFromPrivateKey(pk1);
  const ethWallet21 = EthWallet.getEthWalletFromPrivateKey(pk2);

  console.log('EthWalletPublicKey', {
    address1: EthWallet.getAddress(ethWallet1),
    address11: EthWallet.getAddress(ethWallet11),
    address2: EthWallet.getAddress(ethWallet2),
    address21: EthWallet.getAddress(ethWallet21),
  });
  const signedMessage1 = sigUtil.personalSign({ privateKey: ethWallet1.getPrivateKey(), data: message})

  console.log('EthWalletPublicKey:signMessage', {
    signedMessage1
  });

  const ethWalletEtherJs1 = EthWallet2.getEthWalletFromMonenic(mnemonic);
  const ethWalletEtherJs2 = EthWallet2.getEthWalletFromMonenic(mnemonic, 1);
  const ethWalletEtherJs11 = EthWallet2.getEthWalletFromPrivateKey(pk1);
  const ethWalletEtherJs21 = EthWallet2.getEthWalletFromPrivateKey(pk2);

  const address1 = await ethWalletEtherJs1.getAddress();
  const address11 = await ethWalletEtherJs11.getAddress();
  const address2 = await ethWalletEtherJs2.getAddress();
  const address21 = await ethWalletEtherJs21.getAddress();

  console.log('EthWallet2PublicKey', {
    address1,
    address11,
    address2,
    address21,
  });

  // Even sign different, but verify is passed
  // https://etherscan.io/verifiedSignatures#
  const signedMessage = await ethWalletEtherJs1.signMessage(message)
  // const signedMessage2 = sigUtil.personalSign({ privateKey: toBuffer(ethWalletEtherJs1.privateKey), data: message})

  console.log('EthWallet2PublicKey:signMessage', {
    signedMessage,
    // signedMessage2
  });


  console.log("------------------------")
  console.log("Ether JS encrypt and decrypt method")
  const json = await ethWalletEtherJs1.encrypt("password")
  const decryptedFromJson = await Wallet.fromEncryptedJson(json, "password");
  console.log("EnDecrypted", {ethWalletEtherJs1: ethWalletEtherJs1.privateKey, decryptedFromJson: decryptedFromJson.privateKey})
})()