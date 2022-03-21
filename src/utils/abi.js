/* eslint-disable */
export const abi = [{
  'inputs': [{
    'internalType': 'address',
    'name': '_sideBridgeAddress',
    'type': 'address'
  }, {'internalType': 'address', 'name': 'relayAddress', 'type': 'address'}, {
    'internalType': 'address[]',
    'name': 'tokenThisAddresses',
    'type': 'address[]'
  }, {'internalType': 'address[]', 'name': 'tokenSideAddresses', 'type': 'address[]'}, {
    'internalType': 'uint256',
    'name': 'fee_',
    'type': 'uint256'
  }, {'internalType': 'uint256', 'name': 'timeframeSeconds_', 'type': 'uint256'}, {
    'internalType': 'uint256',
    'name': 'lockTime_',
    'type': 'uint256'
  }, {'internalType': 'uint256', 'name': 'minSafetyBlocks_', 'type': 'uint256'}, {
    'internalType': 'address[]',
    'name': 'initialValidators',
    'type': 'address[]'
  }], 'stateMutability': 'nonpayable', 'type': 'constructor'
}, {
  'anonymous': false,
  'inputs': [{'indexed': true, 'internalType': 'bytes32', 'name': 'role', 'type': 'bytes32'}, {
    'indexed': true,
    'internalType': 'bytes32',
    'name': 'previousAdminRole',
    'type': 'bytes32'
  }, {'indexed': true, 'internalType': 'bytes32', 'name': 'newAdminRole', 'type': 'bytes32'}],
  'name': 'RoleAdminChanged',
  'type': 'event'
}, {
  'anonymous': false,
  'inputs': [{'indexed': true, 'internalType': 'bytes32', 'name': 'role', 'type': 'bytes32'}, {
    'indexed': true,
    'internalType': 'address',
    'name': 'account',
    'type': 'address'
  }, {'indexed': true, 'internalType': 'address', 'name': 'sender', 'type': 'address'}],
  'name': 'RoleGranted',
  'type': 'event'
}, {
  'anonymous': false,
  'inputs': [{'indexed': true, 'internalType': 'bytes32', 'name': 'role', 'type': 'bytes32'}, {
    'indexed': true,
    'internalType': 'address',
    'name': 'account',
    'type': 'address'
  }, {'indexed': true, 'internalType': 'address', 'name': 'sender', 'type': 'address'}],
  'name': 'RoleRevoked',
  'type': 'event'
}, {
  'anonymous': false,
  'inputs': [{'indexed': true, 'internalType': 'uint256', 'name': 'a', 'type': 'uint256'}, {
    'indexed': true,
    'internalType': 'address',
    'name': 'b',
    'type': 'address'
  }, {'indexed': false, 'internalType': 'string', 'name': 'c', 'type': 'string'}, {
    'indexed': false,
    'internalType': 'uint256',
    'name': 'd',
    'type': 'uint256'
  }],
  'name': 'Test',
  'type': 'event'
}, {
  'anonymous': false,
  'inputs': [{
    'indexed': true,
    'internalType': 'uint256',
    'name': 'event_id',
    'type': 'uint256'
  }, {
    'components': [{'internalType': 'address', 'name': 'tokenAddress', 'type': 'address'}, {
      'internalType': 'address',
      'name': 'toAddress',
      'type': 'address'
    }, {'internalType': 'uint256', 'name': 'amount', 'type': 'uint256'}],
    'indexed': false,
    'internalType': 'struct CommonStructs.Transfer[]',
    'name': 'queue',
    'type': 'tuple[]'
  }],
  'name': 'Transfer',
  'type': 'event'
}, {
  'anonymous': false,
  'inputs': [{'indexed': true, 'internalType': 'address', 'name': 'from', 'type': 'address'}, {
    'indexed': false,
    'internalType': 'uint256',
    'name': 'event_id',
    'type': 'uint256'
  }],
  'name': 'Withdraw',
  'type': 'event'
}, {
  'inputs': [],
  'name': 'ADMIN_ROLE',
  'outputs': [{'internalType': 'bytes32', 'name': '', 'type': 'bytes32'}],
  'stateMutability': 'view',
  'type': 'function'
}, {
  'inputs': [{
    'components': [{
      'components': [{
        'internalType': 'bytes',
        'name': 'p0_seal',
        'type': 'bytes'
      }, {'internalType': 'bytes', 'name': 'p0_bare', 'type': 'bytes'}, {
        'internalType': 'bytes',
        'name': 'p1',
        'type': 'bytes'
      }, {'internalType': 'bytes32', 'name': 'parent_hash', 'type': 'bytes32'}, {
        'internalType': 'bytes',
        'name': 'p2',
        'type': 'bytes'
      }, {'internalType': 'bytes32', 'name': 'receipts_hash', 'type': 'bytes32'}, {
        'internalType': 'bytes',
        'name': 'p3',
        'type': 'bytes'
      }, {'internalType': 'bytes', 'name': 's1', 'type': 'bytes'}, {
        'internalType': 'bytes',
        'name': 'step',
        'type': 'bytes'
      }, {'internalType': 'bytes', 'name': 's2', 'type': 'bytes'}, {
        'internalType': 'bytes',
        'name': 'signature',
        'type': 'bytes'
      }, {'internalType': 'int256', 'name': 'type_', 'type': 'int256'}],
      'internalType': 'struct CheckAura.BlockAura[]',
      'name': 'blocks',
      'type': 'tuple[]'
    }, {
      'components': [{
        'internalType': 'bytes[]',
        'name': 'receipt_proof',
        'type': 'bytes[]'
      }, {'internalType': 'uint256', 'name': 'event_id', 'type': 'uint256'}, {
        'components': [{
          'internalType': 'address',
          'name': 'tokenAddress',
          'type': 'address'
        }, {'internalType': 'address', 'name': 'toAddress', 'type': 'address'}, {
          'internalType': 'uint256',
          'name': 'amount',
          'type': 'uint256'
        }], 'internalType': 'struct CommonStructs.Transfer[]', 'name': 'transfers', 'type': 'tuple[]'
      }], 'internalType': 'struct CommonStructs.TransferProof', 'name': 'transfer', 'type': 'tuple'
    }, {
      'components': [{
        'internalType': 'bytes[]',
        'name': 'receipt_proof',
        'type': 'bytes[]'
      }, {'internalType': 'address', 'name': 'delta_address', 'type': 'address'}, {
        'internalType': 'uint64',
        'name': 'delta_index',
        'type': 'uint64'
      }], 'internalType': 'struct CheckAura.ValidatorSetProof[]', 'name': 'vs_changes', 'type': 'tuple[]'
    }], 'internalType': 'struct CheckAura.AuraProof', 'name': 'auraProof', 'type': 'tuple'
  }, {'internalType': 'uint256', 'name': 'minSafetyBlocks', 'type': 'uint256'}],
  'name': 'CheckAura_',
  'outputs': [],
  'stateMutability': 'nonpayable',
  'type': 'function'
}, {
  'inputs': [],
  'name': 'DEFAULT_ADMIN_ROLE',
  'outputs': [{'internalType': 'bytes32', 'name': '', 'type': 'bytes32'}],
  'stateMutability': 'view',
  'type': 'function'
}, {
  'inputs': [],
  'name': 'RELAY_ROLE',
  'outputs': [{'internalType': 'bytes32', 'name': '', 'type': 'bytes32'}],
  'stateMutability': 'view',
  'type': 'function'
}, {
  'inputs': [{'internalType': 'bytes', 'name': 'b', 'type': 'bytes'}],
  'name': 'bytesToUint',
  'outputs': [{'internalType': 'uint256', 'name': '', 'type': 'uint256'}],
  'stateMutability': 'view',
  'type': 'function'
}, {
  'inputs': [{'internalType': 'uint256', 'name': 'fee_', 'type': 'uint256'}],
  'name': 'changeFee',
  'outputs': [],
  'stateMutability': 'nonpayable',
  'type': 'function'
}, {
  'inputs': [{'internalType': 'uint256', 'name': 'lockTime_', 'type': 'uint256'}],
  'name': 'changeLockTime',
  'outputs': [],
  'stateMutability': 'nonpayable',
  'type': 'function'
}, {
  'inputs': [{'internalType': 'uint256', 'name': 'minSafetyBlocks_', 'type': 'uint256'}],
  'name': 'changeMinSafetyBlocks',
  'outputs': [],
  'stateMutability': 'nonpayable',
  'type': 'function'
}, {
  'inputs': [{'internalType': 'uint256', 'name': 'timeframeSeconds_', 'type': 'uint256'}],
  'name': 'changeTimeframeSeconds',
  'outputs': [],
  'stateMutability': 'nonpayable',
  'type': 'function'
}, {
  'inputs': [{'internalType': 'address', 'name': 'tokenAmbAddress', 'type': 'address'}, {
    'internalType': 'address',
    'name': 'toAddress',
    'type': 'address'
  }, {'internalType': 'uint256', 'name': 'amount', 'type': 'uint256'}, {
    'internalType': 'bool',
    'name': 'transferEvent',
    'type': 'bool'
  }], 'name': 'emitTestEvent', 'outputs': [], 'stateMutability': 'nonpayable', 'type': 'function'
}, {
  'inputs': [],
  'name': 'fee',
  'outputs': [{'internalType': 'uint256', 'name': '', 'type': 'uint256'}],
  'stateMutability': 'view',
  'type': 'function'
}, {
  'inputs': [{'internalType': 'bytes32', 'name': 'role', 'type': 'bytes32'}],
  'name': 'getRoleAdmin',
  'outputs': [{'internalType': 'bytes32', 'name': '', 'type': 'bytes32'}],
  'stateMutability': 'view',
  'type': 'function'
}, {
  'inputs': [{'internalType': 'bytes32', 'name': 'role', 'type': 'bytes32'}, {
    'internalType': 'address',
    'name': 'account',
    'type': 'address'
  }], 'name': 'grantRole', 'outputs': [], 'stateMutability': 'nonpayable', 'type': 'function'
}, {
  'inputs': [{'internalType': 'bytes32', 'name': 'role', 'type': 'bytes32'}, {
    'internalType': 'address',
    'name': 'account',
    'type': 'address'
  }],
  'name': 'hasRole',
  'outputs': [{'internalType': 'bool', 'name': '', 'type': 'bool'}],
  'stateMutability': 'view',
  'type': 'function'
}, {
  'inputs': [],
  'name': 'inputEventId',
  'outputs': [{'internalType': 'uint256', 'name': '', 'type': 'uint256'}],
  'stateMutability': 'view',
  'type': 'function'
}, {
  'inputs': [],
  'name': 'lockTime',
  'outputs': [{'internalType': 'uint256', 'name': '', 'type': 'uint256'}],
  'stateMutability': 'view',
  'type': 'function'
}, {
  'inputs': [{'internalType': 'uint256', 'name': '', 'type': 'uint256'}],
  'name': 'lockedTransfers',
  'outputs': [{'internalType': 'uint256', 'name': 'endTimestamp', 'type': 'uint256'}],
  'stateMutability': 'view',
  'type': 'function'
}, {
  'inputs': [],
  'name': 'minSafetyBlocks',
  'outputs': [{'internalType': 'uint256', 'name': '', 'type': 'uint256'}],
  'stateMutability': 'view',
  'type': 'function'
}, {
  'inputs': [{'internalType': 'bytes32', 'name': 'role', 'type': 'bytes32'}, {
    'internalType': 'address',
    'name': 'account',
    'type': 'address'
  }], 'name': 'renounceRole', 'outputs': [], 'stateMutability': 'nonpayable', 'type': 'function'
}, {
  'inputs': [{'internalType': 'bytes32', 'name': 'role', 'type': 'bytes32'}, {
    'internalType': 'address',
    'name': 'account',
    'type': 'address'
  }], 'name': 'revokeRole', 'outputs': [], 'stateMutability': 'nonpayable', 'type': 'function'
}, {
  'inputs': [],
  'name': 'sideBridgeAddress',
  'outputs': [{'internalType': 'address', 'name': '', 'type': 'address'}],
  'stateMutability': 'view',
  'type': 'function'
}, {
  'inputs': [{
    'components': [{
      'components': [{
        'internalType': 'bytes',
        'name': 'p0_seal',
        'type': 'bytes'
      }, {'internalType': 'bytes', 'name': 'p0_bare', 'type': 'bytes'}, {
        'internalType': 'bytes',
        'name': 'p1',
        'type': 'bytes'
      }, {'internalType': 'bytes32', 'name': 'parent_hash', 'type': 'bytes32'}, {
        'internalType': 'bytes',
        'name': 'p2',
        'type': 'bytes'
      }, {'internalType': 'bytes32', 'name': 'receipts_hash', 'type': 'bytes32'}, {
        'internalType': 'bytes',
        'name': 'p3',
        'type': 'bytes'
      }, {'internalType': 'bytes', 'name': 's1', 'type': 'bytes'}, {
        'internalType': 'bytes',
        'name': 'step',
        'type': 'bytes'
      }, {'internalType': 'bytes', 'name': 's2', 'type': 'bytes'}, {
        'internalType': 'bytes',
        'name': 'signature',
        'type': 'bytes'
      }, {'internalType': 'int256', 'name': 'type_', 'type': 'int256'}],
      'internalType': 'struct CheckAura.BlockAura[]',
      'name': 'blocks',
      'type': 'tuple[]'
    }, {
      'components': [{
        'internalType': 'bytes[]',
        'name': 'receipt_proof',
        'type': 'bytes[]'
      }, {'internalType': 'uint256', 'name': 'event_id', 'type': 'uint256'}, {
        'components': [{
          'internalType': 'address',
          'name': 'tokenAddress',
          'type': 'address'
        }, {'internalType': 'address', 'name': 'toAddress', 'type': 'address'}, {
          'internalType': 'uint256',
          'name': 'amount',
          'type': 'uint256'
        }], 'internalType': 'struct CommonStructs.Transfer[]', 'name': 'transfers', 'type': 'tuple[]'
      }], 'internalType': 'struct CommonStructs.TransferProof', 'name': 'transfer', 'type': 'tuple'
    }, {
      'components': [{
        'internalType': 'bytes[]',
        'name': 'receipt_proof',
        'type': 'bytes[]'
      }, {'internalType': 'address', 'name': 'delta_address', 'type': 'address'}, {
        'internalType': 'uint64',
        'name': 'delta_index',
        'type': 'uint64'
      }], 'internalType': 'struct CheckAura.ValidatorSetProof[]', 'name': 'vs_changes', 'type': 'tuple[]'
    }], 'internalType': 'struct CheckAura.AuraProof', 'name': 'auraProof', 'type': 'tuple'
  }], 'name': 'submitTransfer', 'outputs': [], 'stateMutability': 'nonpayable', 'type': 'function'
}, {
  'inputs': [{'internalType': 'bytes4', 'name': 'interfaceId', 'type': 'bytes4'}],
  'name': 'supportsInterface',
  'outputs': [{'internalType': 'bool', 'name': '', 'type': 'bool'}],
  'stateMutability': 'view',
  'type': 'function'
}, {
  'inputs': [],
  'name': 'timeframeSeconds',
  'outputs': [{'internalType': 'uint256', 'name': '', 'type': 'uint256'}],
  'stateMutability': 'view',
  'type': 'function'
}, {
  'inputs': [{'internalType': 'address', 'name': '', 'type': 'address'}],
  'name': 'tokenAddresses',
  'outputs': [{'internalType': 'address', 'name': '', 'type': 'address'}],
  'stateMutability': 'view',
  'type': 'function'
}, {
  'inputs': [{'internalType': 'address', 'name': 'tokenThisAddress', 'type': 'address'}, {
    'internalType': 'address',
    'name': 'tokenSideAddress',
    'type': 'address'
  }], 'name': 'tokensAdd', 'outputs': [], 'stateMutability': 'nonpayable', 'type': 'function'
}, {
  'inputs': [{
    'internalType': 'address[]',
    'name': 'tokenThisAddresses',
    'type': 'address[]'
  }, {'internalType': 'address[]', 'name': 'tokenSideAddresses', 'type': 'address[]'}],
  'name': 'tokensAddBatch',
  'outputs': [],
  'stateMutability': 'nonpayable',
  'type': 'function'
}, {
  'inputs': [{'internalType': 'address', 'name': 'tokenThisAddress', 'type': 'address'}],
  'name': 'tokensRemove',
  'outputs': [],
  'stateMutability': 'nonpayable',
  'type': 'function'
}, {
  'inputs': [{'internalType': 'address[]', 'name': 'tokenThisAddresses', 'type': 'address[]'}],
  'name': 'tokensRemoveBatch',
  'outputs': [],
  'stateMutability': 'nonpayable',
  'type': 'function'
}, {
  'inputs': [{'internalType': 'uint256', 'name': 'event_id', 'type': 'uint256'}],
  'name': 'unlockTransfers',
  'outputs': [],
  'stateMutability': 'nonpayable',
  'type': 'function'
}, {
  'inputs': [{'internalType': 'uint256', 'name': '', 'type': 'uint256'}],
  'name': 'validatorSet',
  'outputs': [{'internalType': 'address', 'name': '', 'type': 'address'}],
  'stateMutability': 'view',
  'type': 'function'
}, {
  'inputs': [{'internalType': 'address', 'name': 'tokenAmbAddress', 'type': 'address'}, {
    'internalType': 'address',
    'name': 'toAddress',
    'type': 'address'
  }, {'internalType': 'uint256', 'name': 'amount', 'type': 'uint256'}],
  'name': 'withdraw',
  'outputs': [],
  'stateMutability': 'payable',
  'type': 'function'
}];
