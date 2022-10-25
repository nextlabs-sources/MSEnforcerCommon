import ObligationAttribute from "./ObligationAttribute";

class Obligation {
  private name: string;
  private attributes: Array<ObligationAttribute>;

  constructor(name: string, attributes: Array<ObligationAttribute>) {
    this.name = name;
    this.attributes = attributes;
  }

  getName() {
    return this.name;
  }

  getAttributes() {
    return this.attributes;
  }
}

export default Obligation;