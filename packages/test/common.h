#include <js_native_api.h>

// Empty value so that macros here are able to return NULL or void
#define NAPI_RETVAL_NOTHING  // Intentionally blank #define

#define GET_AND_THROW_LAST_ERROR(env)                                    \
  do {                                                                   \
    const napi_extended_error_info *error_info;                          \
    napi_get_last_error_info((env), &error_info);                        \
    bool is_pending;                                                     \
    const char* err_message = error_info->error_message;                 \
    napi_is_exception_pending((env), &is_pending);                       \
    if (!is_pending) {                                                   \
      const char* error_message = err_message != NULL ?                  \
        err_message :                                                    \
        "empty error message";                                           \
      napi_throw_error((env), NULL, error_message);                      \
    }                                                                    \
  } while (0)

#define NAPI_ASSERT_BASE(env, assertion, message, ret_val)               \
  do {                                                                   \
    if (!(assertion)) {                                                  \
      napi_throw_error(                                                  \
          (env),                                                         \
        NULL,                                                            \
          "assertion (" #assertion ") failed: " message);                \
      return ret_val;                                                    \
    }                                                                    \
  } while (0)

// Returns NULL on failed assertion.
// This is meant to be used inside napi_callback methods.
#define NAPI_ASSERT(env, assertion, message)                             \
  NAPI_ASSERT_BASE(env, assertion, message, NULL)

// Returns empty on failed assertion.
// This is meant to be used inside functions with void return type.
#define NAPI_ASSERT_RETURN_VOID(env, assertion, message)                 \
  NAPI_ASSERT_BASE(env, assertion, message, NAPI_RETVAL_NOTHING)

#define NAPI_CALL_BASE(env, the_call, ret_val)                           \
  do {                                                                   \
    if ((the_call) != napi_ok) {                                         \
      GET_AND_THROW_LAST_ERROR((env));                                   \
      return ret_val;                                                    \
    }                                                                    \
  } while (0)

// Returns NULL if the_call doesn't return napi_ok.
#define NAPI_CALL(env, the_call)                                         \
  NAPI_CALL_BASE(env, the_call, NULL)

// Returns empty if the_call doesn't return napi_ok.
#define NAPI_CALL_RETURN_VOID(env, the_call)                             \
  NAPI_CALL_BASE(env, the_call, NAPI_RETVAL_NOTHING)

#define NAPI_CHECK_STATUS(the_call)                                            \
  do {                                                                         \
    napi_status status = (the_call);                                           \
    if (status != napi_ok) {                                                   \
      return status;                                                           \
    }                                                                          \
  } while (0)

#define NAPI_ASSERT_STATUS(env, assertion, message)                        \
  NAPI_ASSERT_BASE(env, assertion, message, napi_generic_failure)

#define DECLARE_NAPI_PROPERTY(name, func)                                \
  { (name), NULL, (func), NULL, NULL, NULL, napi_default, NULL }

#define DECLARE_NAPI_GETTER(name, func)                                  \
  { (name), NULL, NULL, (func), NULL, NULL, napi_default, NULL }

void add_returned_status(napi_env env,
                         const char* key,
                         napi_value object,
                         char* expected_message,
                         napi_status expected_status,
                         napi_status actual_status);

void add_last_status(napi_env env, const char* key, napi_value return_value);
