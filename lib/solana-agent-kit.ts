import { type Connection, Keypair, type PublicKey } from "@solana/web3.js"
import { BN } from "@coral-xyz/anchor"
import bs58 from "bs58"
import Decimal from "decimal.js"
import {
  type CreateCollectionOptions,
  type CreateSingleOptions,
  StoreInitOptions,
} from "@3land/listings-sdk/dist/types/implementation/implementationTypes"
import { DEFAULT_OPTIONS } from "@/components/constants"
import {
  deploy_collection,
  deploy_token,
  get_balance,
  get_balance_other,
  getTPS,
  resolveSolDomain,
  getPrimaryDomain,
  launchPumpFunToken,
  lendAsset,
  luloLend,
  luloWithdraw,
  mintCollectionNFT,
  openbookCreateMarket,
  manifestCreateMarket,
  raydiumCreateAmmV4,
  raydiumCreateClmm,
  raydiumCreateCpmm,
  registerDomain,
  request_faucet_funds,
  trade,
  limitOrder,
  batchOrder,
  cancelAllOrders,
  withdrawAll,
  closePerpTradeShort,
  closePerpTradeLong,
  openPerpTradeShort,
  openPerpTradeLong,
  transfer,
  getTokenDataByAddress,
  getTokenDataByTicker,
  stakeWithJup,
  stakeWithSolayer,
  sendCompressedAirdrop,
  orcaCreateSingleSidedLiquidityPool,
  orcaCreateCLMM,
  orcaOpenCenteredPositionWithLiquidity,
  orcaOpenSingleSidedPosition,
  FEE_TIERS,
  fetchPrice,
  getAllDomainsTLDs,
  getAllRegisteredAllDomains,
  getOwnedDomainsForTLD,
  getMainAllDomainsDomain,
  getOwnedAllDomains,
  resolveAllDomains,
  create_gibwork_task,
  orcaClosePosition,
  orcaFetchPositions,
  rock_paper_scissor,
  create_TipLink,
  listNFTForSale,
  cancelListing,
  closeEmptyTokenAccounts,
  fetchTokenReportSummary,
  fetchTokenDetailedReport,
  fetchPythPrice,
  fetchPythPriceFeedID,
  flashOpenTrade,
  flashCloseTrade,
  createMeteoraDynamicAMMPool,
  createMeteoraDlmmPool,
  createCollection,
  createSingle,
  multisig_transfer_from_treasury,
  create_squads_multisig,
  multisig_create_proposal,
  multisig_deposit_to_treasury,
  multisig_reject_proposal,
  multisig_approve_proposal,
  multisig_execute_proposal,
  parseTransaction,
  sendTransactionWithPriorityFee,
  getAssetsByOwner,
  getHeliusWebhook,
  create_HeliusWebhook,
  deleteHeliusWebhook,
  createDriftUserAccount,
  createVault,
  depositIntoVault,
  depositToDriftUserAccount,
  getVaultAddress,
  doesUserHaveDriftAccount,
  driftUserAccountInfo,
  requestWithdrawalFromVault,
  tradeDriftVault,
  driftPerpTrade,
  updateVault,
  getVaultInfo,
  withdrawFromDriftUserAccount,
  withdrawFromDriftVault,
  updateVaultDelegate,
  get_token_balance,
  getAvailableDriftSpotMarkets,
  getAvailableDriftPerpMarkets,
  stakeToDriftInsuranceFund,
  requestUnstakeFromDriftInsuranceFund,
  unstakeFromDriftInsuranceFund,
  swapSpotToken,
  calculatePerpMarketFundingRate,
  getEntryQuoteOfPerpTrade,
  getLendingAndBorrowAPY,
  voltrGetPositionValues,
  voltrDepositStrategy,
  voltrWithdrawStrategy,
  get_asset,
  get_assets_by_authority,
  get_assets_by_creator,
  search_assets,
} from "@/app/tools"
import {
  type Config,
  TokenCheck,
  type CollectionDeployment,
  type CollectionOptions,
  type GibworkCreateTaskReponse,
  type JupiterTokenData,
  type MintCollectionNFTResponse,
  type PumpfunLaunchResponse,
  type PumpFunTokenOptions,
  type OrderParams,
  type FlashTradeParams,
  type FlashCloseTradeParams,
  type HeliusWebhookIdResponse,
  type HeliusWebhookResponse,
} from "@/app/types"
import type {
  DasApiAsset,
  DasApiAssetList,
  GetAssetsByAuthorityRpcInput,
  GetAssetsByCreatorRpcInput,
  SearchAssetsRpcInput,
} from "@metaplex-foundation/digital-asset-standard-api"
import { Client } from "rpc-websockets/lib/client"

export class SolanaAgentKit {
  public connection: Connection
  public wallet: Keypair | null
  public wallet_address: PublicKey | null
  public config: Config

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

  public async get_balance_other(publicKey: PublicKey): Promise<number> {
    return this.connection.getBalance(publicKey)
  }

  public async getTPS(): Promise<number> {
    return getTPS(this.connection)
  }

  public async resolveSolDomain(domain: string): Promise<string | null> {
    return resolveSolDomain(this.connection, domain)
  }

  public async getPrimaryDomain(address: PublicKey): Promise<string | null> {
    return getPrimaryDomain(this.connection, address)
  }

  public async launchPumpFunToken(options: PumpFunTokenOptions): Promise<PumpfunLaunchResponse | null> {
    if (!this.checkWalletAvailable()) return null
    return launchPumpFunToken(this.connection, this.wallet, options)
  }

  public async lendAsset(options: any): Promise<any> {
    if (!this.checkWalletAvailable()) return null
    return lendAsset(this.connection, this.wallet, options)
  }

  public async luloLend(options: any): Promise<any> {
    if (!this.checkWalletAvailable()) return null
    return luloLend(this.connection, this.wallet, options)
  }

  public async luloWithdraw(options: any): Promise<any> {
    if (!this.checkWalletAvailable()) return null
    return luloWithdraw(this.connection, this.wallet, options)
  }

  public async mintCollectionNFT(options: CreateCollectionOptions): Promise<MintCollectionNFTResponse | null> {
    if (!this.checkWalletAvailable()) return null
    return mintCollectionNFT(this.connection, this.wallet, options)
  }

  public async openbookCreateMarket(options: any): Promise<any> {
    if (!this.checkWalletAvailable()) return null
    return openbookCreateMarket(this.connection, this.wallet, options)
  }

  public async manifestCreateMarket(options: any): Promise<any> {
    if (!this.checkWalletAvailable()) return null
    return manifestCreateMarket(this.connection, this.wallet, options)
  }

  public async raydiumCreateAmmV4(options: any): Promise<any> {
    if (!this.checkWalletAvailable()) return null
    return raydiumCreateAmmV4(this.connection, this.wallet, options)
  }

  public async raydiumCreateClmm(options: any): Promise<any> {
    if (!this.checkWalletAvailable()) return null
    return raydiumCreateClmm(this.connection, this.wallet, options)
  }

  public async raydiumCreateCpmm(options: any): Promise<any> {
    if (!this.checkWalletAvailable()) return null
    return raydiumCreateCpmm(this.connection, this.wallet, options)
  }

  public async registerDomain(domain: string): Promise<string | null> {
    if (!this.checkWalletAvailable()) return null
    return registerDomain(this.connection, this.wallet, domain)
  }

  public async request_faucet_funds(address: PublicKey): Promise<void> {
    return request_faucet_funds(address)
  }

  public async trade(options: OrderParams): Promise<any> {
    if (!this.checkWalletAvailable()) return null
    return trade(this.connection, this.wallet, options)
  }

  public async limitOrder(options: OrderParams): Promise<any> {
    if (!this.checkWalletAvailable()) return null
    return limitOrder(this.connection, this.wallet, options)
  }

  public async batchOrder(options: OrderParams[]): Promise<any> {
    if (!this.checkWalletAvailable()) return null
    return batchOrder(this.connection, this.wallet, options)
  }

  public async cancelAllOrders(options: any): Promise<any> {
    if (!this.checkWalletAvailable()) return null
    return cancelAllOrders(this.connection, this.wallet, options)
  }

  public async withdrawAll(options: any): Promise<any> {
    if (!this.checkWalletAvailable()) return null
    return withdrawAll(this.connection, this.wallet, options)
  }

  public async closePerpTradeShort(options: any): Promise<any> {
    if (!this.checkWalletAvailable()) return null
    return closePerpTradeShort(this.connection, this.wallet, options)
  }

  public async closePerpTradeLong(options: any): Promise<any> {
    if (!this.checkWalletAvailable()) return null
    return closePerpTradeLong(this.connection, this.wallet, options)
  }

  public async openPerpTradeShort(options: any): Promise<any> {
    if (!this.checkWalletAvailable()) return null
    return openPerpTradeShort(this.connection, this.wallet, options)
  }

  public async openPerpTradeLong(options: any): Promise<any> {
    if (!this.checkWalletAvailable()) return null
    return openPerpTradeLong(this.connection, this.wallet, options)
  }

  public async transfer(destination: PublicKey, lamports: number): Promise<string | null> {
    if (!this.checkWalletAvailable()) return null
    return transfer(this.connection, this.wallet, destination, lamports)
  }

  public async getTokenDataByAddress(address: string): Promise<JupiterTokenData | null> {
    return getTokenDataByAddress(address)
  }

  public async getTokenDataByTicker(ticker: string): Promise<JupiterTokenData | null> {
    return getTokenDataByTicker(ticker)
  }

  public async stakeWithJup(options: any): Promise<any> {
    if (!this.checkWalletAvailable()) return null
    return stakeWithJup(this.connection, this.wallet, options)
  }

  public async stakeWithSolayer(options: any): Promise<any> {
    if (!this.checkWalletAvailable()) return null
    return stakeWithSolayer(this.connection, this.wallet, options)
  }

  public async sendCompressedAirdrop(address: PublicKey, lamports: number): Promise<void> {
    return sendCompressedAirdrop(address, lamports)
  }

  public async orcaCreateSingleSidedLiquidityPool(options: any): Promise<any> {
    if (!this.checkWalletAvailable()) return null
    return orcaCreateSingleSidedLiquidityPool(this.connection, this.wallet, options)
  }

  public async orcaCreateCLMM(options: any): Promise<any> {
    if (!this.checkWalletAvailable()) return null
    return orcaCreateCLMM(this.connection, this.wallet, options)
  }

  public async orcaOpenCenteredPositionWithLiquidity(options: any): Promise<any> {
    if (!this.checkWalletAvailable()) return null
    return orcaOpenCenteredPositionWithLiquidity(this.connection, this.wallet, options)
  }

  public async orcaOpenSingleSidedPosition(options: any): Promise<any> {
    if (!this.checkWalletAvailable()) return null
    return orcaOpenSingleSidedPosition(this.connection, this.wallet, options)
  }

  public async fetchPrice(options: any): Promise<any> {
    return fetchPrice(options)
  }

  public async getAllDomainsTLDs(): Promise<string[]> {
    return getAllDomainsTLDs()
  }

  public async getAllRegisteredAllDomains(): Promise<any> {
    return getAllRegisteredAllDomains()
  }

  public async getOwnedDomainsForTLD(tld: string): Promise<any> {
    return getOwnedDomainsForTLD(tld)
  }

  public async getMainAllDomainsDomain(): Promise<any> {
    return getMainAllDomainsDomain()
  }

  public async getOwnedAllDomains(): Promise<any> {
    return getOwnedAllDomains()
  }

  public async resolveAllDomains(domain: string): Promise<any> {
    return resolveAllDomains(domain)
  }

  public async create_gibwork_task(options: any): Promise<GibworkCreateTaskReponse | null> {
    if (!this.checkWalletAvailable()) return null
    return create_gibwork_task(this.connection, this.wallet, options)
  }

  public async orcaClosePosition(options: any): Promise<any> {
    if (!this.checkWalletAvailable()) return null
    return orcaClosePosition(this.connection, this.wallet, options)
  }

  public async orcaFetchPositions(options: any): Promise<any> {
    if (!this.checkWalletAvailable()) return null
    return orcaFetchPositions(this.connection, this.wallet, options)
  }

  public async rock_paper_scissor(options: any): Promise<any> {
    if (!this.checkWalletAvailable()) return null
    return rock_paper_scissor(this.connection, this.wallet, options)
  }

  public async create_TipLink(options: any): Promise<any> {
    if (!this.checkWalletAvailable()) return null
    return create_TipLink(this.connection, this.wallet, options)
  }

  public async listNFTForSale(options: any): Promise<any> {
    if (!this.checkWalletAvailable()) return null
    return listNFTForSale(this.connection, this.wallet, options)
  }

  public async cancelListing(options: any): Promise<any> {
    if (!this.checkWalletAvailable()) return null
    return cancelListing(this.connection, this.wallet, options)
  }

  public async closeEmptyTokenAccounts(): Promise<any> {
    if (!this.checkWalletAvailable()) return null
    return closeEmptyTokenAccounts(this.connection, this.wallet)
  }

  public async fetchTokenReportSummary(options: any): Promise<any> {
    return fetchTokenReportSummary(options)
  }

  public async fetchTokenDetailedReport(options: any): Promise<any> {
    return fetchTokenDetailedReport(options)
  }

  public async fetchPythPrice(options: any): Promise<any> {
    return fetchPythPrice(options)
  }

  public async fetchPythPriceFeedID(options: any): Promise<any> {
    return fetchPythPriceFeedID(options)
  }

  public async flashOpenTrade(options: FlashTradeParams): Promise<any> {
    if (!this.checkWalletAvailable()) return null
    return flashOpenTrade(this.connection, this.wallet, options)
  }

  public async flashCloseTrade(options: FlashCloseTradeParams): Promise<any> {
    if (!this.checkWalletAvailable()) return null
    return flashCloseTrade(this.connection, this.wallet, options)
  }

  public async createMeteoraDynamicAMMPool(options: any): Promise<any> {
    if (!this.checkWalletAvailable()) return null
    return createMeteoraDynamicAMMPool(this.connection, this.wallet, options)
  }

  public async createMeteoraDlmmPool(options: any): Promise<any> {
    if (!this.checkWalletAvailable()) return null
    return createMeteoraDlmmPool(this.connection, this.wallet, options)
  }

  public async createCollection(options: CreateCollectionOptions): Promise<any> {
    if (!this.checkWalletAvailable()) return null
    return createCollection(this.connection, this.wallet, options)
  }

  public async createSingle(options: CreateSingleOptions): Promise<any> {
    if (!this.checkWalletAvailable()) return null
    return createSingle(this.connection, this.wallet, options)
  }

  public async multisig_transfer_from_treasury(options: any): Promise<any> {
    if (!this.checkWalletAvailable()) return null
    return multisig_transfer_from_treasury(this.connection, this.wallet, options)
  }

  public async create_squads_multisig(options: any): Promise<any> {
    if (!this.checkWalletAvailable()) return null
    return create_squads_multisig(this.connection, this.wallet, options)
  }

  public async multisig_create_proposal(options: any): Promise<any> {
    if (!this.checkWalletAvailable()) return null
    return multisig_create_proposal(this.connection, this.wallet, options)
  }

  public async multisig_deposit_to_treasury(options: any): Promise<any> {
    if (!this.checkWalletAvailable()) return null
    return multisig_deposit_to_treasury(this.connection, this.wallet, options)
  }

  public async multisig_reject_proposal(options: any): Promise<any> {
    if (!this.checkWalletAvailable()) return null
    return multisig_reject_proposal(this.connection, this.wallet, options)
  }

  public async multisig_approve_proposal(options: any): Promise<any> {
    if (!this.checkWalletAvailable()) return null
    return multisig_approve_proposal(this.connection, this.wallet, options)
  }

  public async multisig_execute_proposal(options: any): Promise<any> {
    if (!this.checkWalletAvailable()) return null
    return multisig_execute_proposal(this.connection, this.wallet, options)
  }

  public async parseTransaction(options: any): Promise<any> {
    return parseTransaction(options)
  }

  public async sendTransactionWithPriorityFee(options: any): Promise<any> {
    if (!this.checkWalletAvailable()) return null
    return sendTransactionWithPriorityFee(this.connection, this.wallet, options)
  }

  public async getAssetsByOwner(options: GetAssetsByAuthorityRpcInput): Promise<DasApiAssetList | null> {
    return getAssetsByOwner(options)
  }

  public async getHeliusWebhook(options: any): Promise<HeliusWebhookResponse | null> {
    return getHeliusWebhook(options)
  }

  public async create_HeliusWebhook(options: any): Promise<HeliusWebhookIdResponse | null> {
    if (!this.checkWalletAvailable()) return null
    return create_HeliusWebhook(this.connection, this.wallet, options)
  }

  public async deleteHeliusWebhook(options: any): Promise<boolean | null> {
    if (!this.checkWalletAvailable()) return null
    return deleteHeliusWebhook(this.connection, this.wallet, options)
  }

  public async createDriftUserAccount(options: any): Promise<any> {
    if (!this.checkWalletAvailable()) return null
    return createDriftUserAccount(this.connection, this.wallet, options)
  }

  public async createVault(options: any): Promise<any> {
    if (!this.checkWalletAvailable()) return null
    return createVault(this.connection, this.wallet, options)
  }

  public async depositIntoVault(options: any): Promise<any> {
    if (!this.checkWalletAvailable()) return null
    return depositIntoVault(this.connection, this.wallet, options)
  }

  public async depositToDriftUserAccount(options: any): Promise<any> {
    if (!this.checkWalletAvailable()) return null
    return depositToDriftUserAccount(this.connection, this.wallet, options)
  }

  public async getVaultAddress(options: any): Promise<any> {
    return getVaultAddress(options)
  }

  public async doesUserHaveDriftAccount(options: any): Promise<any> {
    return doesUserHaveDriftAccount(options)
  }

  public async driftUserAccountInfo(options: any): Promise<any> {
    return driftUserAccountInfo(options)
  }

  public async requestWithdrawalFromVault(options: any): Promise<any> {
    if (!this.checkWalletAvailable()) return null
    return requestWithdrawalFromVault(this.connection, this.wallet, options)
  }

  public async tradeDriftVault(options: any): Promise<any> {
    if (!this.checkWalletAvailable()) return null
    return tradeDriftVault(this.connection, this.wallet, options)
  }

  public async driftPerpTrade(options: any): Promise<any> {
    if (!this.checkWalletAvailable()) return null
    return driftPerpTrade(this.connection, this.wallet, options)
  }

  public async updateVault(options: any): Promise<any> {
    if (!this.checkWalletAvailable()) return null
    return updateVault(this.connection, this.wallet, options)
  }

  public async getVaultInfo(options: any): Promise<any> {
    return getVaultInfo(options)
  }

  public async withdrawFromDriftUserAccount(options: any): Promise<any> {
    if (!this.checkWalletAvailable()) return null
    return withdrawFromDriftUserAccount(this.connection, this.wallet, options)
  }

  public async withdrawFromDriftVault(options: any): Promise<any> {
    if (!this.checkWalletAvailable()) return null
    return withdrawFromDriftVault(this.connection, this.wallet, options)
  }

  public async updateVaultDelegate(options: any): Promise<any> {
    if (!this.checkWalletAvailable()) return null
    return updateVaultDelegate(this.connection, this.wallet, options)
  }

  public async get_token_balance(options: any): Promise<any> {
    if (!this.checkWalletAvailable()) return null
    return get_token_balance(this.connection, this.wallet, options)
  }

  public async getAvailableDriftSpotMarkets(): Promise<any> {
    return getAvailableDriftSpotMarkets()
  }

  public async getAvailableDriftPerpMarkets(): Promise<any> {
    return getAvailableDriftPerpMarkets()
  }

  public async stakeToDriftInsuranceFund(options: any): Promise<any> {
    if (!this.checkWalletAvailable()) return null
    return stakeToDriftInsuranceFund(this.connection, this.wallet, options)
  }

  public async requestUnstakeFromDriftInsuranceFund(options: any): Promise<any> {
    if (!this.checkWalletAvailable()) return null
    return requestUnstakeFromDriftInsuranceFund(this.connection, this.wallet, options)
  }

  public async unstakeFromDriftInsuranceFund(options: any): Promise<any> {
    if (!this.checkWalletAvailable()) return null
    return unstakeFromDriftInsuranceFund(this.connection, this.wallet, options)
  }

  public async swapSpotToken(options: any): Promise<any> {
    if (!this.checkWalletAvailable()) return null
    return swapSpotToken(this.connection, this.wallet, options)
  }

  public async calculatePerpMarketFundingRate(options: any): Promise<any> {
    return calculatePerpMarketFundingRate(options)
  }

  public async getEntryQuoteOfPerpTrade(options: any): Promise<any> {
    return getEntryQuoteOfPerpTrade(options)
  }

  public async getLendingAndBorrowAPY(options: any): Promise<any> {
    return getLendingAndBorrowAPY(options)
  }

  public async voltrGetPositionValues(options: any): Promise<any> {
    if (!this.checkWalletAvailable()) return null
    return voltrGetPositionValues(this.connection, this.wallet, options)
  }

  public async voltrDepositStrategy(options: any): Promise<any> {
    if (!this.checkWalletAvailable()) return null
    return voltrDepositStrategy(this.connection, this.wallet, options)
  }

  public async voltrWithdrawStrategy(options: any): Promise<any> {
    if (!this.checkWalletAvailable()) return null
    return voltrWithdrawStrategy(this.connection, this.wallet, options)
  }

  public async get_asset(options: any): Promise<DasApiAsset | null> {
    return get_asset(options)
  }

  public async get_assets_by_authority(options: GetAssetsByAuthorityRpcInput): Promise<DasApiAssetList | null> {
    return get_assets_by_authority(options)
  }

  public async get_assets_by_creator(options: GetAssetsByCreatorRpcInput): Promise<DasApiAssetList | null> {
    return get_assets_by_creator(options)
  }

  public async search_assets(options: SearchAssetsRpcInput): Promise<DasApiAssetList | null> {
    return search_assets(options)
  }

  public async deploy_collection(options: CollectionOptions): Promise<CollectionDeployment | null> {
    if (!this.checkWalletAvailable()) return null
    return deploy_collection(this.connection, this.wallet, options)
  }

  public async deploy_token(options: any): Promise<any> {
    if (!this.checkWalletAvailable()) return null
    return deploy_token(this.connection, this.wallet, options)
  }
}

