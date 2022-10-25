import { setSESaveLoading, saveTablesError, addColumns, addColumnsError, exportTablesError, } from '../../actions/creators'
import utils from '../../utils'
import config from '../../config'
import defaultOptions from '../../defaultOption'
const { PolicyModel: { PolicyHelper, OBLIGATION_VALUE_TYPE }, HttpUtil, Aux, } = utils

const saveEnforcedEntities = (dispatch, getState) => {

    dispatch(setSESaveLoading(true))

    const { app: { uid }, conn: { tables, enforcer }, misc: { current_server, current_database } } = getState()
    const tableEnforcers = enforcer.tables
    const tablesEnforced = (
        Object.keys(tableEnforcers)
            .filter(tk => (tableEnforcers[tk].willbeEnforced && tables[tk] && tables[tk].server === current_server && tables[tk].database === current_database))
            .map(tk => {
                const table = tables[tk]
                return {
                    name: table.name,
                    schema: table.schema,
                }
            })
    )
    const url = `/api/tables/${uid}?server=${current_server}&database=${current_database}`
    const AuthFetch = Aux.AuthFetchEnhancer(dispatch, getState)

    AuthFetch(url, {
        ...defaultOptions,
        method: 'POST',
        body: JSON.stringify(tablesEnforced)
    })
        .then(res => {
            dispatch(setSESaveLoading(false))
            return Promise.resolve()
        })
        .catch(error => {
            dispatch(setSESaveLoading(false))
            dispatch(saveTablesError(error.message))
        })
}

const fetchColumns = (server, database, schema, table) => (dispatch, getState) => {
    const { app: { uid } } = getState()
    const url = `/api/columns/meta/${uid}?server=${server}&database=${database}&schema=${schema}&table=${table}`
    const AuthFetch = Aux.AuthFetchEnhancer(dispatch, getState)

    if (uid && server && database && table) {
        return AuthFetch(url, defaultOptions)
            .then((payload) => {
                dispatch(addColumns(payload))
                return Promise.resolve()
            })
            .catch((error) => {
                dispatch(addColumnsError(error))
                return Promise.resolve()
            })
    } else {
        console.log(`columns fetched or params invalid`, uid, server, database, table)
        return Promise.reject(new Error('columns fetched or params invalid'))
    }
}

const checkUserAttributes = (dispatch, getState) => {
    const { user_attributes: { attributes, enforcer, } } = getState()

    if (Object.keys(attributes).length > 0) {
        const enforcedUANames = Object.keys(enforcer).filter(k => enforcer[k].willbeEnforced).map(k => attributes[k].name)
        return Promise.resolve(enforcedUANames)
    } else {
        return Promise.reject(new Error(config.Toast.exportUAError))
    }
}

const exportEnforcedEntities = (dispatch, getState) => {
    const { conn: { tables, enforcer }, misc: { current_server, current_database } } = getState()
    const enforcedTables = enforcer.tables

    checkUserAttributes(dispatch, getState)
        .then((enforcedUserAttrNames) => {
            saveEnforcedEntities(dispatch, getState)
            dispatch(setSESaveLoading(true))

            const tablesEnforced = Object.keys(enforcedTables)
                .filter(tk => {
                    return (
                        enforcedTables[tk].willbeEnforced &&
                        tables[tk] &&
                        tables[tk].server === current_server &&
                        tables[tk].database === current_database
                    )
                })
                .map(tk => tables[tk])
            const fetchColsOperations = tablesEnforced.map(t => fetchColumns(t.server, t.database, t.schema, t.name)(dispatch, getState))
            const asfOperators = config.Policy.obligations.operators
            const aufOperators = config.Policy.obligations.operators.slice(0, config.Policy.obligations.operators.indexOf('like') - 1)

            Promise.all(fetchColsOperations)
                .then(() => {
                    const entityBinder = {
                        name: 'name',
                        shortName: 'name',
                        description: 'description',
                    }
                    const attrBinder = {
                        name: 'name',
                        shortName: 'name',
                        dataType: 'type',
                    }
                    const policyHelper = new PolicyHelper(entityBinder, attrBinder, config.Policy.typeConverter)
                    const { conn: { columns } } = getState()
                    const colKeys = Object.keys(columns)

                    policyHelper.addActions(config.Policy.actions)
                        .addEntities(tablesEnforced, config.Policy.resourceType.resource)

                    tablesEnforced.forEach(t => {
                        const tableUniqueName = `${t.server}/${t.database}/${t.schema}/${t.name}`.toLowerCase()
                        const enforcedAttrs = colKeys.filter(ck => {
                            return (
                                columns[ck] &&
                                columns[ck].table === t.name &&
                                columns[ck].schema === t.schema &&
                                columns[ck].database === t.database &&
                                columns[ck].server === t.server
                            )
                        }).map(ck => columns[ck])
                        const enforcedAttrShortNames = enforcedAttrs.map(a => a.name)
                        //const alertMsgOb = PolicyHelper.createObligation(config.Policy.obligations.alert_message.name, config.Policy.obligations.alert_message.shortName)
                        const applySecureFilterOb = PolicyHelper.createObligation(config.Policy.obligations.apply_secure_filter.name, config.Policy.obligations.apply_secure_filter.shortName)
                        const applyUserFilterOb = PolicyHelper.createObligation(config.Policy.obligations.apply_user_filter.name, config.Policy.obligations.apply_user_filter.shortName)
                        //const maskFieldOb = PolicyHelper.createObligation(config.Policy.obligations.mask_field.name, config.Policy.obligations.mask_field.shortName)
                        const applySecureFilterObPolicyNameParam = PolicyHelper.createObligationParam(config.Policy.obligations.policy_name.name, config.Policy.obligations.policy_name.shortName, {
                            type: OBLIGATION_VALUE_TYPE.MULTI_LINE_TEXT,
                            editable: true,
                            mandatory: true,
                        })
                        const applyUserFilterObPolicyNameParam = PolicyHelper.createObligationParam(config.Policy.obligations.policy_name.name, config.Policy.obligations.policy_name.shortName, {
                            type: OBLIGATION_VALUE_TYPE.MULTI_LINE_TEXT,
                            editable: true,
                            mandatory: true,
                        })
                        // const maskFieldObPolicyNameParam = PolicyHelper.createObligationParam(config.Policy.obligations.policy_name.name, config.Policy.obligations.policy_name.shortName, {
                        //     type: OBLIGATION_VALUE_TYPE.MULTI_LINE_TEXT,
                        //     editable: true,
                        //     mandatory: true,
                        // })
                        // const maskFieldObParamValue = PolicyHelper.createObligationParam('Mask Character', 'mask_character', {
                        //     type: OBLIGATION_VALUE_TYPE.SINGLE_LINE_TEXT,
                        //     editable: true,
                        // })                                                   
                          
                        policyHelper.addObligations([
                            //alertMsgOb,
                            applySecureFilterOb,
                            applyUserFilterOb,
                            //maskFieldOb,
                        ], tableUniqueName)

                        policyHelper.addParams([applySecureFilterObPolicyNameParam], config.Policy.obligations.apply_secure_filter.shortName, tableUniqueName)
                        policyHelper.addParams([applyUserFilterObPolicyNameParam], config.Policy.obligations.apply_user_filter.shortName, tableUniqueName)
                        //policyHelper.addParams([maskFieldObPolicyNameParam, maskFieldObParamValue], config.Policy.obligations.mask_field.shortName, tableUniqueName)
                        

                        for (let i = 0; i < 5; i++) {
                            const applySecureFilterObParamField = PolicyHelper.createObligationParam(`Field${i + 1}`, `field${i + 1}`, {
                                type: OBLIGATION_VALUE_TYPE.LIST,
                                listValues: enforcedAttrShortNames.join(','),
                                editable: true,
                                mandatory: i === 0
                            })
                            const applySecureFilterObParamOperator = PolicyHelper.createObligationParam(`Operator${i + 1}`, `operator${i + 1}`, {
                                type: OBLIGATION_VALUE_TYPE.LIST,
                                listValues: asfOperators,
                                editable: true,
                            })
                            const applySecureFilterObParamValue = PolicyHelper.createObligationParam(`Value${i + 1}`, `value${i + 1}`, {
                                type: OBLIGATION_VALUE_TYPE.SINGLE_LINE_TEXT,
                                editable: true,
                            })
                            const applyUserFilterObParamField = PolicyHelper.createObligationParam(`Field${i + 1}`, `field${i + 1}`, {
                                type: OBLIGATION_VALUE_TYPE.LIST,
                                listValues: enforcedUserAttrNames.join(','),
                                editable: true,
                                mandatory: i === 0
                            })
                            const applyUserFilterObParamOperator = PolicyHelper.createObligationParam(`Operator${i + 1}`, `operator${i + 1}`, {
                                type: OBLIGATION_VALUE_TYPE.LIST,
                                listValues: aufOperators,
                                editable: true,
                            })
                            const applyUserFilterObParamValue = PolicyHelper.createObligationParam(`Value${i + 1}`, `value${i + 1}`, {
                                type: OBLIGATION_VALUE_TYPE.SINGLE_LINE_TEXT,
                                editable: true,
                            })
                            // const maskFieldObParamField = PolicyHelper.createObligationParam(`Mask Field${i + 1}`, `mask_field${i + 1}`, {
                            //     type: OBLIGATION_VALUE_TYPE.LIST,
                            //     listValues: enforcedAttrShortNames.join(','),
                            //     editable: true,
                            // })                                                      

                            policyHelper.addParams([
                                applySecureFilterObParamField,
                                applySecureFilterObParamOperator,
                                applySecureFilterObParamValue
                            ], config.Policy.obligations.apply_secure_filter.shortName, tableUniqueName)
                            policyHelper.addParams([
                                applyUserFilterObParamField,
                                applyUserFilterObParamOperator,
                                applyUserFilterObParamValue,
                            ], config.Policy.obligations.apply_user_filter.shortName, tableUniqueName)
                            // policyHelper.addParams([
                            //     maskFieldObParamField
                            // ], config.Policy.obligations.mask_field.shortName, tableUniqueName)                              
                        }               

                        // const alertMsgObParam = PolicyHelper.createObligationParam('Alert Message', 'alert_message', {
                        //     type: OBLIGATION_VALUE_TYPE.MULTI_LINE_TEXT,
                        //     editable: true,
                        // })
                        // const alertMsgObPolicyNameParam = PolicyHelper.createObligationParam(config.Policy.obligations.policy_name.name, config.Policy.obligations.policy_name.shortName, {
                        //     type: OBLIGATION_VALUE_TYPE.MULTI_LINE_TEXT,
                        //     editable: true,
                        //     mandatory: true,                            
                        // })                      

                        //policyHelper.addParams([alertMsgObPolicyNameParam, alertMsgObParam], config.Policy.obligations.alert_message.shortName, tableUniqueName)
                        policyHelper.addAttributes(enforcedAttrs, tableUniqueName).injectSQLAttributes(tableUniqueName)
                    })

                    HttpUtil.download(`em_sql_policymodel_${Date.now()}.bin`, policyHelper.toJSON())
                    dispatch(setSESaveLoading(false))
                })
        })
        .catch(error => {
            dispatch(setSESaveLoading(false))
            dispatch(exportTablesError(error.message))
        })
}

export {
    saveEnforcedEntities,
    exportEnforcedEntities,
}