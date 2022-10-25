
VERSION_PRODUCT		= $(VERSION_PRODUCT_EDP)
VERSION_MAJOR		= $(VERSION_MAJOR_EDP)
VERSION_MINOR		= $(VERSION_MINOR_EDP)
VERSION_MAINTENANCE = $(VERSION_MAINTENANCE_EDP)
VERSION_PATCH		= $(VERSION_PATCH_EDP)

COMPILER=VS2015
PLATFORMSDK=8.1

SUBDIRS   = 
SUBTARGET = QueryCloudAZSDKcpp

OFFICIALCERT=0
DYNAMICCRT=yes

SRC =   src/Attributes.cpp \
        src/CommonFun.cpp \
        src/Connection.cpp \
        src/ConnectionPool.cpp \
        src/NXLHttpClient.cpp \
        src/Obligation.cpp \
        src/PolicyResult.cpp \
        src/PolicyRequest.cpp \
        src/QueryCloudAZExport.cpp \
        src/QueryCloudAZManager

RCSRC =	src/

INCPATH += ./include \
          $(NLEXTERNALDIR2)/boost/boost_1_67_0 \
          $(NLBUILDROOT)/thirdpart/include



LIBPATH += $(BUILDOUTPUTDIR)/$(LIBDIR) \
           $(NLEXTERNALDIR2)/boost/boost_1_67_0/lib64-msvc-14.0 \

ifeq ($(BUILDTYPE), release)
LIBPATH += $(NLBUILDROOT)/thirdpart/x64-windows/release/lib
else
LIBPATH += $(NLBUILDROOT)/thirdpart/x64-windows/debug/lib
endif

ifeq ($(BUILDTYPE), release)
LIBPATH += 
else
LIBPATH += 
endif


LIBS +=ssleay32 libeay32

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
