#ifndef POLICY_RESULT_H
#define POLICY_RESULT_H

#include "IQueryCloudAZ.h"
#include "Obligation.h"
#include <vector>

class PolicyResult : public IPolicyResult
{

public:
	PolicyResult() { SetQueryStatus(QS_E_Failed); }
	virtual ~PolicyResult();

public:
	void SetQueryStatus(QueryStatus qs) { m_queryStatus = qs;  }
	void SetEnforcement(PolicyEnforcement enforcement) { m_Enforcement = enforcement; }
	void ReserveObligation(size_t nOb) { m_vecObligations.reserve(nOb); }
	void AddObligation(Obligation* Ob) { m_vecObligations.push_back(Ob); }


public:
	QueryStatus GetQueryStatus() const { return m_queryStatus; }
	PolicyEnforcement GetEnforcement() const { return m_Enforcement; }
	size_t ObligationCount() const { return m_vecObligations.size(); }
	const IObligation* GetObligationByIndex(size_t nIndex) const;


private:
	QueryStatus m_queryStatus;
	PolicyEnforcement m_Enforcement;
	std::vector<Obligation*> m_vecObligations;


};



#endif

