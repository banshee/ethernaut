import { DeterminedKing__factory, King__factory } from "typechain-types"
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

    const mySigner = new Wallet(settings["privatekey"], hardhat.ethers.provider)

    // const kingContract = await new King__factory(initialDeployer).deploy()
    const kingContract = King__factory.connect(settings["instanceAddr"], mySigner)
    const determinedKingContract = await new DeterminedKing__factory(mySigner).deploy(kingContract.address, { value: 1 })
    await determinedKingContract.deployed()
    const king = await kingContract._king()

    expect(king).to.eql(determinedKingContract.address)
    // await initialDeployer.sendTransaction({ to: kingContract.address, value: 1 }).then(x => x.wait())
    // expect(await kingContract._king()).to.eql(initialDeployer.address)
  })
})