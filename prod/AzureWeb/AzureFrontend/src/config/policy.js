import utils from '../utils'
const { PolicyModel: { ATTRIBUTE_VALUE_TYPES } } = utils

export default {
    actions: ['VIEW', 'CREATE', 'EDIT', 'DELETE'],
    resourceType: {
        subject: 'SUBJECT',
        resource: 'RESOURCE',
    },
    typeConverter: dataType => {
        switch(dataType) {
            case 'tinyint':
            case 'smallint':
            case 'int':
            case 'bigint':
            case 'decimal':
            case 'float':
            case 'numberic': {
                return ATTRIBUTE_VALUE_TYPES.NUMBER
            }
            default: {
                return ATTRIBUTE_VALUE_TYPES.STRING
            }
        }
    },
    obligations: {
        alert_message: {
            name: 'Alert Message',
            shortName: 'alert_message',
        },
        apply_secure_filter: {
            name: 'Apply Security Filter',
            shortName: 'apply_security_filter',
        },
        apply_user_filter: {
            name: 'Apply User Filter',
            shortName: 'apply_user_filter',
        },
        mask_field: {
            name: 'Mask Field',
            shortName: 'mask_field',
        },      
        policy_name: {
            name: 'Policy Name',
            shortName: 'policy_name',
        },
        operators: 'is,is not,greater than,greater than or equals to,less than,less than or equals to,is null,is not null,like,not like',
    },
}