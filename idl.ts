import { Idl } from "@coral-xyz/anchor";
/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/chaplin_protocol.json`.
 */



export const IDL: Idl ={
  "address": "DbNKdE3k31kCUTgNCKgiMD3CHn4MrWiuPZ2Ey4nHrPuF",
  "metadata": {
    "name": "chaplinProtocol",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "connectFilmToLabel",
      "discriminator": [
        110,
        211,
        169,
        38,
        176,
        232,
        78,
        50
      ],
      "accounts": [
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "label",
          "writable": true
        },
        {
          "name": "film",
          "writable": true
        }
      ],
      "args": [
        {
          "name": "label",
          "type": "pubkey"
        },
        {
          "name": "filmPda",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "connectLabelToUser",
      "discriminator": [
        201,
        49,
        0,
        142,
        101,
        186,
        206,
        129
      ],
      "accounts": [
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "userProfile",
          "writable": true
        }
      ],
      "args": [
        {
          "name": "label",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "createFilm",
      "discriminator": [
        28,
        13,
        137,
        220,
        225,
        114,
        22,
        2
      ],
      "accounts": [
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "collectionMint"
        },
        {
          "name": "film",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  102,
                  105,
                  108,
                  109
                ]
              },
              {
                "kind": "account",
                "path": "collectionMint"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "collectionMint",
          "type": "pubkey"
        },
        {
          "name": "label",
          "type": "pubkey"
        },
        {
          "name": "actor",
          "type": {
            "defined": {
              "name": "actor"
            }
          }
        }
      ]
    },
    {
      "name": "createLabel",
      "discriminator": [
        57,
        103,
        93,
        113,
        207,
        137,
        227,
        241
      ],
      "accounts": [
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "squadKey"
        },
        {
          "name": "label",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  97,
                  98,
                  101,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "squadKey"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "squadKey",
          "type": "pubkey"
        },
        {
          "name": "bubblegumTree",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "createUser",
      "discriminator": [
        108,
        227,
        130,
        130,
        252,
        109,
        75,
        218
      ],
      "accounts": [
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "authority"
        },
        {
          "name": "userProfile",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114,
                  45,
                  112,
                  114,
                  111,
                  102,
                  105,
                  108,
                  101,
                  45,
                  50
                ]
              },
              {
                "kind": "account",
                "path": "authority"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        }
      ]
    },
    {
      "name": "initializeVault",
      "discriminator": [
        48,
        191,
        163,
        44,
        71,
        129,
        63,
        164
      ],
      "accounts": [
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "protocolVault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  116,
                  111,
                  99,
                  111,
                  108,
                  45,
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "pushHistory",
      "discriminator": [
        136,
        174,
        106,
        159,
        167,
        20,
        187,
        220
      ],
      "accounts": [
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "userProfile",
          "writable": true
        }
      ],
      "args": [
        {
          "name": "collectionMint",
          "type": "pubkey"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "film",
      "discriminator": [
        64,
        83,
        51,
        112,
        106,
        117,
        158,
        226
      ]
    },
    {
      "name": "label",
      "discriminator": [
        81,
        55,
        13,
        178,
        66,
        159,
        10,
        78
      ]
    },
    {
      "name": "userProfile",
      "discriminator": [
        32,
        37,
        119,
        205,
        179,
        180,
        13,
        194
      ]
    }
  ],
  "types": [
    {
      "name": "actor",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "creator",
            "type": {
              "vec": "pubkey"
            }
          },
          {
            "name": "coCreator",
            "type": {
              "vec": "pubkey"
            }
          }
        ]
      }
    },
    {
      "name": "film",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "collectionMint",
            "type": "pubkey"
          },
          {
            "name": "label",
            "type": "pubkey"
          },
          {
            "name": "actor",
            "type": {
              "defined": {
                "name": "actor"
              }
            }
          }
        ]
      }
    },
    {
      "name": "label",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "squadKey",
            "type": "pubkey"
          },
          {
            "name": "bubblegumTree",
            "type": "pubkey"
          },
          {
            "name": "films",
            "type": {
              "vec": "pubkey"
            }
          }
        ]
      }
    },
    {
      "name": "userProfile",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "label",
            "type": {
              "vec": "pubkey"
            }
          },
          {
            "name": "history",
            "type": {
              "vec": "pubkey"
            }
          }
        ]
      }
    }
  ]
};






export type ChaplinProtocol = typeof IDL;