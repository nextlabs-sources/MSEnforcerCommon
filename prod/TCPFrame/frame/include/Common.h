#pragma once

#include "TcpSocket.h"

void scanModules(PInitParam param);
bool getPortEvents(short port, EventStruct& events);
bool getModuleEvents(HMODULE module, EventStruct& events);
void GetPorts(std::vector<short>& ports);

