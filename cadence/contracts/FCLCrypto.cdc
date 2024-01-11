/*
  FCLCrypto

  The FCLCrypto contract provides functions which allow to verify signatures and check for signing power.
*/

access(all) contract FCLCrypto {

    /// verifyUserSignatures  allows to verify the user signatures for the given account.
    /// 
    /// @param address: The address of the account
    /// @param message: The signed data
    /// @param keyIndices: This integer array maps the signatures to the account keys by index
    /// @param signatures: The signatures belonging to the account keys
    ///
    /// @return Whether all signatures are valid and the combined total key weight reaches signing power
    ///
    access(all) fun verifyUserSignatures(
        address: Address,
        message: String,
        keyIndices: [Int],
        signatures: [String]
    ): Bool {
        return self.verifySignatures(
            address: address,
            message: message,
            keyIndices: keyIndices,
            signatures: signatures,
            domainSeparationTag: self.domainSeparationTagFlowUser,
        )
    }

    /// verifyAccountProofSignatures allows to verify the account proof signatures for the given account.
    /// 
    /// @param address: The address of the account
    /// @param message: The signed data
    /// @param keyIndices: This integer array maps the signatures to the account keys by index
    /// @param signatures: The signatures belonging to the account keys
    ///
    /// @return Whether all signatures are valid and the combined total key weight reaches signing power
    ///
    access(all) fun verifyAccountProofSignatures(
        address: Address,
        message: String,
        keyIndices: [Int],
        signatures: [String]
    ): Bool {
        return self.verifySignatures(
            address: address,
            message: message,
            keyIndices: keyIndices,
            signatures: signatures,
            domainSeparationTag: self.domainSeparationTagAccountProof,
        ) || 
        self.verifySignatures(
            address: address,
            message: message,
            keyIndices: keyIndices,
            signatures: signatures,
            domainSeparationTag: self.domainSeparationTagFlowUser,
        )
    }

    /// verifySignatures is a private function which provides the functionality to verify 
    /// signatures for the public functions.
    /// 
    /// @param address: The address of the account
    /// @param message: The signed data
    /// @param keyIndices: This integer array maps the signatures to the account keys by index
    /// @param signatures: The signatures belonging to the account keys
    /// @param domainSeparationTag: The domain tag originally used for the signatures
    ///
    /// @return Whether all signatures are valid and the combined total key weight reaches signing power
    ///
    access(self) fun verifySignatures(
        address: Address,
        message: String,
        keyIndices: [Int],
        signatures: [String],
        domainSeparationTag: String,
    ): Bool {
        pre {
            keyIndices.length == signatures.length : "Key index list length does not match signature list length"
        }

        let account = getAccount(address)
        let messageBytes = message.decodeHex()

        var totalWeight: UFix64 = 0.0
        let seenKeyIndices: {Int: Bool} = {}

        var i = 0

        for keyIndex in keyIndices {

            let accountKey = account.keys.get(keyIndex: keyIndex) ?? panic("Key provided does not exist on account")
            let signature = signatures[i].decodeHex()

            // Ensure this key index has not already been seen

            if seenKeyIndices[accountKey.keyIndex] ?? false {
                return false
            }

            // Record the key index was seen

            seenKeyIndices[accountKey.keyIndex] = true

            // Ensure the key is not revoked

            if accountKey.isRevoked {
                return false
            }

            // Ensure the signature is valid

            if !accountKey.publicKey.verify(
                signature: signature,
                signedData: messageBytes,
                domainSeparationTag: domainSeparationTag,
                hashAlgorithm: accountKey.hashAlgorithm
            ) {
                return false
            }

            totalWeight = totalWeight + accountKey.weight

            i = i + 1
        }
        
        return totalWeight >= 1000.0
    }

    access(self) let domainSeparationTagFlowUser: String
    access(self) let domainSeparationTagFCLUser: String
    access(self) let domainSeparationTagAccountProof: String

    init() {
        self.domainSeparationTagFlowUser = "FLOW-V0.0-user"
        self.domainSeparationTagFCLUser = "FCL-USER-V0.0"
        self.domainSeparationTagAccountProof = "FCL-ACCOUNT-PROOF-V0.0"
    }
}