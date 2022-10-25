const ATTRIBUTE_VALUE_TYPES = {
    STRING: 'STRING',
    NUMBER: 'NUMBER',
    MULTI_VAL: 'MULTIVAL',
}

const ATTRIBUTE_OPERATORS = {
    [ATTRIBUTE_VALUE_TYPES.STRING]: [
        {
            'id': 0,
            'key': '=',
            'label': 'is',
            'dataType': 'STRING'
        },
        {
            'id': 1,
            'key': '!=',
            'label': 'is not',
            'dataType': 'STRING'
        }
    ],
    [ATTRIBUTE_VALUE_TYPES.NUMBER]: [
        {
            'id': 0,
            'key': '<',
            'label': '<',
            'dataType': 'NUMBER'
        },
        {
            'id': 1,
            'key': '<=',
            'label': '<=',
            'dataType': 'NUMBER'
        },
        {
            'id': 2,
            'key': '=',
            'label': '=',
            'dataType': 'NUMBER'
        },
        {
            'id': 3,
            'key': '>',
            'label': '>',
            'dataType': 'NUMBER'
        },
        {
            'id': 4,
            'key': '>=',
            'label': '>=',
            'dataType': 'NUMBER'
        },
        {
            'id': 5,
            'key': '!=',
            'label': '!=',
            'dataType': 'NUMBER'
        }
    ]
}

const OBLIGATION_VALUE_TYPE = {
    LIST: 'LIST',
    SINGLE_LINE_TEXT: 'TEXT_SINGLE_ROW',
    MULTI_LINE_TEXT: 'TEXT_MULTIPLE_ROW',
}

class PolicyHelper {

    static createObligation(name, shortName) {
        if(!name || !shortName) {
            throw new Error('obligation name & shortName must not be empty')
        }

        return {
            name,
            shortName: shortName.toLowerCase(),
            runAt: 'PEP',
            parameters: []
        }
    }

    static createObligationParam(name, shortName, options) {
        if(!name || !shortName) {
            throw new Error('param name & shortName must not be empty')
        }

        return {
            'name': name,
            'shortName': shortName.toLowerCase(),
            'type': 'LIST',
            'defaultValue': null,
            'listValues': '',
            'hidden': false,
            'editable': false,
            'mandatory': false,
            ...options,
        }
    }

    constructor(entityBinder, attributeBinder, typeConverter) {

        if (typeof typeConverter !== 'function') {
            throw new Error('typeConverter must be function')
        }

        this.paramIndex = 0
        this.entityBinder = entityBinder
        this.attributeBinder = attributeBinder
        this.typeConverter = typeConverter
        this.root = {
            'policyModels': [],
            'components': [],
            'policyTree': {},
            'importedPolicyIds': [],
            'overrideDuplicates': false,
            'componentToSubCompMap': {}
        }
        this.entities = {}
        this.obligations = {}
        this.actions = []
    }

    addActions(actions) {
        if (!Array.isArray(actions)) {
            throw new Error('actions must be array type')
        }

        this.actions = actions
        return this
    }

    addEntities(entities, type) {

        if (!Array.isArray(entities)) {
            throw new Error('entities must be array type')
        }

        if (this.actions.length === 0) {
            throw new Error('actions must be added before adding entities')
        }

        //const nameProp = this.entityBinder['name']
        const shortNameProp = this.entityBinder['shortName']
        const descProp = this.entityBinder['description']

        entities.forEach((e, index) => {
            const uniqueName = `${e.server}/${e.database}/${e.schema}/${e[shortNameProp]}`.toLowerCase()
            this.entities[uniqueName] = {
                id: index,
                name: uniqueName,
                shortName: uniqueName,
                description: e[descProp],
                type,
                status: 'ACTIVE',
                attributes: [],
                actions: this.actions.map((a, index) => { return { id: index, name: a, shortName: a/*`${e[shortNameProp]}_${a}`*/, sortOrder: index } }),
                obligations: [],
            }
        })

        return this
    }

    addAttributes(attributes, entityShortName) {

        if (!Array.isArray(attributes)) {
            throw new Error('attributes must be array type')
        }
        const parent = this.entities[entityShortName.toLowerCase()]

        if (!parent) {
            throw new Error(`entity '${entityShortName}' must be added before adding its attributes`)
        }

        const attrs = parent.attributes
        const nameProp = this.attributeBinder['name']
        const shortNameProp = this.attributeBinder['shortName']
        const typeProp = this.attributeBinder['dataType']

        attributes.forEach((attr, index) => {
            const attrType = this.typeConverter(attr[typeProp])
            attrs.push({
                id: index,
                name: attr[nameProp],
                shortName: attr[shortNameProp].toLowerCase(),
                sortOrder: index,
                dataType: attrType,
                operatorConfigs: ATTRIBUTE_OPERATORS[attrType]
            })
        })

        return this
    }

    addObligations(obligations, entityShortName) {

        if (!Array.isArray(obligations)) {
            throw new Error('obligations must be array type')
        }

        const parent = this.entities[entityShortName.toLowerCase()]

        if (!parent) {
            throw new Error(`entity '${entityShortName}' must be added before adding its obligations`)
        }        

        obligations.forEach((ob, index) => {
            this.obligations[`${entityShortName.toLowerCase()}/${ob.shortName.toLowerCase()}`] = {
                ...ob,
                sortOrder: index,
            }
        })

        return this
    }

    addParams(params, obligationShortName, entityShortName) {
        if (!Array.isArray(params)) {
            throw new Error('params must be array type')
        }

        const parent = this.obligations[`${entityShortName.toLowerCase()}/${obligationShortName.toLowerCase()}`]

        if (!parent) {
            throw new Error(`obligation '${obligationShortName}' must be added before adding its params`)
        }

        params.forEach((param, index) => {
            parent.parameters.push({
                ...param,
                sortOrder: this.paramIndex,
            })
            this.paramIndex++
        })

        return this
    }

    toJSON() {

        const components = []
        const policyModels = Object.keys(this.entities).map((k, kIndex) => {
            const obs = Object.keys(this.obligations).filter(obKey => obKey.slice(0, obKey.lastIndexOf('/')) === k).map(obKey => this.obligations[obKey])

            this.entities[k].obligations = this.entities[k].obligations.concat(obs)
            this.actions.forEach((action, actIndex) => {
                components.push({
                    id: kIndex + actIndex,
                    name: action,
                    description: 'This is a system generated Action component. Deleting the same Action in policy model definition will delete this Action component',
                    type: 'ACTION',
                    category: 'COMPONENT',
                    policyModel: { id: this.entities[k].id },
                    actions: [
                        action//`${k}_${action}`
                    ],
                    status: 'APPROVED',
                })
            })
            this.entities[k].name = PolicyHelper.escapePolicyModelName(this.entities[k].name)
            this.entities[k].shortName = PolicyHelper.escapePolicyModelName(this.entities[k].shortName)
            return this.entities[k]
        })

        this.root.policyModels = policyModels
        this.root.components = components

        console.log(this)

        return JSON.stringify(this.root)
    }

    /**
     * inject sqlserver, database, schema, table attributes in every policy model
     *
     * @param {string} entityShortName
     * @memberof PolicyHelper
     * @return {PolicyHelper}
     */
    injectSQLAttributes(entityShortName) {
        const parent = this.entities[entityShortName.toLowerCase()]

        if (!parent) {
            throw new Error(`entity '${entityShortName}' must be added before injecting attributes`)
        }

        const attrs = parent.attributes
        const index = attrs.length

        attrs.push(
            {
                id: index,
                name: 'SQLServer',
                shortName: 'sqlserver',
                sortOrder: index,
                dataType: ATTRIBUTE_VALUE_TYPES.STRING,
                operatorConfigs: ATTRIBUTE_OPERATORS[ATTRIBUTE_VALUE_TYPES.STRING]                
            },
            {
                id: index + 1,
                name: 'Database',
                shortName: 'database',
                sortOrder: index + 1,
                dataType: ATTRIBUTE_VALUE_TYPES.STRING,
                operatorConfigs: ATTRIBUTE_OPERATORS[ATTRIBUTE_VALUE_TYPES.STRING]                
            },
            // {
            //     id: index + 2,
            //     name: 'Schema',
            //     shortName: 'schema',
            //     sortOrder: index + 1,
            //     dataType: ATTRIBUTE_VALUE_TYPES.STRING,
            //     operatorConfigs: ATTRIBUTE_OPERATORS[ATTRIBUTE_VALUE_TYPES.STRING]                
            // },            
            {
                id: index + 2,
                name: 'Table',
                shortName: 'table',
                sortOrder: index + 2,
                dataType: ATTRIBUTE_VALUE_TYPES.STRING,
                operatorConfigs: ATTRIBUTE_OPERATORS[ATTRIBUTE_VALUE_TYPES.STRING]                
            }
        )
        
        return this
    }
    
    static escapePolicyModelName(policyModelName) {
        if(typeof policyModelName !== 'string') {
            throw new Error('policy name must be string type')
        }

        const dotPos = policyModelName.indexOf('.')
        const slashPos = policyModelName.indexOf('/')
        const serverName = policyModelName.slice(0, dotPos)
        const suffixName = policyModelName.slice(slashPos)

        policyModelName = serverName + suffixName
        return policyModelName.replace(/\W/gi, '_')
    }
}

export default {
    PolicyHelper,
    ATTRIBUTE_VALUE_TYPES,
    ATTRIBUTE_OPERATORS,
    OBLIGATION_VALUE_TYPE,
}