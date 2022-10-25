#pragma once
#include <string>

class PreLoadDll
{
public:
	PreLoadDll(const wchar_t* dlls[], int nCount);
	~PreLoadDll();

private:
	HINSTANCE hinstDLLs[MAX_PATH];
};

