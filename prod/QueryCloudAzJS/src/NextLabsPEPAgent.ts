import axios, { AxiosResponse } from 'axios';

import { Action, Resource, Subject, Category } from './category';
import Token from "./Token";
import JPCSingleRequest from './JPCSingleRequest';
import JPCMultiRequest from './JPCMultiRequest';
import PEPResponse from './PEPResponse';
import Obligation from './Obligation';
import ObligationAttribute from './ObligationAttribute';

class NextLabsPEPAgent {
  private _JPCHost: string;
  private _OAuthHost: string;
  private _ClientId: string;
  private _ClientSecret: string;
  private token: string

  public constructor(jpcHost: string, oauthHost: string, clientId: string, clientSecret: string) {
    this._JPCHost = jpcHost;
    this._OAuthHost = oauthHost;
    this._ClientId = clientId;
    this._ClientSecret = clientSecret;
  }

  // Single request
  public async decide(subject: Subject, action: Action, resource: Resource, ...categorys: Array<Category>) {
    this.token = await this.getToken();
    const jpcSingleRequest = new JPCSingleRequest(subject, action, resource, ...categorys);
    const jpcResponse = await this.getJPCResponse(jpcSingleRequest);

    return this.translateResponse(jpcResponse);
  }

  // Multi request
  public async bulkDecide(subject: Subject, action: Action, resources: Array<Resource>, ...categorys: Array<Category>) {
    this.token = await this.getToken();
    const jpcMultiRequest = new JPCMultiRequest(subject, action, resources, ...categorys);
    const jpcResponse =  await this.getJPCResponse(jpcMultiRequest);

    return this.translateResponse(jpcResponse);
  }

  private async getToken() {
    const myToken: Token = new Token(this._OAuthHost, this._ClientId, this._ClientSecret);
    return await myToken.get();
  }

  private async getJPCResponse(request: any) {
    return await axios({
      url: this._JPCHost + '/dpc/authorization/pdp',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Service': 'EVAL',
        'Version': '1.0',
        'Authorization': this.token
      },
      data: request
    });
  }

  // Translate AxiosResponse to our PEPResponse
  private translateResponse(response: AxiosResponse): Array<PEPResponse> {
    // The response structure of CC8.5 is different with latter's, so we should judge it
    const policyResult = (response.data.Response instanceof Array) ? response.data.Response : response.data.Response.Result;

    return policyResult.map((res: any) => {
      const decision = res.Decision;
      const obligations: Array<Obligation> = res.Obligations.map((obligaion: any) => {
        const attributes = obligaion.AttributeAssignment.map((attribute: any) => {
          const name = attribute.AttributeId;
          const value = attribute.Value[0];
          const type = attribute.DataType;

          return new ObligationAttribute(name, value, type);
        });
        
        return new Obligation(obligaion.Id, attributes);
      });
      return new PEPResponse(decision, obligations);
    });
  }
}

export default NextLabsPEPAgent;