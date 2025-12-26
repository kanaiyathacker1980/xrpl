import { Client, Wallet, xrpToDrops } from 'xrpl'

const XRPL_SERVER =
  import.meta.env.VITE_XRPL_WSS || 'wss://hooks-testnet-v3.xrpl-labs.com'

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

  async sendPaymentWithMemo(
    wallet: Wallet,
    destination: string,
    amount: string,
    memo: string
  ) {
    await this.connect()

    const payment: any = {
      TransactionType: 'Payment',
      Account: wallet.address,
      Destination: destination,
      Amount: xrpToDrops(amount),
      Memos: [
        {
          Memo: {
            MemoData: Buffer.from(memo).toString('hex'),
          },
        },
      ],
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
