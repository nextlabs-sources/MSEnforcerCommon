require('dotenv').config()

const database = {
    name: 'azure_enforcer',
    url: process.env.DB_URL || 'https://cloudazpep.documents.azure.com:443/',
    key: process.env.DB_KEY || 'DtkYf7lN9keao1FrMq1b8KitkPddSixxDrXYLTK80KDjM8UEHyZIojyGVkkx8Rk97XbbcqeqBH4s0P2v9a6kQQ'
}

const table = {
    signups: 'signups',
    secured_entities: 'entities',
    user_attributes: 'user_attributes',
    general_settings: 'general_settings',
    proxies: 'proxies',
    accounts: 'accounts',
}

const parasiticDB = {
    name: 'nxl_em',
    schema: 'NXLSQLEnforce',
    tables: {
        user: 'nxl_users'
    },
    account: {
        name: 'nxluser',
        password: '123blue!',
    }
}

const misc = {
    jpcSuffix: 'dpc/authorization/pdp',
    ccSuffix: 'cas/token',
    jpcTestBody: {
        'Request': {
            'ReturnPolicyIdList': true,
            'Category': [
                {
                    'CategoryId': 'urn:oasis:names:tc:xacml:3.0:attribute-category:environment',
                    'Attribute': [
                        {
                            'AttributeId': 'urn:oasis:names:tc:xacml:1.0:environment:dont-care-acceptable',
                            'Value': 'yes',
                            'DataType': 'http://www.w3.org/2001/XMLSchema#string',
                            'IncludeInResult': false
                        }
                    ]
                },
                {
                    'CategoryId': 'urn:oasis:names:tc:xacml:1.0:subject-category:access-subject',
                    'Attribute': [
                        {
                            'AttributeId': 'urn:oasis:names:tc:xacml:1.0:subject:subject-id',
                            'Value': 'Joe',
                            'IncludeInResult': false
                        }
                    ]
                },
                {
                    'CategoryId': 'urn:oasis:names:tc:xacml:3.0:attribute-category:resource',
                    'Attribute': [
                        {
                            'AttributeId': 'urn:oasis:names:tc:xacml:1.0:resource:resource-id',
                            'Value': 'Gengar',
                            'DataType': 'http://www.w3.org/2001/XMLSchema#anyURI',
                            'IncludeInResult': false
                        },
                        {
                            'AttributeId': 'urn:nextlabs:names:evalsvc:1.0:resource:resource-type',
                            'Value': 'Ghost',
                            'DataType': 'http://www.w3.org/2001/XMLSchema#anyURI',
                            'IncludeInResult': false
                        }
                    ]
                },
                {
                    'CategoryId': 'urn:oasis:names:tc:xacml:3.0:attribute-category:action',
                    'Attribute': [
                        {
                            'AttributeId': 'urn:oasis:names:tc:xacml:1.0:action:action-id',
                            'Value': 'EVOLVE',
                            'DataType': 'http://www.w3.org/2001/XMLSchema#string',
                            'IncludeInResult': false
                        }
                    ]
                }
            ]
        }
    },
    supportedSQLTypes: [
        'tinyint',
        'smallint',
        'int',
        'bigint',
        'decimal',
        'float',
        'numberic',
        'char',
        'text',
        'varchar',
        'nchar',
        'ntext',
        'nvarchar',
        'bit',
    ]
}

const port = Number(process.env.PORT) || 4000

module.exports = {
    port,
    database,
    table,
    parasiticDB,
    misc,
}