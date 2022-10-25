
VERSION_PRODUCT		= $(VERSION_PRODUCT_EDP)
VERSION_MAJOR		= $(VERSION_MAJOR_EDP)
VERSION_MINOR		= $(VERSION_MINOR_EDP)
VERSION_MAINTENANCE = $(VERSION_MAINTENANCE_EDP)
VERSION_PATCH		= $(VERSION_PATCH_EDP)

COMPILER=VS2015
PLATFORMSDK=8.1

SUBDIRS   = 
SUBTARGET = policymgr

OFFICIALCERT=0
DYNAMICCRT=yes
SUBTARGET_STATIC=yes

SRC =   src/exceptionhandle.cpp \
		src/log.cpp				\
		src/NXLHttpClient.cpp \
		src/patch.cpp \
		src/PolicyModelList.cpp \
		src/TalkWithCC.cpp \
		src/TalkWithCC_Request.cpp \
		src/TalkWithCC_Search.cpp 

RCSRC =	src/

INCPATH += ./include \
			../tool/include \
			$(NLEXTERNALDIR2)/boost/boost_1_67_0 \
			$(NLBUILDROOT)/thirdpart/include
			
			


LIBPATH += $(BUILDOUTPUTDIR)/$(LIBDIR) \
		$(NLEXTERNALDIR2)/boost/boost_1_67_0/lib64-msvc-14.0 \
		
		
ifeq ($(BUILDTYPE), release)
LIBPATH += $(NLBUILDROOT)/thirdpart/x64-windows/release/lib
else
LIBPATH += $(NLBUILDROOT)/thirdpart/x64-windows/debug/lib
endif


LIBS += tool_static ssleay32 libeay32 boost_date_time-vc140-mt-x64-1_67 jsoncpp

ifeq ($(BUILDTYPE), release)
LIBS +=
else
LIBS +=
endif


ifeq ($(TARGETENVARCH), x64)
	DFLAGS += -D_M_X64 -D_ATL_STATIC_REGISTRY
else
	DFLAGS += -D_M_IX86 -D_ATL_STATIC_REGISTRY
endif
