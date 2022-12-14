
VERSION_PRODUCT		= $(VERSION_PRODUCT_EDP)
VERSION_MAJOR		= $(VERSION_MAJOR_EDP)
VERSION_MINOR		= $(VERSION_MINOR_EDP)
VERSION_MAINTENANCE = $(VERSION_MAINTENANCE_EDP)
VERSION_PATCH		= $(VERSION_PATCH_EDP)

COMPILER=VS2015
PLATFORMSDK=8.1

SUBDIRS   = 
SUBTARGET = celog

OFFICIALCERT=0
DYNAMICCRT=yes

SRC =   src/celog.cpp

RCSRC =	src/

INCPATH += ./include



LIBPATH += 

ifeq ($(BUILDTYPE), release)
LIBPATH += 
else
LIBPATH += 
endif


LIBS +=

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
