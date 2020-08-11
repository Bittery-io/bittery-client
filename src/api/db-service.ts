// @ts-ignore
import PouchDB from 'pouchdb/dist/pouchdb';
// @ts-ignore
import * as plugin from 'pouchdb-find/lib/index';
PouchDB.plugin(plugin);
const db = new PouchDB('dbname');

db.changes().on('change', function() {
  console.log('Ch-Ch-Changes');
});

export const getFromDb = async (): Promise<any> => {
  // const date = new Date();
  // const res =  await db.get('666');
  // const endDate = new Date();
  // // @ts-ignore
  // console.log('Mam roznice: ', endDate - date);
  // return res;
  const result = await db.createIndex({
    index: {
      fields: ['eCMRHeaderDetails.EcmrIssueDateTime']
    }
  });
  console.log(result);
  const date = Date.now();
  const res =  await db.find({
    selector: {$or : [{'eCMRHeaderDetails.EcmrIssueDateTime' : {$lt: new Date(10).getTime()}},
        {'eCMRHeaderDetails.EcmrIssueDateTime': {$gt: new Date(430).getTime() }}]},
  });
  const endDate = Date.now();
  // @ts-ignore
  console.log('Mam odczyt: ', date, endDate, endDate - date);
  return res;
}

export const saveInDb = (id: string): void => {
  // const date = Date.now();
  db.put({
      _id: id,
      "DocumentContext": {
        "TransactionId": "navigate",
        "BusinessProcess": {
          "ID": "generate"
        },
        "Guideline": {
          "ID": "compress"
        }
      },
      "eCMRHeaderDetails": {
        "EcmrId": "calculate",
        "TypeCode": "290",
        "EcmrIssueDateTime": new Date(Number(id)).getTime(),
        "ContractualRemarks": [
          "calculate",
          "input"
        ],
        "AdditionalParticularsNote": [
          {
            "SubjectText": "copy",
            "ContentCode": "AII",
            "ContentText": "hack",
            "SubjectCode": "CLP"
          },
          {
            "SubjectText": "copy",
            "ContentCode": "AII",
            "ContentText": "reboot",
            "SubjectCode": "CLP"
          }
        ],
        "IssueLocation": {
          "ID": "compress",
          "Name": "parse",
          "CountryCode": "connect"
        },
        "MessageIssuer": {
          "ID": "input",
          "Name": "compress",
          "DefinedContactDetails": {
            "PersonName": "back up",
            "Telephone": {
              "CompleteNumber": "override"
            },
            "MobileTelephone": {
              "CompleteNumber": "transmit"
            },
            "EmailAddress": {
              "URI": "navigate"
            },
            "Note": [
              {
                "ContentText": "hack"
              },
              {
                "ContentText": "connect"
              }
            ]
          }
        },
        "MessageRecipient": [
          {
            "ID": "override",
            "Name": "calculate",
            "DefinedContactDetails": {
              "PersonName": "parse",
              "Telephone": {
                "CompleteNumber": "synthesize"
              },
              "MobileTelephone": {
                "CompleteNumber": "copy"
              },
              "EmailAddress": {
                "URI": "back up"
              },
              "Note": [
                {
                  "ContentText": "synthesize"
                },
                {
                  "ContentText": "navigate"
                }
              ]
            }
          },
          {
            "ID": "back up",
            "Name": "synthesize",
            "DefinedContactDetails": {
              "PersonName": "calculate",
              "Telephone": {
                "CompleteNumber": "bypass"
              },
              "MobileTelephone": {
                "CompleteNumber": "compress"
              },
              "EmailAddress": {
                "URI": "index"
              },
              "Note": [
                {
                  "ContentText": "compress"
                },
                {
                  "ContentText": "connect"
                }
              ]
            }
          }
        ]
      },
      "RoadConsignment": {
        "GrossWeight": "navigate",
        "GrossVolume": "program",
        "AssociatedInvoiceAmount": "quantify",
        "CodAmount": "transmit",
        "ConsignmentItemQuantity": "parse",
        "CargoInsuranceInstructions": "transmit",
        "TransshipmentPermittedIndicator": "reboot",
        "Consignor": {
          "ID": "input",
          "Name": "hack",
          "DefinedContactDetails": {
            "PersonName": "index",
            "Telephone": {
              "CompleteNumber": "copy"
            },
            "MobileTelephone": {
              "CompleteNumber": "synthesize"
            },
            "EmailAddress": {
              "URI": "back up"
            },
            "Note": [
              {
                "ContentText": "reboot"
              },
              {
                "ContentText": "override"
              }
            ]
          },
          "LanguageCode": "back up",
          "PostalAddress": {
            "ID": [
              "transmit",
              "bypass"
            ],
            "Postcode": "override",
            "StreetName": "index",
            "CityName": "transmit",
            "CountryCode": "transmit",
            "CountryName": "parse",
            "CountrySubDivisionName": "connect"
          },
          "TaxRegistration": [
            {
              "ID": "input"
            },
            {
              "ID": "compress"
            }
          ],
          "TraderRegistration": [
            {
              "ID": "override",
              "TypeCode": "generate",
              "CountryCode": "compress"
            },
            {
              "ID": "copy",
              "TypeCode": "input",
              "CountryCode": "navigate"
            }
          ]
        },
        "Consignee": {
          "ID": "compress",
          "Name": "calculate",
          "DefinedContactDetails": {
            "PersonName": "hack",
            "Telephone": {
              "CompleteNumber": "navigate"
            },
            "MobileTelephone": {
              "CompleteNumber": "compress"
            },
            "EmailAddress": {
              "URI": "parse"
            },
            "Note": [
              {
                "ContentText": "synthesize"
              },
              {
                "ContentText": "reboot"
              }
            ]
          },
          "LanguageCode": "transmit",
          "PostalAddress": {
            "ID": [
              "navigate",
              "quantify"
            ],
            "Postcode": "parse",
            "StreetName": "copy",
            "CityName": "program",
            "CountryCode": "quantify",
            "CountryName": "navigate",
            "CountrySubDivisionName": "reboot"
          },
          "TaxRegistration": [
            {
              "ID": "index"
            },
            {
              "ID": "synthesize"
            }
          ],
          "TraderRegistration": [
            {
              "ID": "copy",
              "TypeCode": "transmit",
              "CountryCode": "compress"
            },
            {
              "ID": "hack",
              "TypeCode": "parse",
              "CountryCode": "calculate"
            }
          ]
        },
        "Carrier": {
          "ID": "copy",
          "Name": "compress",
          "DefinedContactDetails": {
            "PersonName": "synthesize",
            "Telephone": {
              "CompleteNumber": "bypass"
            },
            "MobileTelephone": {
              "CompleteNumber": "generate"
            },
            "EmailAddress": {
              "URI": "parse"
            },
            "Note": [
              {
                "ContentText": "bypass"
              },
              {
                "ContentText": "transmit"
              }
            ]
          },
          "LanguageCode": "hack",
          "PostalAddress": {
            "ID": [
              "quantify",
              "index"
            ],
            "Postcode": "parse",
            "StreetName": "index",
            "CityName": "synthesize",
            "CountryCode": "program",
            "CountryName": "hack",
            "CountrySubDivisionName": "index"
          },
          "TaxRegistration": [
            {
              "ID": "reboot"
            },
            {
              "ID": "back up"
            }
          ],
          "TraderRegistration": [
            {
              "ID": "connect",
              "TypeCode": "copy",
              "CountryCode": "copy"
            },
            {
              "ID": "override",
              "TypeCode": "connect",
              "CountryCode": "compress"
            }
          ]
        },
        "StoreAtLoadingPlace": {
          "ID": "back up",
          "Name": "hack",
          "DefinedContactDetails": {
            "PersonName": "calculate",
            "Telephone": {
              "CompleteNumber": "back up"
            },
            "MobileTelephone": {
              "CompleteNumber": "navigate"
            },
            "EmailAddress": {
              "URI": "synthesize"
            },
            "Note": [
              {
                "ContentText": "calculate"
              },
              {
                "ContentText": "quantify"
              }
            ]
          },
          "LanguageCode": "connect",
          "PostalAddress": {
            "ID": [
              "transmit",
              "copy"
            ],
            "Postcode": "bypass",
            "StreetName": "program",
            "CityName": "program",
            "CountryCode": "override",
            "CountryName": "copy",
            "CountrySubDivisionName": "compress"
          },
          "TaxRegistration": [
            {
              "ID": "hack"
            },
            {
              "ID": "reboot"
            }
          ],
          "TraderRegistration": [
            {
              "ID": "copy",
              "TypeCode": "reboot",
              "CountryCode": "override"
            },
            {
              "ID": "connect",
              "TypeCode": "compress",
              "CountryCode": "override"
            }
          ]
        },
        "StoreAtUnloadingPlace": {
          "ID": "reboot",
          "Name": "connect",
          "DefinedContactDetails": {
            "PersonName": "connect",
            "Telephone": {
              "CompleteNumber": "synthesize"
            },
            "MobileTelephone": {
              "CompleteNumber": "parse"
            },
            "EmailAddress": {
              "URI": "bypass"
            },
            "Note": [
              {
                "ContentText": "calculate"
              },
              {
                "ContentText": "calculate"
              }
            ]
          },
          "LanguageCode": "bypass",
          "PostalAddress": {
            "ID": [
              "parse",
              "reboot"
            ],
            "Postcode": "synthesize",
            "StreetName": "calculate",
            "CityName": "copy",
            "CountryCode": "transmit",
            "CountryName": "transmit",
            "CountrySubDivisionName": "index"
          },
          "TaxRegistration": [
            {
              "ID": "calculate"
            },
            {
              "ID": "quantify"
            }
          ],
          "TraderRegistration": [
            {
              "ID": "calculate",
              "TypeCode": "hack",
              "CountryCode": "parse"
            },
            {
              "ID": "navigate",
              "TypeCode": "generate",
              "CountryCode": "hack"
            }
          ]
        },
        "NotifiedParty": [
          "bypass",
          "program"
        ],
        "SubsequentCarrier": [
          {
            "ID": "parse",
            "Name": "override",
            "DefinedContactDetails": {
              "PersonName": "calculate",
              "Telephone": {
                "CompleteNumber": "bypass"
              },
              "MobileTelephone": {
                "CompleteNumber": "generate"
              },
              "EmailAddress": {
                "URI": "generate"
              },
              "Note": [
                {
                  "ContentText": "index"
                },
                {
                  "ContentText": "generate"
                }
              ]
            },
            "LanguageCode": "generate",
            "PostalAddress": {
              "ID": [
                "reboot",
                "connect"
              ],
              "Postcode": "parse",
              "StreetName": "index",
              "CityName": "compress",
              "CountryCode": "transmit",
              "CountryName": "parse",
              "CountrySubDivisionName": "override"
            },
            "TaxRegistration": [
              {
                "ID": "transmit"
              },
              {
                "ID": "program"
              }
            ],
            "TraderRegistration": [
              {
                "ID": "navigate",
                "TypeCode": "bypass",
                "CountryCode": "bypass"
              },
              {
                "ID": "reboot",
                "TypeCode": "override",
                "CountryCode": "back up"
              }
            ]
          },
          {
            "ID": "input",
            "Name": "override",
            "DefinedContactDetails": {
              "PersonName": "generate",
              "Telephone": {
                "CompleteNumber": "back up"
              },
              "MobileTelephone": {
                "CompleteNumber": "compress"
              },
              "EmailAddress": {
                "URI": "parse"
              },
              "Note": [
                {
                  "ContentText": "index"
                },
                {
                  "ContentText": "transmit"
                }
              ]
            },
            "LanguageCode": "index",
            "PostalAddress": {
              "ID": [
                "bypass",
                "back up"
              ],
              "Postcode": "transmit",
              "StreetName": "navigate",
              "CityName": "parse",
              "CountryCode": "program",
              "CountryName": "program",
              "CountrySubDivisionName": "transmit"
            },
            "TaxRegistration": [
              {
                "ID": "program"
              },
              {
                "ID": "parse"
              }
            ],
            "TraderRegistration": [
              {
                "ID": "synthesize",
                "TypeCode": "bypass",
                "CountryCode": "hack"
              },
              {
                "ID": "input",
                "TypeCode": "connect",
                "CountryCode": "hack"
              }
            ]
          }
        ],
        "ContractualCarrierAcceptanceLocation": {
          "ID": "override",
          "Name": "generate",
          "TypeCode": "synthesize",
          "PostalAddress": {
            "ID": [
              "quantify",
              "compress"
            ],
            "Postcode": "quantify",
            "StreetName": "navigate",
            "CityName": "copy",
            "CountryCode": "back up",
            "CountryName": "generate",
            "CountrySubDivisionName": "compress"
          },
          "ServicingParty": {
            "DefinedContact": [
              {
                "PersonName": "parse",
                "Telephone": {
                  "CompleteNumber": "program"
                },
                "MobileTelephone": {
                  "CompleteNumber": "synthesize"
                }
              },
              {
                "PersonName": "bypass",
                "Telephone": {
                  "CompleteNumber": "program"
                },
                "MobileTelephone": {
                  "CompleteNumber": "navigate"
                }
              }
            ]
          }
        },
        "ContractualConsigneeReceiptLocation": {
          "ID": "quantify",
          "Name": "reboot",
          "TypeCode": "connect",
          "PostalAddress": {
            "ID": [
              "reboot",
              "program"
            ],
            "Postcode": "override",
            "StreetName": "index",
            "CityName": "copy",
            "CountryCode": "back up",
            "CountryName": "input",
            "CountrySubDivisionName": "reboot"
          },
          "ServicingParty": {
            "DefinedContact": [
              {
                "PersonName": "back up",
                "Telephone": {
                  "CompleteNumber": "compress"
                },
                "MobileTelephone": {
                  "CompleteNumber": "navigate"
                }
              },
              {
                "PersonName": "generate",
                "Telephone": {
                  "CompleteNumber": "connect"
                },
                "MobileTelephone": {
                  "CompleteNumber": "reboot"
                }
              }
            ]
          }
        },
        "AssociatedDocument": [
          {
            "ID": "program",
            "TypeCode": "bypass",
            "Remark": [
              "index",
              "transmit"
            ],
            "FormattedIssueDateTime": "quantify",
            "ValidityPeriod": {
              "StartDateTime": "generate",
              "EndDateTime": "compress"
            },
            "AttachedBinaryFile": [
              {
                "ID": "connect",
                "URI": "hack",
                "MimeCode": "index",
                "EncodingCode": "compress",
                "CharacterSizeCode": "quantify",
                "Size": "program"
              },
              {
                "ID": "program",
                "URI": "reboot",
                "MimeCode": "reboot",
                "EncodingCode": "calculate",
                "CharacterSizeCode": "synthesize",
                "Size": "calculate"
              }
            ]
          },
          {
            "ID": "back up",
            "TypeCode": "program",
            "Remark": [
              "connect",
              "copy"
            ],
            "FormattedIssueDateTime": "connect",
            "ValidityPeriod": {
              "StartDateTime": "parse",
              "EndDateTime": "calculate"
            },
            "AttachedBinaryFile": [
              {
                "ID": "generate",
                "URI": "generate",
                "MimeCode": "copy",
                "EncodingCode": "parse",
                "CharacterSizeCode": "reboot",
                "Size": "copy"
              },
              {
                "ID": "program",
                "URI": "back up",
                "MimeCode": "quantify",
                "EncodingCode": "connect",
                "CharacterSizeCode": "synthesize",
                "Size": "connect"
              }
            ]
          }
        ],
        "HandlingInstructions": [
          {
            "Description": "parse",
            "DescriptionCode": "index",
            "TransportSettingTemperature": {
              "MinimumValue": "transmit",
              "MaximumValue": "index",
              "Instructions": {
                "Description": "reboot",
                "DescriptionCode": "compress"
              }
            }
          },
          {
            "Description": "parse",
            "DescriptionCode": "bypass",
            "TransportSettingTemperature": {
              "MinimumValue": "back up",
              "MaximumValue": "bypass",
              "Instructions": {
                "Description": "compress",
                "DescriptionCode": "program"
              }
            }
          }
        ],
        "LoadingInstructionsAndRelatedServices": [
          {
            "Description": [
              {
                "Description": "reboot"
              },
              {
                "Description": "hack"
              }
            ]
          },
          {
            "Description": [
              {
                "Description": "quantify"
              },
              {
                "Description": "parse"
              }
            ]
          }
        ],
        "ConsigneeDeliveryEvent": {
          "ActualOccurrenceDateTime": "index",
          "ActualOccurrenceLocation": {
            "ID": "compress",
            "Name": "parse"
          },
          "CertifyingParty": [
            {
              "ID": "back up",
              "Name": "generate",
              "RoleCode": [
                "hack",
                "navigate"
              ]
            },
            {
              "ID": "navigate",
              "Name": "reboot",
              "RoleCode": [
                "program",
                "copy"
              ]
            }
          ],
          "AdditionalParticularsNote": [
            {
              "SubjectText": "override",
              "ContentCode": "AAJ",
              "ContentText": "compress",
              "SubjectCode": "ABV"
            },
            {
              "SubjectText": "reboot",
              "ContentCode": "AAJ",
              "ContentText": "navigate",
              "SubjectCode": "ABV"
            }
          ],
          "RelatedObservation": [
            {
              "SequenceNumber": "connect",
              "Description": "bypass",
              "RelatedBinaryFile": [
                {
                  "ID": "compress",
                  "URI": "compress",
                  "MimeCode": "program",
                  "EncodingCode": "calculate",
                  "CharacterSizeCode": "program",
                  "Size": "back up"
                },
                {
                  "ID": "connect",
                  "URI": "back up",
                  "MimeCode": "generate",
                  "EncodingCode": "synthesize",
                  "CharacterSizeCode": "bypass",
                  "Size": "navigate"
                }
              ],
              "ApplicableNote": [
                {
                  "SubjectText": "transmit",
                  "ContentCode": "ABN",
                  "ContentText": "index",
                  "SubjectCode": "ABI"
                },
                {
                  "SubjectText": "connect",
                  "ContentCode": "ABN",
                  "ContentText": "calculate",
                  "SubjectCode": "ABI"
                }
              ]
            },
            {
              "SequenceNumber": "calculate",
              "Description": "program",
              "RelatedBinaryFile": [
                {
                  "ID": "override",
                  "URI": "override",
                  "MimeCode": "hack",
                  "EncodingCode": "copy",
                  "CharacterSizeCode": "reboot",
                  "Size": "copy"
                },
                {
                  "ID": "quantify",
                  "URI": "compress",
                  "MimeCode": "quantify",
                  "EncodingCode": "quantify",
                  "CharacterSizeCode": "connect",
                  "Size": "connect"
                }
              ],
              "ApplicableNote": [
                {
                  "SubjectText": "calculate",
                  "ContentCode": "ABN",
                  "ContentText": "navigate",
                  "SubjectCode": "ABI"
                },
                {
                  "SubjectText": "connect",
                  "ContentCode": "ABN",
                  "ContentText": "generate",
                  "SubjectCode": "ABI"
                }
              ]
            }
          ]
        },
        "GovernmentalExaminationEvent": [
          {
            "ActualOccurrenceDateTime": "calculate",
            "ActualOccurrenceLocation": {
              "ID": "program",
              "Name": "reboot"
            },
            "CertifyingParty": [
              {
                "ID": "program",
                "Name": "synthesize",
                "RoleCode": [
                  "quantify",
                  "calculate"
                ]
              },
              {
                "ID": "generate",
                "Name": "navigate",
                "RoleCode": [
                  "back up",
                  "input"
                ]
              }
            ],
            "AdditionalParticularsNote": [
              {
                "SubjectText": "compress",
                "ContentCode": "transmit",
                "ContentText": "back up",
                "SubjectCode": "transmit"
              },
              {
                "SubjectText": "generate",
                "ContentCode": "calculate",
                "ContentText": "connect",
                "SubjectCode": "compress"
              }
            ],
            "RelatedObservation": [
              {
                "SequenceNumber": "parse",
                "Description": "copy",
                "RelatedBinaryFile": [
                  {
                    "ID": "navigate",
                    "URI": "copy",
                    "MimeCode": "generate",
                    "EncodingCode": "override",
                    "CharacterSizeCode": "parse",
                    "Size": "quantify"
                  },
                  {
                    "ID": "input",
                    "URI": "calculate",
                    "MimeCode": "connect",
                    "EncodingCode": "bypass",
                    "CharacterSizeCode": "hack",
                    "Size": "reboot"
                  }
                ],
                "ApplicableNote": [
                  {
                    "SubjectText": "hack",
                    "ContentCode": "copy",
                    "ContentText": "bypass",
                    "SubjectCode": "calculate"
                  },
                  {
                    "SubjectText": "calculate",
                    "ContentCode": "connect",
                    "ContentText": "reboot",
                    "SubjectCode": "connect"
                  }
                ]
              },
              {
                "SequenceNumber": "transmit",
                "Description": "parse",
                "RelatedBinaryFile": [
                  {
                    "ID": "quantify",
                    "URI": "override",
                    "MimeCode": "bypass",
                    "EncodingCode": "index",
                    "CharacterSizeCode": "reboot",
                    "Size": "reboot"
                  },
                  {
                    "ID": "parse",
                    "URI": "parse",
                    "MimeCode": "back up",
                    "EncodingCode": "compress",
                    "CharacterSizeCode": "parse",
                    "Size": "override"
                  }
                ],
                "ApplicableNote": [
                  {
                    "SubjectText": "synthesize",
                    "ContentCode": "hack",
                    "ContentText": "copy",
                    "SubjectCode": "quantify"
                  },
                  {
                    "SubjectText": "hack",
                    "ContentCode": "generate",
                    "ContentText": "index",
                    "SubjectCode": "navigate"
                  }
                ]
              }
            ]
          },
          {
            "ActualOccurrenceDateTime": "navigate",
            "ActualOccurrenceLocation": {
              "ID": "index",
              "Name": "input"
            },
            "CertifyingParty": [
              {
                "ID": "generate",
                "Name": "parse",
                "RoleCode": [
                  "connect",
                  "transmit"
                ]
              },
              {
                "ID": "input",
                "Name": "hack",
                "RoleCode": [
                  "hack",
                  "quantify"
                ]
              }
            ],
            "AdditionalParticularsNote": [
              {
                "SubjectText": "quantify",
                "ContentCode": "input",
                "ContentText": "back up",
                "SubjectCode": "calculate"
              },
              {
                "SubjectText": "synthesize",
                "ContentCode": "index",
                "ContentText": "parse",
                "SubjectCode": "transmit"
              }
            ],
            "RelatedObservation": [
              {
                "SequenceNumber": "program",
                "Description": "bypass",
                "RelatedBinaryFile": [
                  {
                    "ID": "bypass",
                    "URI": "transmit",
                    "MimeCode": "override",
                    "EncodingCode": "hack",
                    "CharacterSizeCode": "index",
                    "Size": "override"
                  },
                  {
                    "ID": "compress",
                    "URI": "hack",
                    "MimeCode": "transmit",
                    "EncodingCode": "reboot",
                    "CharacterSizeCode": "override",
                    "Size": "synthesize"
                  }
                ],
                "ApplicableNote": [
                  {
                    "SubjectText": "input",
                    "ContentCode": "compress",
                    "ContentText": "input",
                    "SubjectCode": "parse"
                  },
                  {
                    "SubjectText": "program",
                    "ContentCode": "compress",
                    "ContentText": "calculate",
                    "SubjectCode": "program"
                  }
                ]
              },
              {
                "SequenceNumber": "connect",
                "Description": "override",
                "RelatedBinaryFile": [
                  {
                    "ID": "quantify",
                    "URI": "hack",
                    "MimeCode": "calculate",
                    "EncodingCode": "back up",
                    "CharacterSizeCode": "navigate",
                    "Size": "override"
                  },
                  {
                    "ID": "quantify",
                    "URI": "input",
                    "MimeCode": "quantify",
                    "EncodingCode": "parse",
                    "CharacterSizeCode": "navigate",
                    "Size": "quantify"
                  }
                ],
                "ApplicableNote": [
                  {
                    "SubjectText": "calculate",
                    "ContentCode": "program",
                    "ContentText": "transmit",
                    "SubjectCode": "generate"
                  },
                  {
                    "SubjectText": "transmit",
                    "ContentCode": "bypass",
                    "ContentText": "index",
                    "SubjectCode": "program"
                  }
                ]
              }
            ]
          }
        ],
        "CarrierPickUpEvent": {
          "ActualOccurrenceDateTime": "hack",
          "ActualOccurrenceLocation": {
            "ID": "copy",
            "Name": "generate"
          },
          "CertifyingParty": [
            {
              "ID": "reboot",
              "Name": "reboot",
              "RoleCode": [
                "override",
                "navigate"
              ]
            },
            {
              "ID": "index",
              "Name": "connect",
              "RoleCode": [
                "navigate",
                "transmit"
              ]
            }
          ],
          "AdditionalParticularsNote": [
            {
              "SubjectText": "transmit",
              "ContentCode": "ALL",
              "ContentText": "reboot",
              "SubjectCode": "AFY"
            },
            {
              "SubjectText": "index",
              "ContentCode": "ALL",
              "ContentText": "navigate",
              "SubjectCode": "AFY"
            }
          ],
          "RelatedObservation": [
            {
              "SequenceNumber": "calculate",
              "Description": "input",
              "RelatedBinaryFile": [
                {
                  "ID": "bypass",
                  "URI": "parse",
                  "MimeCode": "override",
                  "EncodingCode": "calculate",
                  "CharacterSizeCode": "override",
                  "Size": "copy"
                },
                {
                  "ID": "index",
                  "URI": "index",
                  "MimeCode": "back up",
                  "EncodingCode": "input",
                  "CharacterSizeCode": "parse",
                  "Size": "quantify"
                }
              ],
              "ApplicableNote": [
                {
                  "SubjectText": "bypass",
                  "ContentCode": "AEA",
                  "ContentText": "input",
                  "SubjectCode": "AAC"
                },
                {
                  "SubjectText": "override",
                  "ContentCode": "AEA",
                  "ContentText": "generate",
                  "SubjectCode": "AAC"
                }
              ]
            },
            {
              "SequenceNumber": "connect",
              "Description": "calculate",
              "RelatedBinaryFile": [
                {
                  "ID": "index",
                  "URI": "quantify",
                  "MimeCode": "connect",
                  "EncodingCode": "parse",
                  "CharacterSizeCode": "calculate",
                  "Size": "generate"
                },
                {
                  "ID": "generate",
                  "URI": "hack",
                  "MimeCode": "program",
                  "EncodingCode": "copy",
                  "CharacterSizeCode": "program",
                  "Size": "synthesize"
                }
              ],
              "ApplicableNote": [
                {
                  "SubjectText": "quantify",
                  "ContentCode": "AEA",
                  "ContentText": "input",
                  "SubjectCode": "AAC"
                },
                {
                  "SubjectText": "copy",
                  "ContentCode": "AEA",
                  "ContentText": "index",
                  "SubjectCode": "AAC"
                }
              ]
            }
          ]
        },
        "IncludedConsignmentItem": [
          {
            "SequenceNumber": "reboot",
            "CommodityCode": "quantify",
            "InvoiceAmount": "compress",
            "GrossWeight": "bypass",
            "GrossVolume": "navigate",
            "AdditionalUnitsMeasurement": "navigate",
            "GlobalId": "quantify",
            "GoodsDescription": {
              "IdentificationText": [
                "parse",
                "input"
              ]
            },
            "TransportDangerousGoods": [
              {
                "UNDGID": "ADT",
                "RegulationCode": "compress",
                "TechnicalName": "generate",
                "UpperPartOrangeHazardPlacardId": "connect",
                "LowerPartOrangeHazardPlacardId": "synthesize",
                "ProperShippingName": "generate",
                "TransportExpertContact": {
                  "PersonName": "transmit",
                  "Telephone": {
                    "CompleteNumber": "compress"
                  },
                  "MobileTelephone": {
                    "CompleteNumber": "transmit"
                  },
                  "EmailAddress": {
                    "URI": "synthesize"
                  },
                  "Note": [
                    {
                      "ContentText": "program"
                    },
                    {
                      "ContentText": "override"
                    }
                  ]
                },
                "EmergencyContact": {
                  "PersonName": "reboot",
                  "Telephone": {
                    "CompleteNumber": "input"
                  },
                  "MobileTelephone": {
                    "CompleteNumber": "back up"
                  },
                  "EmailAddress": {
                    "URI": "quantify"
                  },
                  "Note": [
                    {
                      "ContentText": "back up"
                    },
                    {
                      "ContentText": "transmit"
                    }
                  ]
                },
                "FlashpointTemperature": {
                  "ActualMeasure": "copy"
                }
              },
              {
                "UNDGID": "ADT",
                "RegulationCode": "generate",
                "TechnicalName": "input",
                "UpperPartOrangeHazardPlacardId": "bypass",
                "LowerPartOrangeHazardPlacardId": "quantify",
                "ProperShippingName": "hack",
                "TransportExpertContact": {
                  "PersonName": "quantify",
                  "Telephone": {
                    "CompleteNumber": "transmit"
                  },
                  "MobileTelephone": {
                    "CompleteNumber": "compress"
                  },
                  "EmailAddress": {
                    "URI": "quantify"
                  },
                  "Note": [
                    {
                      "ContentText": "quantify"
                    },
                    {
                      "ContentText": "generate"
                    }
                  ]
                },
                "EmergencyContact": {
                  "PersonName": "hack",
                  "Telephone": {
                    "CompleteNumber": "override"
                  },
                  "MobileTelephone": {
                    "CompleteNumber": "parse"
                  },
                  "EmailAddress": {
                    "URI": "bypass"
                  },
                  "Note": [
                    {
                      "ContentText": "override"
                    },
                    {
                      "ContentText": "index"
                    }
                  ]
                },
                "FlashpointTemperature": {
                  "ActualMeasure": "copy"
                }
              }
            ],
            "HandlingInstructions": [
              {
                "Description": "calculate",
                "DescriptionCode": "navigate",
                "TransportSettingTemperature": {
                  "MinimumValue": "calculate",
                  "MaximumValue": "reboot",
                  "Instructions": {
                    "Description": "transmit",
                    "DescriptionCode": "copy"
                  }
                }
              },
              {
                "Description": "reboot",
                "DescriptionCode": "parse",
                "TransportSettingTemperature": {
                  "MinimumValue": "back up",
                  "MaximumValue": "calculate",
                  "Instructions": {
                    "Description": "generate",
                    "DescriptionCode": "program"
                  }
                }
              }
            ],
            "OriginCountry": {
              "Code": "copy"
            },
            "DestinationCountry": {
              "Code": "input"
            },
            "AssociatedTransportEquipment": [
              {
                "ID": "generate",
                "LoadedPackageQuantity": "navigate"
              },
              {
                "ID": "bypass",
                "LoadedPackageQuantity": "back up"
              }
            ],
            "AssociatedDocument": [
              {
                "ID": "input",
                "TypeCode": "index",
                "Remark": [
                  "reboot",
                  "override"
                ],
                "FormattedIssueDateTime": "transmit",
                "ValidityPeriod": {
                  "StartDateTime": "back up",
                  "EndDateTime": "index"
                },
                "AttachedBinaryFile": [
                  {
                    "ID": "index",
                    "URI": "override",
                    "MimeCode": "input",
                    "EncodingCode": "program",
                    "CharacterSizeCode": "hack",
                    "Size": "quantify"
                  },
                  {
                    "ID": "hack",
                    "URI": "synthesize",
                    "MimeCode": "program",
                    "EncodingCode": "index",
                    "CharacterSizeCode": "override",
                    "Size": "input"
                  }
                ]
              },
              {
                "ID": "index",
                "TypeCode": "synthesize",
                "Remark": [
                  "navigate",
                  "reboot"
                ],
                "FormattedIssueDateTime": "override",
                "ValidityPeriod": {
                  "StartDateTime": "parse",
                  "EndDateTime": "parse"
                },
                "AttachedBinaryFile": [
                  {
                    "ID": "input",
                    "URI": "quantify",
                    "MimeCode": "transmit",
                    "EncodingCode": "override",
                    "CharacterSizeCode": "index",
                    "Size": "index"
                  },
                  {
                    "ID": "synthesize",
                    "URI": "parse",
                    "MimeCode": "synthesize",
                    "EncodingCode": "reboot",
                    "CharacterSizeCode": "override",
                    "Size": "copy"
                  }
                ]
              }
            ],
            "TransportPackage": [
              {
                "ItemQuantity": "reboot",
                "LevelCode": "copy",
                "TypeCode": "synthesize",
                "TypeText": "program",
                "ID": "compress",
                "ReturnableIndicator": "connect",
                "ShippingMarks": [
                  {
                    "MarkingText": "synthesize",
                    "BarcodeLabel": [
                      {
                        "ID": "navigate"
                      },
                      {
                        "ID": "compress"
                      }
                    ]
                  },
                  {
                    "MarkingText": "copy",
                    "BarcodeLabel": [
                      {
                        "ID": "hack"
                      },
                      {
                        "ID": "quantify"
                      }
                    ]
                  }
                ]
              },
              {
                "ItemQuantity": "reboot",
                "LevelCode": "transmit",
                "TypeCode": "index",
                "TypeText": "back up",
                "ID": "program",
                "ReturnableIndicator": "synthesize",
                "ShippingMarks": [
                  {
                    "MarkingText": "reboot",
                    "BarcodeLabel": [
                      {
                        "ID": "override"
                      },
                      {
                        "ID": "copy"
                      }
                    ]
                  },
                  {
                    "MarkingText": "quantify",
                    "BarcodeLabel": [
                      {
                        "ID": "transmit"
                      },
                      {
                        "ID": "transmit"
                      }
                    ]
                  }
                ]
              }
            ],
            "PreviousAdministrativeDocument": [
              {
                "ID": "index",
                "TypeCode": "parse",
                "Remark": [
                  "index",
                  "navigate"
                ],
                "FormattedIssueDateTime": "navigate",
                "EffectivePeriod": {
                  "StartDateTime": "navigate",
                  "EndDateTime": "generate"
                },
                "AttachedBinaryFile": [
                  {
                    "ID": "hack",
                    "URI": "navigate",
                    "MimeCode": "transmit",
                    "EncodingCode": "compress",
                    "CharacterSizeCode": "override",
                    "Size": "override"
                  },
                  {
                    "ID": "hack",
                    "URI": "synthesize",
                    "MimeCode": "navigate",
                    "EncodingCode": "reboot",
                    "CharacterSizeCode": "copy",
                    "Size": "parse"
                  }
                ]
              },
              {
                "ID": "program",
                "TypeCode": "transmit",
                "Remark": [
                  "back up",
                  "calculate"
                ],
                "FormattedIssueDateTime": "parse",
                "EffectivePeriod": {
                  "StartDateTime": "reboot",
                  "EndDateTime": "navigate"
                },
                "AttachedBinaryFile": [
                  {
                    "ID": "connect",
                    "URI": "compress",
                    "MimeCode": "back up",
                    "EncodingCode": "quantify",
                    "CharacterSizeCode": "program",
                    "Size": "synthesize"
                  },
                  {
                    "ID": "input",
                    "URI": "hack",
                    "MimeCode": "generate",
                    "EncodingCode": "program",
                    "CharacterSizeCode": "navigate",
                    "Size": "synthesize"
                  }
                ]
              }
            ],
            "AdditionalParticularsNote": [
              {
                "SubjectText": "transmit",
                "ContentCode": "AAJ",
                "ContentText": "quantify",
                "SubjectCode": "ABV"
              },
              {
                "SubjectText": "override",
                "ContentCode": "AAJ",
                "ContentText": "bypass",
                "SubjectCode": "ABV"
              }
            ]
          },
          {
            "SequenceNumber": "connect",
            "CommodityCode": "generate",
            "InvoiceAmount": "quantify",
            "GrossWeight": "hack",
            "GrossVolume": "index",
            "AdditionalUnitsMeasurement": "back up",
            "GlobalId": "quantify",
            "GoodsDescription": {
              "IdentificationText": [
                "reboot",
                "program"
              ]
            },
            "TransportDangerousGoods": [
              {
                "UNDGID": "ADT",
                "RegulationCode": "generate",
                "TechnicalName": "parse",
                "UpperPartOrangeHazardPlacardId": "compress",
                "LowerPartOrangeHazardPlacardId": "compress",
                "ProperShippingName": "program",
                "TransportExpertContact": {
                  "PersonName": "synthesize",
                  "Telephone": {
                    "CompleteNumber": "bypass"
                  },
                  "MobileTelephone": {
                    "CompleteNumber": "reboot"
                  },
                  "EmailAddress": {
                    "URI": "override"
                  },
                  "Note": [
                    {
                      "ContentText": "synthesize"
                    },
                    {
                      "ContentText": "reboot"
                    }
                  ]
                },
                "EmergencyContact": {
                  "PersonName": "override",
                  "Telephone": {
                    "CompleteNumber": "quantify"
                  },
                  "MobileTelephone": {
                    "CompleteNumber": "parse"
                  },
                  "EmailAddress": {
                    "URI": "back up"
                  },
                  "Note": [
                    {
                      "ContentText": "copy"
                    },
                    {
                      "ContentText": "calculate"
                    }
                  ]
                },
                "FlashpointTemperature": {
                  "ActualMeasure": "compress"
                }
              },
              {
                "UNDGID": "ADT",
                "RegulationCode": "index",
                "TechnicalName": "navigate",
                "UpperPartOrangeHazardPlacardId": "program",
                "LowerPartOrangeHazardPlacardId": "index",
                "ProperShippingName": "generate",
                "TransportExpertContact": {
                  "PersonName": "parse",
                  "Telephone": {
                    "CompleteNumber": "connect"
                  },
                  "MobileTelephone": {
                    "CompleteNumber": "bypass"
                  },
                  "EmailAddress": {
                    "URI": "input"
                  },
                  "Note": [
                    {
                      "ContentText": "index"
                    },
                    {
                      "ContentText": "copy"
                    }
                  ]
                },
                "EmergencyContact": {
                  "PersonName": "reboot",
                  "Telephone": {
                    "CompleteNumber": "copy"
                  },
                  "MobileTelephone": {
                    "CompleteNumber": "connect"
                  },
                  "EmailAddress": {
                    "URI": "program"
                  },
                  "Note": [
                    {
                      "ContentText": "generate"
                    },
                    {
                      "ContentText": "program"
                    }
                  ]
                },
                "FlashpointTemperature": {
                  "ActualMeasure": "compress"
                }
              }
            ],
            "HandlingInstructions": [
              {
                "Description": "navigate",
                "DescriptionCode": "navigate",
                "TransportSettingTemperature": {
                  "MinimumValue": "connect",
                  "MaximumValue": "program",
                  "Instructions": {
                    "Description": "copy",
                    "DescriptionCode": "bypass"
                  }
                }
              },
              {
                "Description": "compress",
                "DescriptionCode": "parse",
                "TransportSettingTemperature": {
                  "MinimumValue": "input",
                  "MaximumValue": "program",
                  "Instructions": {
                    "Description": "generate",
                    "DescriptionCode": "input"
                  }
                }
              }
            ],
            "OriginCountry": {
              "Code": "quantify"
            },
            "DestinationCountry": {
              "Code": "navigate"
            },
            "AssociatedTransportEquipment": [
              {
                "ID": "calculate",
                "LoadedPackageQuantity": "calculate"
              },
              {
                "ID": "copy",
                "LoadedPackageQuantity": "reboot"
              }
            ],
            "AssociatedDocument": [
              {
                "ID": "parse",
                "TypeCode": "parse",
                "Remark": [
                  "calculate",
                  "override"
                ],
                "FormattedIssueDateTime": "connect",
                "ValidityPeriod": {
                  "StartDateTime": "input",
                  "EndDateTime": "synthesize"
                },
                "AttachedBinaryFile": [
                  {
                    "ID": "parse",
                    "URI": "generate",
                    "MimeCode": "back up",
                    "EncodingCode": "synthesize",
                    "CharacterSizeCode": "reboot",
                    "Size": "quantify"
                  },
                  {
                    "ID": "override",
                    "URI": "calculate",
                    "MimeCode": "hack",
                    "EncodingCode": "generate",
                    "CharacterSizeCode": "generate",
                    "Size": "calculate"
                  }
                ]
              },
              {
                "ID": "bypass",
                "TypeCode": "navigate",
                "Remark": [
                  "quantify",
                  "bypass"
                ],
                "FormattedIssueDateTime": "transmit",
                "ValidityPeriod": {
                  "StartDateTime": "reboot",
                  "EndDateTime": "input"
                },
                "AttachedBinaryFile": [
                  {
                    "ID": "calculate",
                    "URI": "synthesize",
                    "MimeCode": "program",
                    "EncodingCode": "bypass",
                    "CharacterSizeCode": "override",
                    "Size": "back up"
                  },
                  {
                    "ID": "program",
                    "URI": "back up",
                    "MimeCode": "navigate",
                    "EncodingCode": "copy",
                    "CharacterSizeCode": "index",
                    "Size": "copy"
                  }
                ]
              }
            ],
            "TransportPackage": [
              {
                "ItemQuantity": "compress",
                "LevelCode": "back up",
                "TypeCode": "transmit",
                "TypeText": "connect",
                "ID": "transmit",
                "ReturnableIndicator": "back up",
                "ShippingMarks": [
                  {
                    "MarkingText": "override",
                    "BarcodeLabel": [
                      {
                        "ID": "compress"
                      },
                      {
                        "ID": "bypass"
                      }
                    ]
                  },
                  {
                    "MarkingText": "input",
                    "BarcodeLabel": [
                      {
                        "ID": "back up"
                      },
                      {
                        "ID": "synthesize"
                      }
                    ]
                  }
                ]
              },
              {
                "ItemQuantity": "hack",
                "LevelCode": "compress",
                "TypeCode": "copy",
                "TypeText": "calculate",
                "ID": "back up",
                "ReturnableIndicator": "hack",
                "ShippingMarks": [
                  {
                    "MarkingText": "generate",
                    "BarcodeLabel": [
                      {
                        "ID": "connect"
                      },
                      {
                        "ID": "generate"
                      }
                    ]
                  },
                  {
                    "MarkingText": "hack",
                    "BarcodeLabel": [
                      {
                        "ID": "generate"
                      },
                      {
                        "ID": "index"
                      }
                    ]
                  }
                ]
              }
            ],
            "PreviousAdministrativeDocument": [
              {
                "ID": "compress",
                "TypeCode": "synthesize",
                "Remark": [
                  "override",
                  "calculate"
                ],
                "FormattedIssueDateTime": "input",
                "EffectivePeriod": {
                  "StartDateTime": "override",
                  "EndDateTime": "hack"
                },
                "AttachedBinaryFile": [
                  {
                    "ID": "reboot",
                    "URI": "connect",
                    "MimeCode": "navigate",
                    "EncodingCode": "navigate",
                    "CharacterSizeCode": "index",
                    "Size": "compress"
                  },
                  {
                    "ID": "index",
                    "URI": "parse",
                    "MimeCode": "compress",
                    "EncodingCode": "back up",
                    "CharacterSizeCode": "connect",
                    "Size": "quantify"
                  }
                ]
              },
              {
                "ID": "synthesize",
                "TypeCode": "input",
                "Remark": [
                  "back up",
                  "compress"
                ],
                "FormattedIssueDateTime": "calculate",
                "EffectivePeriod": {
                  "StartDateTime": "synthesize",
                  "EndDateTime": "program"
                },
                "AttachedBinaryFile": [
                  {
                    "ID": "program",
                    "URI": "calculate",
                    "MimeCode": "compress",
                    "EncodingCode": "calculate",
                    "CharacterSizeCode": "generate",
                    "Size": "copy"
                  },
                  {
                    "ID": "hack",
                    "URI": "program",
                    "MimeCode": "quantify",
                    "EncodingCode": "hack",
                    "CharacterSizeCode": "input",
                    "Size": "connect"
                  }
                ]
              }
            ],
            "AdditionalParticularsNote": [
              {
                "SubjectText": "back up",
                "ContentCode": "AAJ",
                "ContentText": "connect",
                "SubjectCode": "ABV"
              },
              {
                "SubjectText": "navigate",
                "ContentCode": "AAJ",
                "ContentText": "synthesize",
                "SubjectCode": "ABV"
              }
            ]
          }
        ],
        "UsedTransportEquipment": [
          {
            "ID": "compress",
            "CategoryCode": "navigate",
            "SizeCode": "quantify",
            "SealedIndicator": "reboot",
            "ReturnableIndicator": "compress",
            "AffixedSeal": [
              {
                "ID": "connect",
                "ConditionCode": [
                  "reboot",
                  "connect"
                ],
                "SealingPartyRoleCode": "override"
              },
              {
                "ID": "program",
                "ConditionCode": [
                  "back up",
                  "index"
                ],
                "SealingPartyRoleCode": "bypass"
              }
            ],
            "TemperatureSetting": [
              {
                "MinimumValue": "quantify",
                "MaximumValue": "generate",
                "Instructions": {
                  "Description": "input",
                  "DescriptionCode": "input"
                }
              },
              {
                "MinimumValue": "back up",
                "MaximumValue": "back up",
                "Instructions": {
                  "Description": "program",
                  "DescriptionCode": "connect"
                }
              }
            ],
            "AdditionalParticularsNote": [
              {
                "SubjectText": "compress",
                "ContentCode": "AAJ",
                "ContentText": "copy",
                "SubjectCode": "ABV"
              },
              {
                "SubjectText": "input",
                "ContentCode": "AAJ",
                "ContentText": "back up",
                "SubjectCode": "ABV"
              }
            ]
          },
          {
            "ID": "synthesize",
            "CategoryCode": "program",
            "SizeCode": "navigate",
            "SealedIndicator": "index",
            "ReturnableIndicator": "back up",
            "AffixedSeal": [
              {
                "ID": "reboot",
                "ConditionCode": [
                  "transmit",
                  "synthesize"
                ],
                "SealingPartyRoleCode": "index"
              },
              {
                "ID": "transmit",
                "ConditionCode": [
                  "transmit",
                  "connect"
                ],
                "SealingPartyRoleCode": "hack"
              }
            ],
            "TemperatureSetting": [
              {
                "MinimumValue": "parse",
                "MaximumValue": "transmit",
                "Instructions": {
                  "Description": "back up",
                  "DescriptionCode": "override"
                }
              },
              {
                "MinimumValue": "navigate",
                "MaximumValue": "transmit",
                "Instructions": {
                  "Description": "generate",
                  "DescriptionCode": "synthesize"
                }
              }
            ],
            "AdditionalParticularsNote": [
              {
                "SubjectText": "generate",
                "ContentCode": "AAJ",
                "ContentText": "hack",
                "SubjectCode": "ABV"
              },
              {
                "SubjectText": "reboot",
                "ContentCode": "AAJ",
                "ContentText": "connect",
                "SubjectCode": "ABV"
              }
            ]
          }
        ],
        "TransportDetails": [
          {
            "StageCode": "13",
            "ModeCode": "100",
            "UsedTransportMeans": {
              "TypeCode": "47",
              "RegistrationNumber": [
                "compress",
                "bypass"
              ],
              "RegistrationCountry": {
                "Code": "bypass"
              }
            },
            "EnRouteEvent": [
              {
                "SequenceNumber": "input",
                "LogisticsStatusTypeCode": "navigate",
                "Description": "override",
                "EstimatedOccurrenceDateTime": "navigate",
                "ActualOccurrenceDateTime": "transmit",
                "ScheduledOccurrenceDateTime": "back up",
                "SpecifiedInstructions": [
                  {
                    "Description": "synthesize",
                    "DescriptionCode": "synthesize"
                  },
                  {
                    "Description": "synthesize",
                    "DescriptionCode": "transmit"
                  }
                ],
                "OccurrenceLocation": {
                  "ID": "compress",
                  "Name": "parse",
                  "TypeCode": "input",
                  "Description": [
                    "transmit"
                  ],
                  "GeographicalCoordinates": {
                    "Altitude": "navigate",
                    "Latitude": "transmit",
                    "Longitude": "back up",
                    "LatitudeDirectionIndicator": "hack",
                    "LongitudeDirectionIndicator": "calculate",
                    "SystemId": "navigate",
                    "ID": "compress",
                    "AltimetricSystemId": "back up"
                  },
                  "ServicingParty": {
                    "DefinedContact": [
                      {
                        "PersonName": "quantify",
                        "Telephone": {
                          "CompleteNumber": "synthesize"
                        },
                        "MobileTelephone": {
                          "CompleteNumber": "generate"
                        }
                      },
                      {
                        "PersonName": "calculate",
                        "Telephone": {
                          "CompleteNumber": "input"
                        },
                        "MobileTelephone": {
                          "CompleteNumber": "quantify"
                        }
                      }
                    ]
                  }
                },
                "CertifyingParty": [
                  {
                    "ID": "connect",
                    "Name": "override",
                    "LanguageCode": "index",
                    "DefinedContactDetails": {
                      "PersonName": "quantify",
                      "Telephone": {
                        "CompleteNumber": "generate"
                      },
                      "MobileTelephone": {
                        "CompleteNumber": "parse"
                      },
                      "EmailAddress": {
                        "URI": "back up"
                      },
                      "Note": [
                        {
                          "ContentText": "compress"
                        },
                        {
                          "ContentText": "copy"
                        }
                      ]
                    },
                    "PostalAddress": {
                      "ID": [
                        "bypass",
                        "hack"
                      ],
                      "Postcode": "connect",
                      "StreetName": "reboot",
                      "CityName": "quantify",
                      "CountryCode": "override",
                      "CountryName": "index",
                      "CountrySubDivisionName": "calculate"
                    },
                    "TaxRegistration": {
                      "ID": "override"
                    },
                    "TraderRegistration": {
                      "ID": "input",
                      "TypeCode": "connect",
                      "CountryCode": "transmit"
                    }
                  },
                  {
                    "ID": "copy",
                    "Name": "connect",
                    "LanguageCode": "hack",
                    "DefinedContactDetails": {
                      "PersonName": "reboot",
                      "Telephone": {
                        "CompleteNumber": "copy"
                      },
                      "MobileTelephone": {
                        "CompleteNumber": "compress"
                      },
                      "EmailAddress": {
                        "URI": "navigate"
                      },
                      "Note": [
                        {
                          "ContentText": "quantify"
                        },
                        {
                          "ContentText": "parse"
                        }
                      ]
                    },
                    "PostalAddress": {
                      "ID": [
                        "calculate",
                        "synthesize"
                      ],
                      "Postcode": "synthesize",
                      "StreetName": "input",
                      "CityName": "parse",
                      "CountryCode": "compress",
                      "CountryName": "program",
                      "CountrySubDivisionName": "quantify"
                    },
                    "TaxRegistration": {
                      "ID": "index"
                    },
                    "TraderRegistration": {
                      "ID": "navigate",
                      "TypeCode": "override",
                      "CountryCode": "parse"
                    }
                  }
                ],
                "AdditionalParticularsNote": [
                  {
                    "SubjectText": "parse",
                    "ContentCode": "ABV",
                    "ContentText": "navigate",
                    "SubjectCode": "ACG"
                  },
                  {
                    "SubjectText": "compress",
                    "ContentCode": "ABV",
                    "ContentText": "copy",
                    "SubjectCode": "ACG"
                  }
                ],
                "RelatedObservation": [
                  {
                    "SequenceNumber": "parse",
                    "Description": "connect",
                    "RelatedBinaryFile": [
                      {
                        "ID": "program",
                        "URI": "hack",
                        "MimeCode": "copy",
                        "EncodingCode": "hack",
                        "CharacterSizeCode": "generate",
                        "Size": "parse"
                      },
                      {
                        "ID": "copy",
                        "URI": "transmit",
                        "MimeCode": "calculate",
                        "EncodingCode": "synthesize",
                        "CharacterSizeCode": "index",
                        "Size": "index"
                      }
                    ],
                    "ApplicableNote": [
                      {
                        "SubjectText": "program",
                        "ContentCode": "AFM",
                        "ContentText": "program",
                        "SubjectCode": "ABE"
                      },
                      {
                        "SubjectText": "parse",
                        "ContentCode": "AFM",
                        "ContentText": "back up",
                        "SubjectCode": "ABE"
                      }
                    ]
                  },
                  {
                    "SequenceNumber": "input",
                    "Description": "hack",
                    "RelatedBinaryFile": [
                      {
                        "ID": "generate",
                        "URI": "reboot",
                        "MimeCode": "quantify",
                        "EncodingCode": "quantify",
                        "CharacterSizeCode": "calculate",
                        "Size": "program"
                      },
                      {
                        "ID": "quantify",
                        "URI": "parse",
                        "MimeCode": "copy",
                        "EncodingCode": "override",
                        "CharacterSizeCode": "reboot",
                        "Size": "calculate"
                      }
                    ],
                    "ApplicableNote": [
                      {
                        "SubjectText": "index",
                        "ContentCode": "AFM",
                        "ContentText": "transmit",
                        "SubjectCode": "ABE"
                      },
                      {
                        "SubjectText": "navigate",
                        "ContentCode": "AFM",
                        "ContentText": "hack",
                        "SubjectCode": "ABE"
                      }
                    ]
                  }
                ]
              },
              {
                "SequenceNumber": "quantify",
                "LogisticsStatusTypeCode": "calculate",
                "Description": "connect",
                "EstimatedOccurrenceDateTime": "navigate",
                "ActualOccurrenceDateTime": "input",
                "ScheduledOccurrenceDateTime": "navigate",
                "SpecifiedInstructions": [
                  {
                    "Description": "override",
                    "DescriptionCode": "bypass"
                  },
                  {
                    "Description": "transmit",
                    "DescriptionCode": "program"
                  }
                ],
                "OccurrenceLocation": {
                  "ID": "bypass",
                  "Name": "copy",
                  "TypeCode": "parse",
                  "Description": [
                    "override"
                  ],
                  "GeographicalCoordinates": {
                    "Altitude": "calculate",
                    "Latitude": "copy",
                    "Longitude": "synthesize",
                    "LatitudeDirectionIndicator": "synthesize",
                    "LongitudeDirectionIndicator": "compress",
                    "SystemId": "connect",
                    "ID": "override",
                    "AltimetricSystemId": "reboot"
                  },
                  "ServicingParty": {
                    "DefinedContact": [
                      {
                        "PersonName": "hack",
                        "Telephone": {
                          "CompleteNumber": "quantify"
                        },
                        "MobileTelephone": {
                          "CompleteNumber": "program"
                        }
                      },
                      {
                        "PersonName": "back up",
                        "Telephone": {
                          "CompleteNumber": "input"
                        },
                        "MobileTelephone": {
                          "CompleteNumber": "back up"
                        }
                      }
                    ]
                  }
                },
                "CertifyingParty": [
                  {
                    "ID": "program",
                    "Name": "hack",
                    "LanguageCode": "transmit",
                    "DefinedContactDetails": {
                      "PersonName": "quantify",
                      "Telephone": {
                        "CompleteNumber": "compress"
                      },
                      "MobileTelephone": {
                        "CompleteNumber": "compress"
                      },
                      "EmailAddress": {
                        "URI": "copy"
                      },
                      "Note": [
                        {
                          "ContentText": "hack"
                        },
                        {
                          "ContentText": "index"
                        }
                      ]
                    },
                    "PostalAddress": {
                      "ID": [
                        "generate",
                        "generate"
                      ],
                      "Postcode": "index",
                      "StreetName": "parse",
                      "CityName": "back up",
                      "CountryCode": "navigate",
                      "CountryName": "quantify",
                      "CountrySubDivisionName": "navigate"
                    },
                    "TaxRegistration": {
                      "ID": "index"
                    },
                    "TraderRegistration": {
                      "ID": "transmit",
                      "TypeCode": "reboot",
                      "CountryCode": "input"
                    }
                  },
                  {
                    "ID": "transmit",
                    "Name": "quantify",
                    "LanguageCode": "back up",
                    "DefinedContactDetails": {
                      "PersonName": "index",
                      "Telephone": {
                        "CompleteNumber": "reboot"
                      },
                      "MobileTelephone": {
                        "CompleteNumber": "calculate"
                      },
                      "EmailAddress": {
                        "URI": "reboot"
                      },
                      "Note": [
                        {
                          "ContentText": "reboot"
                        },
                        {
                          "ContentText": "back up"
                        }
                      ]
                    },
                    "PostalAddress": {
                      "ID": [
                        "bypass",
                        "quantify"
                      ],
                      "Postcode": "parse",
                      "StreetName": "calculate",
                      "CityName": "synthesize",
                      "CountryCode": "navigate",
                      "CountryName": "navigate",
                      "CountrySubDivisionName": "parse"
                    },
                    "TaxRegistration": {
                      "ID": "quantify"
                    },
                    "TraderRegistration": {
                      "ID": "index",
                      "TypeCode": "calculate",
                      "CountryCode": "index"
                    }
                  }
                ],
                "AdditionalParticularsNote": [
                  {
                    "SubjectText": "quantify",
                    "ContentCode": "ABV",
                    "ContentText": "calculate",
                    "SubjectCode": "ACG"
                  },
                  {
                    "SubjectText": "generate",
                    "ContentCode": "ABV",
                    "ContentText": "connect",
                    "SubjectCode": "ACG"
                  }
                ],
                "RelatedObservation": [
                  {
                    "SequenceNumber": "back up",
                    "Description": "bypass",
                    "RelatedBinaryFile": [
                      {
                        "ID": "calculate",
                        "URI": "parse",
                        "MimeCode": "back up",
                        "EncodingCode": "calculate",
                        "CharacterSizeCode": "parse",
                        "Size": "bypass"
                      },
                      {
                        "ID": "bypass",
                        "URI": "transmit",
                        "MimeCode": "compress",
                        "EncodingCode": "copy",
                        "CharacterSizeCode": "index",
                        "Size": "override"
                      }
                    ],
                    "ApplicableNote": [
                      {
                        "SubjectText": "bypass",
                        "ContentCode": "AFM",
                        "ContentText": "input",
                        "SubjectCode": "ABE"
                      },
                      {
                        "SubjectText": "reboot",
                        "ContentCode": "AFM",
                        "ContentText": "back up",
                        "SubjectCode": "ABE"
                      }
                    ]
                  },
                  {
                    "SequenceNumber": "parse",
                    "Description": "calculate",
                    "RelatedBinaryFile": [
                      {
                        "ID": "input",
                        "URI": "back up",
                        "MimeCode": "generate",
                        "EncodingCode": "reboot",
                        "CharacterSizeCode": "override",
                        "Size": "parse"
                      },
                      {
                        "ID": "calculate",
                        "URI": "input",
                        "MimeCode": "program",
                        "EncodingCode": "override",
                        "CharacterSizeCode": "copy",
                        "Size": "quantify"
                      }
                    ],
                    "ApplicableNote": [
                      {
                        "SubjectText": "quantify",
                        "ContentCode": "AFM",
                        "ContentText": "copy",
                        "SubjectCode": "ABE"
                      },
                      {
                        "SubjectText": "override",
                        "ContentCode": "AFM",
                        "ContentText": "synthesize",
                        "SubjectCode": "ABE"
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            "StageCode": "13",
            "ModeCode": "100",
            "UsedTransportMeans": {
              "TypeCode": "47",
              "RegistrationNumber": [
                "back up",
                "bypass"
              ],
              "RegistrationCountry": {
                "Code": "bypass"
              }
            },
            "EnRouteEvent": [
              {
                "SequenceNumber": "parse",
                "LogisticsStatusTypeCode": "program",
                "Description": "transmit",
                "EstimatedOccurrenceDateTime": "generate",
                "ActualOccurrenceDateTime": "reboot",
                "ScheduledOccurrenceDateTime": "compress",
                "SpecifiedInstructions": [
                  {
                    "Description": "quantify",
                    "DescriptionCode": "synthesize"
                  },
                  {
                    "Description": "calculate",
                    "DescriptionCode": "back up"
                  }
                ],
                "OccurrenceLocation": {
                  "ID": "quantify",
                  "Name": "copy",
                  "TypeCode": "navigate",
                  "Description": [
                    "index"
                  ],
                  "GeographicalCoordinates": {
                    "Altitude": "reboot",
                    "Latitude": "parse",
                    "Longitude": "compress",
                    "LatitudeDirectionIndicator": "back up",
                    "LongitudeDirectionIndicator": "quantify",
                    "SystemId": "back up",
                    "ID": "connect",
                    "AltimetricSystemId": "copy"
                  },
                  "ServicingParty": {
                    "DefinedContact": [
                      {
                        "PersonName": "navigate",
                        "Telephone": {
                          "CompleteNumber": "parse"
                        },
                        "MobileTelephone": {
                          "CompleteNumber": "quantify"
                        }
                      },
                      {
                        "PersonName": "program",
                        "Telephone": {
                          "CompleteNumber": "synthesize"
                        },
                        "MobileTelephone": {
                          "CompleteNumber": "connect"
                        }
                      }
                    ]
                  }
                },
                "CertifyingParty": [
                  {
                    "ID": "hack",
                    "Name": "copy",
                    "LanguageCode": "bypass",
                    "DefinedContactDetails": {
                      "PersonName": "program",
                      "Telephone": {
                        "CompleteNumber": "compress"
                      },
                      "MobileTelephone": {
                        "CompleteNumber": "reboot"
                      },
                      "EmailAddress": {
                        "URI": "index"
                      },
                      "Note": [
                        {
                          "ContentText": "navigate"
                        },
                        {
                          "ContentText": "calculate"
                        }
                      ]
                    },
                    "PostalAddress": {
                      "ID": [
                        "back up",
                        "copy"
                      ],
                      "Postcode": "reboot",
                      "StreetName": "compress",
                      "CityName": "program",
                      "CountryCode": "back up",
                      "CountryName": "compress",
                      "CountrySubDivisionName": "override"
                    },
                    "TaxRegistration": {
                      "ID": "bypass"
                    },
                    "TraderRegistration": {
                      "ID": "quantify",
                      "TypeCode": "synthesize",
                      "CountryCode": "reboot"
                    }
                  },
                  {
                    "ID": "quantify",
                    "Name": "calculate",
                    "LanguageCode": "synthesize",
                    "DefinedContactDetails": {
                      "PersonName": "synthesize",
                      "Telephone": {
                        "CompleteNumber": "bypass"
                      },
                      "MobileTelephone": {
                        "CompleteNumber": "connect"
                      },
                      "EmailAddress": {
                        "URI": "navigate"
                      },
                      "Note": [
                        {
                          "ContentText": "calculate"
                        },
                        {
                          "ContentText": "reboot"
                        }
                      ]
                    },
                    "PostalAddress": {
                      "ID": [
                        "input",
                        "generate"
                      ],
                      "Postcode": "reboot",
                      "StreetName": "generate",
                      "CityName": "program",
                      "CountryCode": "generate",
                      "CountryName": "index",
                      "CountrySubDivisionName": "parse"
                    },
                    "TaxRegistration": {
                      "ID": "parse"
                    },
                    "TraderRegistration": {
                      "ID": "navigate",
                      "TypeCode": "copy",
                      "CountryCode": "connect"
                    }
                  }
                ],
                "AdditionalParticularsNote": [
                  {
                    "SubjectText": "navigate",
                    "ContentCode": "ABV",
                    "ContentText": "bypass",
                    "SubjectCode": "ACG"
                  },
                  {
                    "SubjectText": "back up",
                    "ContentCode": "ABV",
                    "ContentText": "input",
                    "SubjectCode": "ACG"
                  }
                ],
                "RelatedObservation": [
                  {
                    "SequenceNumber": "calculate",
                    "Description": "transmit",
                    "RelatedBinaryFile": [
                      {
                        "ID": "synthesize",
                        "URI": "back up",
                        "MimeCode": "back up",
                        "EncodingCode": "compress",
                        "CharacterSizeCode": "calculate",
                        "Size": "parse"
                      },
                      {
                        "ID": "index",
                        "URI": "synthesize",
                        "MimeCode": "quantify",
                        "EncodingCode": "transmit",
                        "CharacterSizeCode": "calculate",
                        "Size": "override"
                      }
                    ],
                    "ApplicableNote": [
                      {
                        "SubjectText": "back up",
                        "ContentCode": "AFM",
                        "ContentText": "transmit",
                        "SubjectCode": "ABE"
                      },
                      {
                        "SubjectText": "index",
                        "ContentCode": "AFM",
                        "ContentText": "index",
                        "SubjectCode": "ABE"
                      }
                    ]
                  },
                  {
                    "SequenceNumber": "quantify",
                    "Description": "copy",
                    "RelatedBinaryFile": [
                      {
                        "ID": "bypass",
                        "URI": "generate",
                        "MimeCode": "calculate",
                        "EncodingCode": "synthesize",
                        "CharacterSizeCode": "program",
                        "Size": "input"
                      },
                      {
                        "ID": "generate",
                        "URI": "override",
                        "MimeCode": "copy",
                        "EncodingCode": "quantify",
                        "CharacterSizeCode": "parse",
                        "Size": "bypass"
                      }
                    ],
                    "ApplicableNote": [
                      {
                        "SubjectText": "reboot",
                        "ContentCode": "AFM",
                        "ContentText": "synthesize",
                        "SubjectCode": "ABE"
                      },
                      {
                        "SubjectText": "compress",
                        "ContentCode": "AFM",
                        "ContentText": "transmit",
                        "SubjectCode": "ABE"
                      }
                    ]
                  }
                ]
              },
              {
                "SequenceNumber": "synthesize",
                "LogisticsStatusTypeCode": "quantify",
                "Description": "connect",
                "EstimatedOccurrenceDateTime": "copy",
                "ActualOccurrenceDateTime": "transmit",
                "ScheduledOccurrenceDateTime": "transmit",
                "SpecifiedInstructions": [
                  {
                    "Description": "bypass",
                    "DescriptionCode": "program"
                  },
                  {
                    "Description": "navigate",
                    "DescriptionCode": "compress"
                  }
                ],
                "OccurrenceLocation": {
                  "ID": "generate",
                  "Name": "quantify",
                  "TypeCode": "reboot",
                  "Description": [
                    "connect"
                  ],
                  "GeographicalCoordinates": {
                    "Altitude": "parse",
                    "Latitude": "back up",
                    "Longitude": "connect",
                    "LatitudeDirectionIndicator": "parse",
                    "LongitudeDirectionIndicator": "quantify",
                    "SystemId": "transmit",
                    "ID": "reboot",
                    "AltimetricSystemId": "synthesize"
                  },
                  "ServicingParty": {
                    "DefinedContact": [
                      {
                        "PersonName": "hack",
                        "Telephone": {
                          "CompleteNumber": "bypass"
                        },
                        "MobileTelephone": {
                          "CompleteNumber": "index"
                        }
                      },
                      {
                        "PersonName": "quantify",
                        "Telephone": {
                          "CompleteNumber": "transmit"
                        },
                        "MobileTelephone": {
                          "CompleteNumber": "reboot"
                        }
                      }
                    ]
                  }
                },
                "CertifyingParty": [
                  {
                    "ID": "index",
                    "Name": "input",
                    "LanguageCode": "program",
                    "DefinedContactDetails": {
                      "PersonName": "calculate",
                      "Telephone": {
                        "CompleteNumber": "navigate"
                      },
                      "MobileTelephone": {
                        "CompleteNumber": "input"
                      },
                      "EmailAddress": {
                        "URI": "copy"
                      },
                      "Note": [
                        {
                          "ContentText": "copy"
                        },
                        {
                          "ContentText": "transmit"
                        }
                      ]
                    },
                    "PostalAddress": {
                      "ID": [
                        "reboot",
                        "synthesize"
                      ],
                      "Postcode": "reboot",
                      "StreetName": "generate",
                      "CityName": "connect",
                      "CountryCode": "calculate",
                      "CountryName": "compress",
                      "CountrySubDivisionName": "transmit"
                    },
                    "TaxRegistration": {
                      "ID": "back up"
                    },
                    "TraderRegistration": {
                      "ID": "override",
                      "TypeCode": "compress",
                      "CountryCode": "program"
                    }
                  },
                  {
                    "ID": "bypass",
                    "Name": "connect",
                    "LanguageCode": "calculate",
                    "DefinedContactDetails": {
                      "PersonName": "navigate",
                      "Telephone": {
                        "CompleteNumber": "generate"
                      },
                      "MobileTelephone": {
                        "CompleteNumber": "input"
                      },
                      "EmailAddress": {
                        "URI": "back up"
                      },
                      "Note": [
                        {
                          "ContentText": "hack"
                        },
                        {
                          "ContentText": "synthesize"
                        }
                      ]
                    },
                    "PostalAddress": {
                      "ID": [
                        "quantify",
                        "parse"
                      ],
                      "Postcode": "index",
                      "StreetName": "index",
                      "CityName": "navigate",
                      "CountryCode": "copy",
                      "CountryName": "connect",
                      "CountrySubDivisionName": "program"
                    },
                    "TaxRegistration": {
                      "ID": "synthesize"
                    },
                    "TraderRegistration": {
                      "ID": "copy",
                      "TypeCode": "transmit",
                      "CountryCode": "copy"
                    }
                  }
                ],
                "AdditionalParticularsNote": [
                  {
                    "SubjectText": "quantify",
                    "ContentCode": "ABV",
                    "ContentText": "bypass",
                    "SubjectCode": "ACG"
                  },
                  {
                    "SubjectText": "reboot",
                    "ContentCode": "ABV",
                    "ContentText": "hack",
                    "SubjectCode": "ACG"
                  }
                ],
                "RelatedObservation": [
                  {
                    "SequenceNumber": "index",
                    "Description": "generate",
                    "RelatedBinaryFile": [
                      {
                        "ID": "program",
                        "URI": "program",
                        "MimeCode": "copy",
                        "EncodingCode": "navigate",
                        "CharacterSizeCode": "program",
                        "Size": "bypass"
                      },
                      {
                        "ID": "navigate",
                        "URI": "override",
                        "MimeCode": "quantify",
                        "EncodingCode": "copy",
                        "CharacterSizeCode": "back up",
                        "Size": "calculate"
                      }
                    ],
                    "ApplicableNote": [
                      {
                        "SubjectText": "back up",
                        "ContentCode": "AFM",
                        "ContentText": "calculate",
                        "SubjectCode": "ABE"
                      },
                      {
                        "SubjectText": "index",
                        "ContentCode": "AFM",
                        "ContentText": "transmit",
                        "SubjectCode": "ABE"
                      }
                    ]
                  },
                  {
                    "SequenceNumber": "quantify",
                    "Description": "program",
                    "RelatedBinaryFile": [
                      {
                        "ID": "bypass",
                        "URI": "back up",
                        "MimeCode": "quantify",
                        "EncodingCode": "compress",
                        "CharacterSizeCode": "override",
                        "Size": "copy"
                      },
                      {
                        "ID": "bypass",
                        "URI": "hack",
                        "MimeCode": "bypass",
                        "EncodingCode": "program",
                        "CharacterSizeCode": "index",
                        "Size": "bypass"
                      }
                    ],
                    "ApplicableNote": [
                      {
                        "SubjectText": "override",
                        "ContentCode": "AFM",
                        "ContentText": "reboot",
                        "SubjectCode": "ABE"
                      },
                      {
                        "SubjectText": "bypass",
                        "ContentCode": "AFM",
                        "ContentText": "transmit",
                        "SubjectCode": "ABE"
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ],
        "SpecifiedDeliveryTerms": {
          "Code": "compress",
          "RelevantLocation": {
            "ID": "compress"
          }
        },
        "ApplicableServiceCharge": [
          {
            "PaymentArrangementCode": "parse",
            "CategoryCode": "hack",
            "AppliedAmount": "bypass",
            "PayingPartyRoleCode": "generate"
          },
          {
            "PaymentArrangementCode": "index",
            "CategoryCode": "copy",
            "AppliedAmount": "parse",
            "PayingPartyRoleCode": "calculate"
          }
        ],
        "TransportPackage": [
          {
            "ItemQuantity": "program",
            "LevelCode": "index",
            "TypeCode": "connect",
            "TypeText": "back up",
            "ID": "parse",
            "ReturnableIndicator": "connect",
            "ShippingMarks": [
              {
                "MarkingText": "copy",
                "BarcodeLabel": [
                  {
                    "ID": "back up"
                  },
                  {
                    "ID": "navigate"
                  }
                ]
              },
              {
                "MarkingText": "input",
                "BarcodeLabel": [
                  {
                    "ID": "transmit"
                  },
                  {
                    "ID": "hack"
                  }
                ]
              }
            ]
          },
          {
            "ItemQuantity": "navigate",
            "LevelCode": "back up",
            "TypeCode": "back up",
            "TypeText": "hack",
            "ID": "connect",
            "ReturnableIndicator": "synthesize",
            "ShippingMarks": [
              {
                "MarkingText": "bypass",
                "BarcodeLabel": [
                  {
                    "ID": "back up"
                  },
                  {
                    "ID": "compress"
                  }
                ]
              },
              {
                "MarkingText": "program",
                "BarcodeLabel": [
                  {
                    "ID": "hack"
                  },
                  {
                    "ID": "copy"
                  }
                ]
              }
            ]
          }
        ],
        "ConsignorProvidedRegulatoryFormalitiesInstructions": [
          {
            "Description": "program",
            "DescriptionCode": "input"
          },
          {
            "Description": "hack",
            "DescriptionCode": "navigate"
          }
        ],
        "DeliveryInstructionsAndRelatedServices": [
          {
            "Description": "override",
            "DescriptionCode": "transmit"
          },
          {
            "Description": "parse",
            "DescriptionCode": "bypass"
          }
        ],
        "PreviousAdministrativeDocument": [
          {
            "ID": "parse",
            "TypeCode": "index",
            "Remark": [
              "back up",
              "transmit"
            ],
            "FormattedIssueDateTime": "connect",
            "EffectivePeriod": {
              "StartDateTime": "override",
              "EndDateTime": "bypass"
            },
            "AttachedBinaryFile": [
              {
                "ID": "connect",
                "URI": "override",
                "MimeCode": "hack",
                "EncodingCode": "connect",
                "CharacterSizeCode": "hack",
                "Size": "compress"
              },
              {
                "ID": "index",
                "URI": "navigate",
                "MimeCode": "input",
                "EncodingCode": "index",
                "CharacterSizeCode": "calculate",
                "Size": "index"
              }
            ]
          },
          {
            "ID": "reboot",
            "TypeCode": "transmit",
            "Remark": [
              "bypass",
              "parse"
            ],
            "FormattedIssueDateTime": "transmit",
            "EffectivePeriod": {
              "StartDateTime": "quantify",
              "EndDateTime": "synthesize"
            },
            "AttachedBinaryFile": [
              {
                "ID": "transmit",
                "URI": "parse",
                "MimeCode": "transmit",
                "EncodingCode": "bypass",
                "CharacterSizeCode": "copy",
                "Size": "connect"
              },
              {
                "ID": "override",
                "URI": "program",
                "MimeCode": "navigate",
                "EncodingCode": "calculate",
                "CharacterSizeCode": "navigate",
                "Size": "back up"
              }
            ]
          }
        ],
        "AdditionalParticularsNote": [
          {
            "SubjectText": "index",
            "ContentCode": "AII",
            "ContentText": "synthesize",
            "SubjectCode": "CLP"
          },
          {
            "SubjectText": "override",
            "ContentCode": "AII",
            "ContentText": "quantify",
            "SubjectCode": "CLP"
          }
        ],
        "TransportServiceBuyer": {
          "ID": "input",
          "Name": "navigate",
          "RoleCode": "transmit",
          "LanguageCode": "index",
          "DefinedContactDetails": {
            "PersonName": "override",
            "Telephone": {
              "CompleteNumber": "index"
            },
            "MobileTelephone": {
              "CompleteNumber": "bypass"
            },
            "EmailAddress": {
              "URI": "connect"
            },
            "Note": [
              {
                "ContentText": "reboot"
              },
              {
                "ContentText": "quantify"
              }
            ]
          },
          "PostalAddress": {
            "ID": [
              "input",
              "quantify"
            ],
            "Postcode": "back up",
            "StreetName": "hack",
            "CityName": "calculate",
            "CountryCode": "hack",
            "CountryName": "index",
            "CountrySubDivisionName": "override"
          },
          "TaxRegistration": [
            {
              "ID": "navigate"
            },
            {
              "ID": "synthesize"
            }
          ],
          "TraderRegistration": [
            {
              "ID": "index",
              "TypeCode": "calculate",
              "CountryCode": "back up"
            },
            {
              "ID": "synthesize",
              "TypeCode": "navigate",
              "CountryCode": "override"
            }
          ]
        }
      }
    });
  // const endDate = Date.now();
  // @ts-ignore
  // console.log('Mam roznice: ', endDate - date);
}
