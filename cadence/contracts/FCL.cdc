access(all) contract FCL {
  access(all) let storagePath: StoragePath

  access(all) struct FCLAccount {
    access(all) let type: String
    access(all) let address: Address
    access(all) let keyId: Int
    access(all) var label: String
    access(all) var scopes: [String]

    init(address: Address, label: String, scopes: [String]) {
      self.type = "ACCOUNT"
      self.address = address
      self.keyId = 0
      self.label = label
      self.scopes = scopes
    }

    access(all) fun update(label: String, scopes: [String]) {
      self.label = label
      self.scopes = scopes
    }
  }

  access(all) resource Root {
    access(all) let key: [UInt8]
    access(all) let accounts: {Address: FCLAccount}

    init (_ key: String) {
      self.key = key.decodeHex()
      self.accounts = {}
    }

    access(all) fun add(_ acct: FCLAccount) {
      self.accounts[acct.address] = acct
    }

    access(all) fun update(address: Address, label: String, scopes: [String]) {
      let acct = self.accounts[address]
      acct!.update(label: label, scopes: scopes)
      self.accounts[address] = acct
    }
  }

  access(all) fun accounts(): &{Address: FCLAccount} {
    return self.account.storage.borrow<&Root>(from: self.storagePath)!.accounts
  }

  access(all) fun getServiceKey(): [UInt8] {
    let keyRef = self.account.storage.borrow<&Root>(from: self.storagePath)!.key
    return keyRef.map(fun (_ x: UInt8): UInt8 {
        return x
    })
  }

  access(all) fun new(label: String, scopes: [String], address: Address?): &Account {
    let acct = Account(payer: self.account)
    let rawKey = self.getServiceKey()
    let decodedKey = RLP.decodeList(rawKey)

    acct.keys.add(
      publicKey: PublicKey(
        publicKey: decodedKey[0].slice(from: 2, upTo: decodedKey[0].length),
        signatureAlgorithm: SignatureAlgorithm.ECDSA_P256,
      ),
      hashAlgorithm: HashAlgorithm(decodedKey[2][0])!,
      weight: UFix64.fromBigEndianBytes(decodedKey[3])!
    )

    self.account
      .storage
      .borrow<&Root>(from: self.storagePath)!
      .add(FCLAccount(address: address ?? acct.address, label: label, scopes: scopes))

    return acct
  }

  access(all) fun update(address: Address, label: String, scopes: [String]) {
    self.account.storage.borrow<&Root>(from: self.storagePath)!
      .update(address: address, label: label, scopes: scopes)
  }

  init (key: String, initAccountsLabels: [String]) {
    self.storagePath = /storage/FCL_DEV_WALLET
    self.account.storage.save(<- create Root(key), to: self.storagePath)

    self.new(label: initAccountsLabels[0], scopes: [], address: self.account.address)
    var acctInitIndex = 1
    while acctInitIndex < initAccountsLabels.length {
      self.new(label: initAccountsLabels[acctInitIndex], scopes: [], address: nil)
      acctInitIndex = acctInitIndex + 1
    }
  }
}
