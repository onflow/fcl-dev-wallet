access(all) contract FCL {
  access(all) let storagePath: StoragePath

  access(all) struct FCLKey {
    access(all) let publicKey: [UInt8]
    access(all) let signatureAlgorithm: UInt8
    access(all) let hashAlgorithm: UInt8

    init(publicKey: [UInt8], signatureAlgorithm: UInt8, hashAlgorithm: UInt8) {
      self.publicKey = publicKey
      self.signatureAlgorithm = signatureAlgorithm
      self.hashAlgorithm = hashAlgorithm
    }
  }

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
    access(all) let key: FCLKey
    access(all) let accounts: {Address: FCLAccount}

    init (_ key: FCLKey) {
      self.key = key
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

  access(all) fun getServiceKey(): &FCLKey {
    return self.account.storage.borrow<&Root>(from: self.storagePath)!.key
  }

  access(all) fun new(label: String, scopes: [String], address: Address?): &Account {
    let acct = Account(payer: self.account)
    let key = self.getServiceKey()

    acct.keys.add(
      publicKey: PublicKey(
        publicKey: key.publicKey.map(fun (_ byte: UInt8): UInt8 {
          return byte
        }),
        signatureAlgorithm: SignatureAlgorithm(key.signatureAlgorithm)!,
      ),
      hashAlgorithm: HashAlgorithm(key.hashAlgorithm)!,
      weight: 1000.0
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

  init (publicKey: String, hashAlgorithm: UInt8, signAlgorithm: UInt8, initAccountsLabels: [String]) {
    let keyByteArray = publicKey.decodeHex()
    let key = FCLKey(publicKey: keyByteArray, signatureAlgorithm: signAlgorithm, hashAlgorithm: hashAlgorithm)

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
