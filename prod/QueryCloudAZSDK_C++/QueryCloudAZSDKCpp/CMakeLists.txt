cmake_minimum_required(VERSION 2.8)
set(CMAKE_CXX_STANDARD 14)
SET( CMAKE_VERBOSE_MAKEFILE on )
# We cannot tolerate most warnings.
set(CMAKE_CXX_FLAGS "-fPIC -Wall -pedantic ${CMAKE_CXX_FLAGS}")

set(BOOST_ROOT /usr/local/boost/boost_1_67_0/)
set(BOOST_INCLUDEDIR  ${BOOST_ROOT}/include/)
include_directories( ${BOOST_INCLUDEDIR} )

include_directories(./include)
include_directories(/usr/local/openssl/openssl_1_1_0/include/)
aux_source_directory(./src SRCS)

link_directories(/usr/local/openssl/openssl_1_1_0/lib/)
add_library(QueryCloudAZSDKCpp SHARED ${SRCS})

#static link to libc libc++
set(CMAKE_EXE_LINKER_FLAGS " -static")
target_link_libraries(QueryCloudAZSDKCpp -static-libgcc  -static-libstdc++)

#static link to boost
set(Boost_USE_STATIC_LIBS ON)
find_package(Boost REQUIRED system thread)
target_link_libraries(QueryCloudAZSDKCpp ${Boost_LIBRARIES})


target_link_libraries(QueryCloudAZSDKCpp libssl.a)
target_link_libraries(QueryCloudAZSDKCpp libcrypto.a)
target_link_libraries(QueryCloudAZSDKCpp libpthread.so)
