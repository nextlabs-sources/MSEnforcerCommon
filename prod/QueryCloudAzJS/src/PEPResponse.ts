import Obligation from "./Obligation";

enum Decision {
  PERMIT = "Permit",
	DENY = "Deny",
	INDETERMINATE = "Indeterminate",
	INDETERMINATE_PERMIT = "Indeterminate{P}",
	INDETERMINATE_DENY = "Indeterminate{D}",
	INDETERMINATE_DENYPERMIT ="Indeterminate{DP}",
	NOTAPPLICABLE = "NotApplicable"
}

class PEPResponse {
  private decision: Decision;
  private obligations: Array<Obligation>;

  constructor(decision: Decision, obligations: Array<Obligation>) {
    this.decision = decision;
    this.obligations = obligations;
  }

  getDecision() {
    return this.decision;
  }

  getObligations() {
    return this.obligations;
  }

}

export default PEPResponse;