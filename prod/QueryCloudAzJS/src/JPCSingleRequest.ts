import Category from "./category/Category";
import Subject from "./category/Subject";
import Action from "./category/Action";
import Resource from "./category/Resource";

export default class JPCSingleRequest {
  private _categorys: Array<Category>;

  constructor(subject: Subject, action: Action, resource: Resource, ...categorys: Array<Category>) {
    this._categorys = new Array<Category>(subject, action, resource);
    this._categorys.push(...categorys);
  }

  public toJSON() {
    return {
      'Request': {
        'ReturnPolicyIdList':'True',
        'Category': this._categorys
      }
    }
  }
}