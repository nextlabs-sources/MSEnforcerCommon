/********************************************************************************************
 *
 * CE SDK Policy Query and Decision Abstraction
 *
 *******************************************************************************************/

#ifndef __CESDK_QUERY_HPP__
#define __CESDK_QUERY_HPP__

#include <cassert>

#include "CEsdk.h"

#include "eframework/timer/timer_high_resolution.hpp"
#include "eframework/platform/cesdk_loader.hpp"
#include "eframework/platform/cesdk_connection.hpp"
#include "eframework/platform/cesdk_obligations.hpp"
#include "eframework/platform/policy_controller.hpp"

namespace nextlabs
{

  /** cesdk_query
   *
   *  \brief Evaluation object for policy query and decision.
   */
  class cesdk_query : boost::noncopyable
  {
    public:

    /** cesdk_query
     *
     *  \brief Constructor for cesdk_query.
     *
     *  \param in_cesdk (in) Reference to a CE SDK instance.
     */
    cesdk_query( const nextlabs::cesdk_loader& in_cesdk ) :
      cesdk(in_cesdk),
      deny(false),
      res_src(NULL),
      res_src_attrs(NULL),
      action(NULL),
      timeout(5000),
      noise_level(CE_NOISE_LEVEL_USER_ACTION),
      perform_obligations(CEFalse),
      last_error(CE_RESULT_SUCCESS),
      cache_hint_ttl(0),
      ip(0)
    {
      /* empty */
    }

    ~cesdk_query(void)
    {
      clear();
    }/* ~cesdk_query */

    /** set_obligations
     *
     *  \brief Determine if obligations should be performed.
     */
    void set_obligations( bool in_perf_obs ) throw()
    {
      if( in_perf_obs == true )
      {
	perform_obligations = CETrue;    /* perform obligations */
      }
      else
      {
	perform_obligations = CEFalse;   /* do not perform (ignore) obligations */
      }
    }/* set_obligations */

    /** set_noise_level
     *
     *  \brief Set the noise level of the evaluation.  The default noise level is
     *         CE_NOISE_LEVEL_USER_ACTION.
     */
    void set_noise_level( CENoiseLevel_t in_noise_level ) throw()
    {
      noise_level = noise_level;
    }/* set_noise_level */

    /** set_source
     *
     *  \brief Set the source resource of the evaluation.  If the resource type is not
     *         specified it will be document (fso) type.
     *
     *  \param in_resource (in)      Resource name.
     *  \param in_resource_type (in) Resource type (i.e. fso).
     *  \param in_attrs (in)         Attributes to use for the source resource.
     *
     *  \return true on success, otherwise false.
     */
    __checkReturn
    bool set_source( __in const wchar_t* in_resource ,
		     __in const wchar_t* in_resource_type ,
		     __in_opt const CEAttributes* in_attrs ) throw()
    {
      assert( in_resource != NULL );
      assert( in_resource_type != NULL );
      res_src = cesdk.fns.CEM_CreateResourceW(in_resource,in_resource_type);
      if( res_src == NULL )
      {
	return false;
      }
      if( in_attrs != NULL )
      {
	res_src_attrs = in_attrs;
      }
      return true;
    }/* set_source */

    /** set_action
     *
     *  \brief Set the action of the evaluation.
     *  \param in_action (in) Action name (i.e. OPEN).
     *  \return true on success, otherwise false.
     *  \sa query
     */
    __checkReturn
    bool set_action( __in const wchar_t* in_action ) throw()
    {
      assert( in_action != NULL );
      action = cesdk.fns.CEM_AllocateString(in_action);
      if( action == NULL )
      {
	return false;
      }
      return true;
    }/* set_action */

    /** get_obligations
     *
     *  \brief Get obligations from query.
     */
    const nextlabs::Obligations& get_obligations(void) const throw()
    {
      return obs;
    }/* get_obligations */

    /** log_obligation
     *
     *  \brief Set obligation log for the evaluation.
     */
    __checkReturn
    virtual bool log_obligation( CEHandle& handle ,
				 __in const wchar_t* in_obligation_name ,
				 __in const CEAttributes* in_attrs )
    {
      return true;
    }/* log_obligation */

    /** is_deny
     *
     *  \brief Did the evaluation result in a deny decision?
     *  \return true if the result of query was a deny, otherwise false.
     *  \sa is_allow
     */
    bool is_deny(void) const throw()
    {
      return deny;
    }/* is_deny */

    /** is_deny
     *
     *  \brief Did the evaluation result in a allow decision?
     *  \sa is_deny
     */
    bool is_allow(void) const throw()
    {
      return !is_deny();
    }/* is_allow */

    /** clear
     *
     *  \brief Clear the state of the query
     */
    bool clear(void) throw()
    {
      if( res_src != NULL )
      {
	cesdk.fns.CEM_FreeResource(res_src);
	res_src = NULL;
      }
      if( action != NULL )
      {
	cesdk.fns.CEM_FreeString(action);
	action = NULL;
      }
      deny = false;
      last_error = CE_RESULT_SUCCESS;
      return true;
    }/* clear */

    /** set_timeout
     *
     *  \brief Set the policy query timeout in milliseconds.  The default timeout
     *         is 5000 milliseconds.
     *  \param in_timeout_ms (in) Timeout in milliseconds.
     *  \sa query
     */
    void set_timeout( size_t in_timeout_ms ) throw()
    {
      timeout = (CEint32)in_timeout_ms;
    }/* set_timeout */

    /** set_ip
     *
     *  \brief Set the IP4 address for policy query.  The IP4 address must be in
     *         host order.
     *  \param in_ip (in) IP address.
     *  \sa query
     */
    void set_ip( unsigned int in_ip ) throw()
    {
      ip = in_ip;
    }/* set_ip */

    /** query
     *
     *  \brief Issue a query for the current event to the CE SDK handle given.
     *         The query is subject to the timeout set by set_timeout.  The
     *         action for the query must be defined before this method can be
     *         called.
     *
     *  \return true of the query was successful, otherwise false.
     *  \sa get_last_error, query_time, set_timeout, set_action
     */
    __checkReturn
    virtual bool query( CEHandle& in_handle ) throw()
    {
      assert( action != NULL );

      /* If Policy Controller is down do not attempt to connect */
      if( nextlabs::policy_controller::is_up() == false )
      {
	last_error = CE_RESULT_CONN_FAILED;
	deny = false;
	return false;
      }

      if( action == NULL )
      {
	last_error = CE_RESULT_INVALID_PARAMS;
	return false;
      }

      memset(&app,0x00,sizeof(app));
      memset(&user,0x00,sizeof(user));
      CEEnforcement_t enforcement;
      memset(&enforcement,0x00,sizeof(enforcement));

      CEUser user;
      memset(&user,0x00,sizeof(user));
      user.userID  = cesdk.fns.CEM_AllocateString(user_id.c_str());

      timer.start();
      last_error = cesdk.fns.CEEVALUATE_CheckResources(in_handle,               /* handle */
						       action,                  /* action */
						       res_src,                 /* source resource */
						       res_src_attrs,           /* source attrs */
						       NULL,NULL,               /* target */
						       &user,NULL,              /* user */
						       &app,NULL,               /* application */
						       NULL,0,                  /* recipients */
						       (CEint32)ip,             /* IP */
						       perform_obligations,     /* perform obligations? */
						       noise_level,
						       &enforcement,
						       timeout);
      timer.stop();
      if( last_error == CE_RESULT_SUCCESS )
      {
	if( enforcement.result == CEDeny )
	{
	  deny = true;
	}
	/* Obligations exist (structure is populated)? */
	bool obs_exist = (enforcement.obligation != NULL && enforcement.obligation->attrs != NULL);
	if( obs_exist == true )
	{
	  /* Place obligations with 'CE_ATTR_OBLIGATION_NAME' into the obs container for the
	   * caller.
	   */
	  obs.Assign(cesdk.fns.CEM_GetString,*enforcement.obligation);

	  /* Search for cache hint obligation */
	  for( int i = 0 ; i < enforcement.obligation->count ; i++ )
	  {
	    const wchar_t* key = cesdk.fns.CEM_GetString(enforcement.obligation->attrs[i].key);
	    if( key == NULL )
	    {
	      continue;
	    }
	    if( _wcsicmp(key,L"CE_CACHE_HINT") == 0 )
	    {
	      const wchar_t* value = cesdk.fns.CEM_GetString(enforcement.obligation->attrs[i].value);
	      if( value != NULL )
	      {
		cache_hint_ttl = _wtoi(value);
	      }
	    }
	  }/* for obs */
	}/* obs != NULL */
      }
      cesdk.fns.CEM_FreeString(user.userID);
      return true;
    }/* query */

    /** get_last_error
     *
     *  \brief Return the last CE SDK error.
     */
    CEResult_t get_last_error(void) const throw()
    {
      return last_error;
    }/* get_last_error */

    /** query_time
     *
     *  \brief Return the duration, in milliseconds, of a call to query.
     *  \sa query
     */
    double query_time(void) const throw()
    {
      return timer.diff();
    }/* timer */

    void set_user_id( const wchar_t* in_user_id )
    {
      assert( in_user_id != NULL );
      user_id.assign(in_user_id);
    }/* set_user_id */

    /** decision_ttl
     *
     *  \breif The decision TTL.
     */
    size_t decision_ttl(void) const
    {
      return cache_hint_ttl;
    }/* cache_hint_ttl */

    protected:

      const nextlabs::cesdk_loader& cesdk;            /* CE SDK pointers */
      nextlabs::Obligations obs;                      /* obligations from evaluation  */

    private:

      mutable nextlabs::high_resolution_timer timer;  /* high res timer */
      CEResource* res_src;                            /* source resource */
      const CEAttributes* res_src_attrs;              /* source resource attributes */
      CEString action;                                /* action */
      std::wstring user_id;
      CEApplication app;                              /* application for evaluation */
      CEUser user;                                    /* user for evaluation */
      bool deny;                                      /* evaluation result deny? */
      CEint32 timeout;                                /* timeout (ms) */
      CENoiseLevel_t noise_level;                     /* noise level for query */
      CEBoolean perform_obligations;                  /* perform obligations? */
      CEResult_t last_error;                          /* CE SDK last error */
      size_t cache_hint_ttl;                          /* CE_CACHE_HINT TTL */
      unsigned int ip;                                /* IP4 address for query */

  };/* cesdk_query */

}/* namespace nextlabs */

#endif /* __CESDK_QUERY_HPP__ */
