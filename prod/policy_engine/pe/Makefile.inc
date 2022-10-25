
VERSION_PRODUCT		= $(VERSION_PRODUCT_EDP)
VERSION_MAJOR		= $(VERSION_MAJOR_EDP)
VERSION_MINOR		= $(VERSION_MINOR_EDP)
VERSION_MAINTENANCE = $(VERSION_MAINTENANCE_EDP)
VERSION_PATCH		= $(VERSION_PATCH_EDP)

COMPILER=VS2015
PLATFORMSDK=8.1

SUBDIRS   = 
SUBTARGET = policy_engine

OFFICIALCERT=0
DYNAMICCRT=yes
SUBTARGET_STATIC=yes

SRC =   src/eval_expression.cpp \
		src/Lex.cpp \
		src/parse_expression.cpp \
		src/Policy.cpp				\
		src/policy_engine.cpp	\
		src/policy_expression.cpp \
		src/policy_regex.cpp \
		src/PolicyEngine.cpp \
		src/translate.cpp \
		src/pe_log.cpp

RCSRC =	src/

INCPATH += ./include \
			../tool/include \
			../policymgr/include \
			$(NLEXTERNALDIR2)/boost/boost_1_67_0 \
			$(NLBUILDROOT)/thirdpart/include 
			
			


LIBPATH += $(BUILDOUTPUTDIR)/$(LIBDIR) \
			$(NLEXTERNALDIR2)/boost/boost_1_67_0/lib64-msvc-14.0 
		
		
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


LIBS += tool_static policymgr_static ssleay32 libeay32 jsoncpp boost_date_time-vc140-mt-x64-1_67 libboost_log-vc140-mt-x64-1_67

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
