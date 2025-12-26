import { Client, Wallet, xrpToDrops } from 'xrpl'

const XRPL_SERVER =
  import.meta.env.VITE_XRPL_WSS || 'wss://s.altnet.rippletest.net:51233'

export class CustomerXRPLService {
  private client: Client

  constructor() {
    this.client = new Client(XRPL_SERVER)
  }

  async connect() {
    if (!this.client.isConnected()) {
      await this.client.connect()
    }
  }

  async disconnect() {
    if (this.client.isConnected()) {
      await this.client.disconnect()
    }
  }

  async getAccountInfo(address: string) {
    await this.connect()
    try {
      const response = await this.client.request({
        command: 'account_info',
        account: address,
        ledger_index: 'validated',
      })
      return response.result
    } catch (error) {
      console.error('Error getting account info:', error)
      throw error
    }
  }

  async getTrustLines(address: string) {
    await this.connect()
    try {
      const response = await this.client.request({
        command: 'account_lines',
        account: address,
        ledger_index: 'validated',
      })
      return response.result.lines
    } catch (error) {
      console.error('Error getting trust lines:', error)
      return []
    }
  }

  async createTrustLine(
    customerWallet: Wallet,
    issuerAddress: string,
    currency: string,
    limit: string = '1000000'
  ) {
    await this.connect()

    const trustSet = {
      TransactionType: 'TrustSet' as const,
      Account: customerWallet.address,
      LimitAmount: {
        currency: currency,
        issuer: issuerAddress,
        value: limit,
      },
    }

    try {
      const prepared = await this.client.autofill(trustSet)
      const signed = customerWallet.sign(prepared)
      const result = await this.client.submitAndWait(signed.tx_blob)
      return result
    } catch (error) {
      console.error('Error creating trust line:', error)
      throw error
    }
  }

  async getTransactionHistory(address: string, limit: number = 20) {
    await this.connect()
    try {
      const response = await this.client.request({
        command: 'account_tx',
        account: address,
        ledger_index_min: -1,
        ledger_index_max: -1,
        limit: limit,
      })
      return response.result.transactions
    } catch (error) {
      console.error('Error getting transaction history:', error)
      return []
    }
  }

  async sendPayment(
    wallet: Wallet,
    destination: string,
    amount: string,
    currency?: string,
    issuer?: string
  ) {
    await this.connect()

    const payment: any = {
      TransactionType: 'Payment',
      Account: wallet.address,
      Destination: destination,
      Amount: currency
        ? {
            currency: currency,
            value: amount,
            issuer: issuer,
          }
        : xrpToDrops(amount),
    }

    try {
      const prepared = await this.client.autofill(payment)
      const signed = wallet.sign(prepared)
      const result = await this.client.submitAndWait(signed.tx_blob)
      return result
    } catch (error) {
      console.error('Error sending payment:', error)
      throw error
    }
  }
}

export const xrplService = new CustomerXRPLService()
