
VERSION_PRODUCT		= $(VERSION_PRODUCT_EDP)
VERSION_MAJOR		= $(VERSION_MAJOR_EDP)
VERSION_MINOR		= $(VERSION_MINOR_EDP)
VERSION_MAINTENANCE = $(VERSION_MAINTENANCE_EDP)
VERSION_PATCH		= $(VERSION_PATCH_EDP)

COMPILER=VS2015
PLATFORMSDK=8.1

SUBDIRS   = 
SUBTARGET = SDKWrapper4RMX

OFFICIALCERT=0
DYNAMICCRT=no

SRC =   src/CEAttres.cpp \
        src/common_tools.cpp \
        src/dllmain.cpp \
        src/json_reader.cpp \
        src/json_value.cpp \
        src/json_writer.cpp \
		src/FileTagManager.cpp \
        src/NLCommon.cpp \
        src/NLCppJavaCommon.cpp \
        src/nlofficerep_only_debug.cpp \
        src/NLRightsManager.cpp \
        src/QueryPC.cpp \
        src/SDKWrapper.cpp \
        src/stdafx.cpp \
        src/TranslateJsonHelper.cpp \
        src/SDKWrapper_i.c \
        src/PreLoadDll.cpp \
        src/NLTag.cpp \
        src/NLTagManager.cpp \
        src/GlobalConfig.cpp

RCSRC =	src/SDKWrapper.rc
IDL_SRC = src/SDKWrapper.idl

OTHERSRC_DIR= jsoncpp/src

INCPATH += ./include \
           ./onlyforSFB/ResAttribute/include \
           ./onlyforSFB/ResAttribute/platform \
          $(NLEXTERNALDIR2)/boost/boost_1_67_0 \
          $(JDKDIR)/include \
          $(JDKDIR)/include/win32 \



LIBPATH += $(BUILDOUTPUTDIR)/$(LIBDIR) \
           $(NLEXTERNALDIR2)/boost/boost_1_67_0/lib64-msvc-14.0 \



ifeq ($(BUILDTYPE), release)
LIBPATH += 
else
LIBPATH += 
endif

ifeq ($(BUILDTYPE), release)
LIBS +=
else
LIBS +=
endif


DFLAGS += -D_WINDLL -D_FOR_RMX
ifeq ($(TARGETENVARCH), x64)
	DFLAGS += -D_M_X64 -D_ATL_STATIC_REGISTRY
else
	DFLAGS += -D_M_IX86 -D_ATL_STATIC_REGISTRY
endif
