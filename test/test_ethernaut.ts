import { Force__factory, ForcePushEth__factory } from "typechain-types"
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

    // const forceContract = await new Force__factory(initialDeployer).deploy()
    const forceContract = await Force__factory.connect(settings["instanceAddr"], mySigner)
    const forcePushEthContract = await new ForcePushEth__factory(mySigner).deploy()

    expect(await hardhat.ethers.provider.getBalance(forceContract.address)).to.eq(0)
    await forcePushEthContract.boom(forceContract.address, { value: BigNumber.from(1) }).then(x => x.wait())
    expect(await hardhat.ethers.provider.getBalance(forceContract.address)).to.eq(1)
  })
})