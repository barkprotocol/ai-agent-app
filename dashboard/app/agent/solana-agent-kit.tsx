import bs58 from "bs58"
import type {
  CreateCollectionOptions,
  CreateSingleOptions,
  StoreInitOptions,
} from "@3land/listings-sdk/dist/types/implementation/implementationTypes"
import { type Connection, Keypair, type PublicKey } from "@solana/web3.js"
import type { Config } from "./config"
import { lendAsset } from "./lend-asset"
import { launchPumpFunToken, type PumpfunLaunchResponse, type PumpFunTokenOptions } from "./pumpfun-token"

export class SolanaSDK {
  private wallet: Keypair | null
  private wallet_address: PublicKey | null
  private connection: Connection
  private config: Config

  constructor(private_key: string | null, connection: Connection, configOrKey: Config | string | null) {
    this.connection = connection
    if (private_key) {
      this.wallet = Keypair.fromSecretKey(bs58.decode(private_key))
      this.wallet_address = this.wallet.publicKey
    } else {
      this.wallet = null
      this.wallet_address = null
    }

    if (typeof configOrKey === "string" || configOrKey === null) {
      this.config = { OPENAI_API_KEY: configOrKey || "" }
    } else {
      this.config = configOrKey
    }
  }

  private checkWalletAvailable(): boolean {
    if (!this.wallet || !this.wallet_address) {
      console.warn("Wallet not available. This operation requires a private key.")
      return false
    }
    return true
  }

  public async getBalance(): Promise<number | null> {
    if (!this.checkWalletAvailable()) return null
    return this.connection.getBalance(this.wallet_address!)
  }

  public async lendAsset(options: CreateSingleOptions): Promise<any | null> {
    if (!this.checkWalletAvailable()) return null
    return lendAsset(this.connection, this.wallet!, options)
  }

  public async launchPumpFunToken(options: PumpFunTokenOptions): Promise<PumpfunLaunchResponse | null> {
    if (!this.checkWalletAvailable()) return null
    return launchPumpFunToken(this.connection, this.wallet!, options)
  }

  // Add other methods here...
}

export default SolanaSDK

