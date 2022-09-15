import AWS from 'aws-sdk';
import * as EthWallet2 from './EthWallet2';
import dotenv from "dotenv"
import * as bip39 from 'bip39';

dotenv.config()

const mnemonic  = process.env.MNEMONIC || bip39.generateMnemonic();
const ethWalletEtherJs1 = EthWallet2.getEthWalletFromMonenic(mnemonic);
const privateKey = ethWalletEtherJs1.privateKey

// let encryptedPrivateKey: AWS.KMS.CiphertextType | undefined;
console.log({ privateKey });

const kms = new AWS.KMS({
  region: 'us-east-1',
});


// 1. How to create a Session Token
// const sts = new AWS.STS({apiVersion: '2011-06-15', region: 'us-east-1',});
// sts.getSessionToken((err, data) => {
//   console.log("This is Session Token ", {err, data})
// });

// 2. How to create a KMS Custom Key
// kms.createKey((err, data) => {
//   console.log("This is the call back ", {err, data})
// })


// How to encrypt and decrypt
const paramsForEncrypt = {
  // aws kms create-key --description carmen-Test-key --region us-east-1 --profile carmen@personal
  KeyId: 'get the key ID from step 2',
  Plaintext: privateKey,
};

function encryptPrivateKey(params: any) {
  return kms.encrypt(params).promise();
}

const paramsForDecrypt = (blob: any) => ({
  // fetch encrypted private key from database
  CiphertextBlob: blob,
});

function decryptPrivateKey(params: any) {
  // console.log('decryptPrivateKey', { params });
  return kms.decrypt(params).promise();
}

encryptPrivateKey(paramsForEncrypt)
  .then(({ CiphertextBlob }) => {
    // It doing the decrypt after encrypt, but what we can do is to store the encrypted Key somewhere, and then we can decrypt it.
    if(!CiphertextBlob) {
      return;
    }
    const BlobString = CiphertextBlob.toString('hex');
    console.log("Encrypted", { CiphertextBlob, BlobString })
    const bufferBack = Buffer.from(BlobString, 'hex')
    decryptPrivateKey(paramsForDecrypt(bufferBack))
      .then((data) => {
        const { Plaintext } = data;
        const returnPK = Plaintext?.toString()
        console.log('decryptPrivateKey', { Plaintext, returnPK });
      })
      .catch((e) => {
        console.log(e);
      });
  })
  .catch((e) => {
    console.log(e);
  });
