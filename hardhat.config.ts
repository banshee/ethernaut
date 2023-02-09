import { HardhatUserConfig } from "hardhat/config"
import "@nomiclabs/hardhat-ethers"
import "@typechain/hardhat"
import "@nomicfoundation/hardhat-chai-matchers"
import "tsconfig-paths/register"
import * as dotenv from "dotenv"
import path from "path"
import os from "os"

const settings = dotenv.config({ path: path.join(os.homedir(), ".secrets", "ethernaut.env") }).parsed!!

const config: HardhatUserConfig = {
  networks: {
    hardhat: {
      forking: {
        url: settings["alchemyGoerli"],
        blockNumber: 8459361,
        enabled: true,
      },
    },
    goerli: {
      url: settings["alchemyGoerli"],
    },
  },
  solidity: "0.8.17",
}
export default config
