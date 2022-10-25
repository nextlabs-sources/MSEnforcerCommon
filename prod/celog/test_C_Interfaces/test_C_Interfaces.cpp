// test_C_Interfaces.cpp : Defines the entry point for the console application.
//

/***********************************************************************
 *
 * Compliant Enterprise Logging - Test Application
 *
 **********************************************************************/

#define _WINSOCKAPI_
#include <windows.h>

#include "celog.h"

/* Include policies to test */
#include "celog_policy_file.hpp"
#include "celog_policy_stderr.hpp"
#include "celog_policy_cbuf.hpp"
#include "celog_policy_windbg.hpp"
#include "celog_policy_cstyle.hpp"

int main(void)
{
  celog_Enable();

  /* Default to CELOG_INFO */
  CELogS::Instance()->SetLevel(CELOG_INFO);

  CELogS::Instance()->SetPolicy(new CELogPolicy_Stderr());

  /***********************************************************************************************
   * Basic funcationality test for various interfaces.
   **********************************************************************************************/
  for( int i = 0 ; i < 32 ; i++ )
  {
    fprintf(stdout, "Level %d\n", CELogS::Instance()->Level()); // confirm current level.

    CELogS::Instance()->Log(1,__FILE__,__LINE__," CELogS::Instance()->Log()\n");
  }

  return 0;
}
