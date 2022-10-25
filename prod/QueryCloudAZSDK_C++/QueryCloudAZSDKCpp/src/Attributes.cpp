#include "Attributes.h"

Attributes::~Attributes()
{
    //delete attribute
	for (size_t i=0; i<m_vecAttr.size(); i++)
	{
		delete m_vecAttr[i];
		m_vecAttr[i] = NULL;
	}
}

void Attributes::AddAttribute(const char* szName, const char* szValue, CEAttributeType attrType)
{
	m_vecAttr.push_back( new AttrValue{ szName, szValue, attrType });
}

bool Attributes::GetAttrByIndex(size_t nIndex, const char** ppName, const char** ppValue, CEAttributeType* pAttrType) const
{
	if (nIndex>=m_vecAttr.size())
	{
		return false;
	}

	std::vector<AttrValue*>::const_iterator itAttr = m_vecAttr.begin();
	while (itAttr != m_vecAttr.end())
	{
		if (nIndex==0)
		{
			if (ppName)
			{
				*ppName = (*itAttr)->m_strName.c_str();
			}
			
			if (ppValue)
			{
				*ppValue = (*itAttr)->m_strValue.c_str();
			}
			
			if (pAttrType)
			{
				*pAttrType = (*itAttr)->m_attrType;
			}
			
			break;
		}

		nIndex--;
		itAttr++;
	}
	return true;
}