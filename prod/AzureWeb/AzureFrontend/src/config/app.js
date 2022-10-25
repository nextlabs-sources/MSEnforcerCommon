export default {
    tenant: 'ad2d08bd-a00e-49be-b91a-79f4e00e5738',
    key: '619f3007-ef3b-4871-a144-057c966775b9',
    localStorageKey: 'nextlabs',
    secret: 'E6eFHg0z1czURyFrwM1wn+yNfs7aEvcYsldnY9It36A=',
    callback: process.env.NODE_ENV === 'development' ? 'http://localhost:3000/callback/azure' : 'https://cloudproxy.azurewebsites.net/callback/azure',
}
