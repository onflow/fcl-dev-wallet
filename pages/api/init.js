import "../../src/config"
import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"
import {authz} from "../../src/authz"
import {FLOW_ENCODED_SERVICE_KEY} from "../../src/crypto"

const CONTRACT = `
pub contract FCL {
  pub let storagePath: StoragePath

  pub struct Account {
    pub let type: String
    pub let address: Address
    pub let keyId: Int
    pub var label: String

    init(_ address: Address) {
      self.type = "ACCOUNT"
      self.address = address
      self.keyId = 0
      self.label = ""
    }
  }

  pub resource Root {
    pub let key: [UInt8]
    pub let accounts: {Address: Account}

    init (_ key: String) {
      self.key = key.decodeHex()
      self.accounts = {}
    }

    pub fun add(_ acct: Account) {
      self.accounts[acct.address] = acct
    }
  }

  pub fun accounts(): {Address: Account} {
    return self.account.borrow<&Root>(from: self.storagePath)!.accounts
  }

  pub fun getServiceKey(): [UInt8] {
    return self.account.borrow<&Root>(from: self.storagePath)!.key
  }

  pub fun new(): AuthAccount {
    let acct = AuthAccount(payer: self.account)
    acct.addPublicKey(self.getServiceKey())

    self.account
      .borrow<&Root>(from: self.storagePath)!
      .add(Account(acct.address))

    return acct
  }

  init (key: String) {
    self.storagePath = /storage/FCL_DEV_WALLET
    self.account.save(<- create Root(key), to: self.storagePath)
    log(self.new())
    log(self.new())
    log(self.new())
  }
}
`.trim()

const CODE = `
transaction(code: String, key: String) {
  prepare(acct: AuthAccount) {
    acct.contracts.add(name: "FCL", code: code.decodeHex(), key: key)
  }
}
`.trim()

const init = async () => {
  try {
    // prettier-ignore
    const txId = await fcl.send([
      fcl.transaction(CODE),
      fcl.args([
        fcl.arg(Buffer.from(CONTRACT, "utf8").toString("hex"), t.String),
        fcl.arg(FLOW_ENCODED_SERVICE_KEY, t.String),
      ]),
      fcl.proposer(authz),
      fcl.payer(authz),
      fcl.authorizations([authz]),
      fcl.limit(90),
    ]).then(fcl.decode)
    console.log("TX", txId)
    const txStatus = await fcl.tx(txId).onceSealed()
    console.log("TX:SEALED", txStatus)

    fcl
      .account(process.env.FLOW_ACCOUNT_ADDRESS)
      .then(d => console.log("ACCOUNT", Object.keys(d.contracts)))
  } catch (error) {
    console.error("TX:ERROR", error)
  }
}

export default async (req, res) => {
  await init()

  res.status(200).json({
    foo: "bar",
  })
}
