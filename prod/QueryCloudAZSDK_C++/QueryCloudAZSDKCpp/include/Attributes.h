#ifndef CE_ATTR_H
#define CE_ATTR_H
#include "IQueryCloudAZ.h"
#include <vector>
#include <iostream>


struct AttrValue
{
	std::string m_strName;
	std::string m_strValue;
	CEAttributeType m_attrType;
};

class Attributes : public IAttributes
{
public:
	virtual ~Attributes();

public:
	void ReserveCount(size_t nAttr) { m_vecAttr.reserve(nAttr); }

	void AddAttribute(const char* szName, const char* szValue, CEAttributeType attrType);
	size_t Count() const { return m_vecAttr.size(); }
	bool GetAttrByIndex(size_t nIndex,const char** ppName,const char** ppValue, CEAttributeType* pAttrType) const;




private:
	std::vector<AttrValue*>  m_vecAttr;

};

#endif 
