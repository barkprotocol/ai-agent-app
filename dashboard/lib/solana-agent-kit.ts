import { Connection, Keypair, type PublicKey } from "@solana/web3.js"
import { BN } from "@coral-xyz/anchor"
import bs58 from "bs58"
import Decimal from "decimal.js"
import {
  CreateCollectionOptions,
  CreateSingleOptions,
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
  CollectionDeployment,
  CollectionOptions,
  GibworkCreateTaskReponse,
  JupiterTokenData,
  MintCollectionNFTResponse,
  PumpfunLaunchResponse,
  PumpFunTokenOptions,
  OrderParams,
  FlashTradeParams,
  FlashCloseTradeParams,
  HeliusWebhookIdResponse,
  HeliusWebhookResponse,
} from "@/app/types"
import {
  DasApiAsset,
  DasApiAssetList,
  GetAssetsByAuthorityRpcInput,
  GetAssetsByCreatorRpcInput,
  SearchAssetsRpcInput,
} from "@metaplex-foundation/digital-asset-standard-api"
import { Client } from "rpc-websockets/lib/client"

export class SolanaAgentKit {
  public connection: Connection
  public wallet: Keypair
  public wallet_address: PublicKey
  public config: Config

  constructor(private_key: string, rpc_url: string, configOrKey: Config | string | null) {
    this.connection = new Connection(rpc_url || "https://api.mainnet-beta.solana.com")
    this.wallet = Keypair.fromSecretKey(bs58.decode(private_key))
    this.wallet_address = this.wallet.publicKey

    if (typeof configOrKey === "string" || configOrKey === null) {
      this.config = { OPENAI_API_KEY: configOrKey || "" }
    } else {
      this.config = configOrKey
    }
  }

  // ... (all the methods from the provided code)
}

