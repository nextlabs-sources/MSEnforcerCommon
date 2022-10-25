import AttributeDataType from "./AttributeDataType";

class ObligationAttribute {
  private name: string;
  private value: string;
  private type: AttributeDataType;

  constructor(name: string, value: string, type: AttributeDataType) {
    this.name = name;
    this.value = value;
    this.type = type;
  }

  getName() {
    return this.name;
  }

  getValue() {
    return this.value;
  }

  getType() {
    return this.type;
  }
}

export default ObligationAttribute;