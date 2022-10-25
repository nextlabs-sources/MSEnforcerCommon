#include "PolicyResult.h"


PolicyResult::~PolicyResult()
{
	//free obligation
	for (size_t i=0; i<m_vecObligations.size(); i++)
	{
		delete m_vecObligations[i];
		m_vecObligations[i] = NULL;
	}
}

const IObligation* PolicyResult::GetObligationByIndex(size_t nIndex) const
{
	if (nIndex >= m_vecObligations.size())
	{
		return NULL;
	}
	else
	{
		return  dynamic_cast<IObligation*>(m_vecObligations[nIndex]);
	}
}
