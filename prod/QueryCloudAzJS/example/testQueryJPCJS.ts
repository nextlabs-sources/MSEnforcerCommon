
import { Action, Environment, Host, Resource, Subject, AttributeDataType, NextLabsPEPAgent } from '../src';

// const strJPCHost = "http://cc87-jpc.qapf1.qalab01.nextlabs.com:58080";
// const strOAuthHost = "https://cc87-console.qapf1.qalab01.nextlabs.com";
const strJPCHost = 'https://edrm-jpc.azure.cloudaz.net';
const strOAuthHost = 'https://edrm-cc.azure.cloudaz.net';
const strClientId = "apiclient";
const strClientSecure = "ItisBlue888!";

// //#region User info
// // Set user info, this is mandatory
// const user = new Subject('S-1-5-21-310440588-250036847-580389505-500', 'Test@nextlabs.com');
// user.addAttribute('City', AttributeDataType.String, 'Hangzhou');
// user.addAttribute('emailaddress', AttributeDataType.String, 'george@test.com');
// //#endregion

// //#region Action info
// // Set action info, this is mandatory
// const action = new Action('OPEN11');
// //#endregion

// //#region Source info
// // Set source info, this is mandatory
// // Use "spe" as resoure type (must be same with policy mode name) 
// const resource1 = new Resource('Sharepoint://george-sp16/myTestLib/11.docx', 'spe');
// resource1.addAttribute('resource-dimension', AttributeDataType.AnyURI, 'from');
// resource1.addAttribute('age', AttributeDataType.String, '20');
// resource1.addAttribute('url', AttributeDataType.String, 'Sharepoint://george-sp16/myTestLib/11.docx');

// const resource2 = new Resource('Sharepoint://george-sp16/myTestLib/22.docx', 'spe');
// resource2.addAttribute('resource-dimension', AttributeDataType.AnyURI, 'from');
// resource2.addAttribute('age', AttributeDataType.String, '20');
// resource2.addAttribute('url', AttributeDataType.String, 'Sharepoint://george-sp16/myTestLib/22.docx');

// const resource3 = new Resource('Sharepoint://george-sp16/myTestLib/33.docx', 'spe');
// resource2.addAttribute('resource-dimension', AttributeDataType.AnyURI, 'from');
// resource2.addAttribute('age', AttributeDataType.String, '20');
// resource2.addAttribute('url', AttributeDataType.String, 'Sharepoint://george-sp16/myTestLib/33.docx');
// //#endregion

// //#region Application info
// // Set application info, this is optional
// const application = new Application('Sharepoint Policy Enforcement');
// //#endregion

//#region Environment info
// Set request environment info, this is optional
const environment = new Environment();
// You must set this if you want get policy result "Dont Care", it means there are no any policy matched.
environment.addAttribute('dont-care-acceptable', AttributeDataType.String, 'yes');
// You must set this if you want ignore the policy mode name.
// environment.addAttribute('e_resource_type_when_evaluating', AttributeDataType.String, 'false');
//#endregion

//#region Host info
// Set host info, this is optional
const host = new Host('HostName', '10.23.60.12');
//#endregion

// //#region Single Request
// const agent = new NextLabsPEPAgent(strJPCHost, strOAuthHost, strClientId, strClientSecure);
// agent
//   .decide(user, action, resource1, resource2, application, environment, host)
//   .then(res => console.log(res))
//   .catch(console.error);
// //#endregion

// //#region Multi Request
// const agent = new NextLabsPEPAgent(strJPCHost, strOAuthHost, strClientId, strClientSecure);
// agent
//   .bulkDecide(user, action, [resource1, resource2, resource3], host, environment, application)
//   .then(res => {
//     console.log(res);
//   })
//   .catch(console.error);
// //#endregion


// const userIT = new Subject('IT', 'IT@nextlabs.com');
// userIT.addAttribute('department', AttributeDataType.String, 'IT');
const userHR = new Subject('HR', 'HR@nextlabs.com');
userHR.addAttribute('department', AttributeDataType.String, 'HR');

const action = new Action('VIEW');

const resource = new Resource('document', 'spoe');
resource.addAttribute('url', AttributeDataType.String, 'sharepoint://sharepoint.domain.com/sites/HR/doucment1.doc');

const agent = new NextLabsPEPAgent(strJPCHost, strOAuthHost, strClientId, strClientSecure);

// agent
//   .decide(user, action, resource1, resource2, environment, host)
//   .then(console.log)
//   .catch(console.error);

agent
  .decide(userHR, action, resource, environment, host)
  .then(console.log)
  .catch(console.log)