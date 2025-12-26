import { Client, Wallet, SetHookFlags } from 'xrpl'

export interface HookDefinition {
  name: string
  wasm: string
  hash: string
  parameters?: HookParameter[]
}

export interface HookParameter {
  name: string
  value: string
}

export class XRPLHooksService {
  private client: Client | null = null
  private wallet: Wallet | null = null

  async connect(wssUrl: string) {
    this.client = new Client(wssUrl)
    await this.client.connect()
  }

  async disconnect() {
    if (this.client?.isConnected()) {
      await this.client.disconnect()
    }
  }

  setWallet(seed: string) {
    this.wallet = Wallet.fromSeed(seed)
  }

  async deployHook(hook: HookDefinition): Promise<string> {
    if (!this.client || !this.wallet) {
      throw new Error('Client or wallet not initialized')
    }

    const hookTx = {
      TransactionType: 'SetHook',
      Account: this.wallet.address,
      Hooks: [
        {
          Hook: {
            CreateCode: hook.wasm,
            HookOn: '0000000000000000',
            HookNamespace: Buffer.from(hook.name).toString('hex'),
            HookApiVersion: 0,
            Flags: SetHookFlags.hsfOverride,
            HookParameters: hook.parameters?.map((p) => ({
              HookParameter: {
                HookParameterName: Buffer.from(p.name).toString('hex'),
                HookParameterValue: Buffer.from(p.value).toString('hex'),
              },
            })),
          },
        },
      ],
    }

    const prepared = await this.client.autofill(hookTx)
    const signed = this.wallet.sign(prepared)
    const result = await this.client.submitAndWait(signed.tx_blob)

    if (result.result.meta && typeof result.result.meta !== 'string') {
      const hookHash =
        result.result.meta.HookExecutions?.[0]?.HookExecution?.HookHash
      return hookHash || hook.hash
    }

    return hook.hash
  }

  async getHookState(hookHash: string, key: string): Promise<string | null> {
    if (!this.client || !this.wallet) {
      throw new Error('Client or wallet not initialized')
    }

    try {
      const response = await this.client.request({
        command: 'account_namespace',
        account: this.wallet.address,
        namespace_id: hookHash,
      })

      const entries = response.result.namespace_entries || []
      const entry = entries.find(
        (e: any) => e.LedgerEntryType === 'HookState' && e.HookStateKey === key
      )

      return entry?.HookStateData || null
    } catch (error) {
      console.error('Error fetching hook state:', error)
      return null
    }
  }

  async invokeHook(
    destination: string,
    amount: string,
    memo?: string
  ): Promise<string> {
    if (!this.client || !this.wallet) {
      throw new Error('Client or wallet not initialized')
    }

    const payment = {
      TransactionType: 'Payment',
      Account: this.wallet.address,
      Destination: destination,
      Amount: amount,
      Memos: memo
        ? [
            {
              Memo: {
                MemoData: Buffer.from(memo).toString('hex'),
              },
            },
          ]
        : undefined,
    }

    const prepared = await this.client.autofill(payment)
    const signed = this.wallet.sign(prepared)
    const result = await this.client.submitAndWait(signed.tx_blob)

    return result.result.hash
  }

  async getHookExecutions(txHash: string): Promise<any[]> {
    if (!this.client) {
      throw new Error('Client not initialized')
    }

    const response = await this.client.request({
      command: 'tx',
      transaction: txHash,
    })

    if (response.result.meta && typeof response.result.meta !== 'string') {
      return response.result.meta.HookExecutions || []
    }

    return []
  }
}

export const xrplHooksService = new XRPLHooksService()
