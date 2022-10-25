VERSION_PRODUCT		= $(VERSION_PRODUCT_EDP)
VERSION_MAJOR		= $(VERSION_MAJOR_EDP)
VERSION_MINOR		= $(VERSION_MINOR_EDP)
VERSION_MAINTENANCE = $(VERSION_MAINTENANCE_EDP)
VERSION_PATCH		= $(VERSION_PATCH_EDP)

COMPILER=VS2015
PLATFORMSDK=8.1

TARGET = unittest

DYNAMICCRT=yes

RCSRC =	src/

SRC =   ./src/main.cpp

INCPATH += ./include \
			../tool/include \
			../pe/include \
			$(NLBUILDROOT)/thirdpart/include/microtest 
			
			


LIBPATH += $(BUILDOUTPUTDIR)/$(LIBDIR) 

LIBS += tool_static policy_engine
