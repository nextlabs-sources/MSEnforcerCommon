#ifndef OBLIGATION_H
#define OBLIGATION_H

#include "IQueryCloudAZ.h"
#include "Attributes.h"

class Obligation : public IObligation
{
public:
	Obligation(){}
	virtual ~Obligation();

public:
	void SetName(const char* szName) { m_ObName = szName; }
	Attributes* GetAttributesInternal() { return &m_attributes;  }


protected:
	const char* GetObligationName() const { return m_ObName.c_str(); }
	const IAttributes* GetAttributes() const { return (&m_attributes); }


private:
	std::string m_ObName;
	Attributes m_attributes;


};




#endif 
