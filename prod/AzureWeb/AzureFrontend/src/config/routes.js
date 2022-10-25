export default {
    login: '/:type/login/:uid',
    logout: '/logout',
    dashboard: '/:type/:uid/dashboard',
    tables: '/:type/:uid/dashboard/tables/:id',
    servers: '/:type/:uid/dashboard/servers/:id',
    user_attributes: '/:type/:uid/dashboard/user_attributes',
    general_settings: '/:type/:uid/dashboard/general_settings',
    azure_oauth: '/callback/azure',
    signup: '/signup',
}
