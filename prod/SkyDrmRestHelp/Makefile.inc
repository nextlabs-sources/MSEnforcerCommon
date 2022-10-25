
VERSION_PRODUCT		= $(VERSION_PRODUCT_EDP)
VERSION_MAJOR		= $(VERSION_MAJOR_EDP)
VERSION_MINOR		= $(VERSION_MINOR_EDP)
VERSION_MAINTENANCE = $(VERSION_MAINTENANCE_EDP)
VERSION_PATCH		= $(VERSION_PATCH_EDP)

COMPILER=VS2015
PLATFORMSDK=8.1

SUBDIRS   = 
CSSUBTARGET = SkyDrmRestHelp

OFFICIALCERT=0
DYNAMICCRT=yes

SRC = ClassificationData.cs \
      ClassificationProfile.cs \
      function.cs \
      LoginData.cs \
      RemoteViewData.cs \
      RemoteViewer.cs \
      RmsLogin.cs \
      SkyDrmRestMgr.cs \
      Properties/AssemblyInfo.cs
      
CSFLAGS += -optimize  /keyfile:SkyDrmRestHelp.snk -d:TRACE

REFERENCE = /r:System.Net.Http.dll /r:System.Runtime.Serialization.dll

