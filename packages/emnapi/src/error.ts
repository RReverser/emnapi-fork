function _emnapi_get_last_error_info (env: napi_env, error_code: Pointer<napi_status>, engine_error_code: Pointer<uint32_t>, engine_reserved: void_pp): void {
  $from64('error_code')
  $from64('engine_error_code')
  $from64('engine_reserved')
  const envObject = emnapiCtx.envStore.get(env)!

  const lastError = envObject.lastError
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const errorCode = lastError.errorCode
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const engineErrorCode = lastError.engineErrorCode >>> 0
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const engineReserved = lastError.engineReserved
  $from64('engineReserved')

  $makeSetValue('error_code', 0, 'errorCode', 'i32')
  $makeSetValue('engine_error_code', 0, 'engineErrorCode', 'u32')
  $makeSetValue('engine_reserved', 0, 'engineReserved', '*')
}

// @ts-expect-error
function napi_throw (env: napi_env, error: napi_value): napi_status {
  $PREAMBLE!(env, (envObject) => {
    $CHECK_ARG!(envObject, error)
    envObject.tryCatch.setError(emnapiCtx.handleStore.get(error)!.value)
    return envObject.clearLastError()
  })
}

// @ts-expect-error
function napi_throw_error (env: napi_env, code: const_char_p, msg: const_char_p): napi_status {
  $PREAMBLE!(env, (envObject) => {
    $CHECK_ARG!(envObject, msg)
    $from64('code')
    $from64('msg')

    const error: Error & { code?: string } = new Error(UTF8ToString(msg))
    $INLINE_SET_ERROR_CODE!(envObject, error, 0, code)

    envObject.tryCatch.setError(error)
    return envObject.clearLastError()
  })
}

// @ts-expect-error
function napi_throw_type_error (env: napi_env, code: const_char_p, msg: const_char_p): napi_status {
  $PREAMBLE!(env, (envObject) => {
    $CHECK_ARG!(envObject, msg)
    $from64('code')
    $from64('msg')

    const error: TypeError & { code?: string } = new TypeError(UTF8ToString(msg))
    $INLINE_SET_ERROR_CODE!(envObject, error, 0, code)

    envObject.tryCatch.setError(error)
    return envObject.clearLastError()
  })
}

// @ts-expect-error
function napi_throw_range_error (env: napi_env, code: const_char_p, msg: const_char_p): napi_status {
  $PREAMBLE!(env, (envObject) => {
    $CHECK_ARG!(envObject, msg)
    $from64('code')
    $from64('msg')

    const error: RangeError & { code?: string } = new RangeError(UTF8ToString(msg))
    $INLINE_SET_ERROR_CODE!(envObject, error, 0, code)

    envObject.tryCatch.setError(error)
    return envObject.clearLastError()
  })
}

// @ts-expect-error
function node_api_throw_syntax_error (env: napi_env, code: const_char_p, msg: const_char_p): napi_status {
  $PREAMBLE!(env, (envObject) => {
    $CHECK_ARG!(envObject, msg)
    $from64('code')
    $from64('msg')

    const error: SyntaxError & { code?: string } = new SyntaxError(UTF8ToString(msg))
    $INLINE_SET_ERROR_CODE!(envObject, error, 0, code)

    envObject.tryCatch.setError(error)
    return envObject.clearLastError()
  })
}

function napi_is_exception_pending (env: napi_env, result: Pointer<bool>): napi_status {
  $CHECK_ENV!(env)
  const envObject = emnapiCtx.envStore.get(env)!
  $CHECK_ARG!(envObject, result)
  const r = envObject.tryCatch.hasCaught()
  $from64('result')
  HEAPU8[result] = r ? 1 : 0
  return envObject.clearLastError()
}

function napi_create_error (env: napi_env, code: napi_value, msg: napi_value, result: Pointer<napi_value>): napi_status {
  $CHECK_ENV!(env)
  const envObject = emnapiCtx.envStore.get(env)!
  $CHECK_ARG!(envObject, msg)
  $CHECK_ARG!(envObject, result)
  const msgValue = emnapiCtx.handleStore.get(msg)!.value
  if (typeof msgValue !== 'string') {
    return envObject.setLastError(napi_status.napi_string_expected)
  }

  const error = new Error(msgValue)
  $INLINE_SET_ERROR_CODE!(envObject, error, code, 0)

  $from64('result')

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const value = emnapiCtx.addToCurrentScope(error).id
  $makeSetValue('result', 0, 'value', '*')
  return envObject.clearLastError()
}

function napi_create_type_error (env: napi_env, code: napi_value, msg: napi_value, result: Pointer<napi_value>): napi_status {
  $CHECK_ENV!(env)
  const envObject = emnapiCtx.envStore.get(env)!
  $CHECK_ARG!(envObject, msg)
  $CHECK_ARG!(envObject, result)
  const msgValue = emnapiCtx.handleStore.get(msg)!.value
  if (typeof msgValue !== 'string') {
    return envObject.setLastError(napi_status.napi_string_expected)
  }
  const error = new TypeError(msgValue)
  $INLINE_SET_ERROR_CODE!(envObject, error, code, 0)

  $from64('result')

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const value = emnapiCtx.addToCurrentScope(error).id
  $makeSetValue('result', 0, 'value', '*')
  return envObject.clearLastError()
}

function napi_create_range_error (env: napi_env, code: napi_value, msg: napi_value, result: Pointer<napi_value>): napi_status {
  $CHECK_ENV!(env)
  const envObject = emnapiCtx.envStore.get(env)!
  $CHECK_ARG!(envObject, msg)
  $CHECK_ARG!(envObject, result)
  const msgValue = emnapiCtx.handleStore.get(msg)!.value
  if (typeof msgValue !== 'string') {
    return envObject.setLastError(napi_status.napi_string_expected)
  }
  const error = new RangeError(msgValue)
  $INLINE_SET_ERROR_CODE!(envObject, error, code, 0)
  $from64('result')

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const value = emnapiCtx.addToCurrentScope(error).id
  $makeSetValue('result', 0, 'value', '*')
  return envObject.clearLastError()
}

function node_api_create_syntax_error (env: napi_env, code: napi_value, msg: napi_value, result: Pointer<napi_value>): napi_status {
  $CHECK_ENV!(env)
  const envObject = emnapiCtx.envStore.get(env)!
  $CHECK_ARG!(envObject, msg)
  $CHECK_ARG!(envObject, result)
  const msgValue = emnapiCtx.handleStore.get(msg)!.value
  if (typeof msgValue !== 'string') {
    return envObject.setLastError(napi_status.napi_string_expected)
  }
  const error = new SyntaxError(msgValue)
  $INLINE_SET_ERROR_CODE!(envObject, error, code, 0)
  $from64('result')

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const value = emnapiCtx.addToCurrentScope(error).id
  $makeSetValue('result', 0, 'value', '*')
  return envObject.clearLastError()
}

function napi_get_and_clear_last_exception (env: napi_env, result: Pointer<napi_value>): napi_status {
  $CHECK_ENV!(env)
  const envObject = emnapiCtx.envStore.get(env)!
  $CHECK_ARG!(envObject, result)
  $from64('result')

  if (!envObject.tryCatch.hasCaught()) {
    $makeSetValue('result', 0, '1', '*') // ID_UNDEFINED
    return envObject.clearLastError()
  } else {
    const err = envObject.tryCatch.exception()!
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const value = envObject.ensureHandleId(err)
    $makeSetValue('result', 0, 'value', '*')
    envObject.tryCatch.reset()
  }
  return envObject.clearLastError()
}

function napi_fatal_error (location: const_char_p, location_len: size_t, message: const_char_p, message_len: size_t): void {
  $from64('location')
  $from64('location_len')
  $from64('message')
  $from64('message_len')

  abort('FATAL ERROR: ' +
    emnapiUtf8ToString(location, location_len) +
    ' ' +
    emnapiUtf8ToString(message, message_len)
  )
}

// @ts-expect-error
function napi_fatal_exception (env: napi_env, err: napi_value): napi_status {
  $PREAMBLE!(env, (envObject) => {
    $CHECK_ARG!(envObject, err)
    if (typeof process === 'object' && process !== null && typeof process._fatalException === 'function') {
      const error = envObject.ctx.handleStore.get(err)!
      process._fatalException(error.value)
      return envObject.clearLastError()
    }
    return envObject.setLastError(napi_status.napi_generic_failure)
  })
}

emnapiImplement('_emnapi_get_last_error_info', 'vpppp', _emnapi_get_last_error_info)
emnapiImplement('napi_get_and_clear_last_exception', 'ipp', napi_get_and_clear_last_exception)
emnapiImplement('napi_throw', 'ipp', napi_throw)
emnapiImplement('napi_throw_error', 'ippp', napi_throw_error)
emnapiImplement('napi_throw_type_error', 'ippp', napi_throw_type_error)
emnapiImplement('napi_throw_range_error', 'ippp', napi_throw_range_error)
emnapiImplement('node_api_throw_syntax_error', 'ippp', node_api_throw_syntax_error)
emnapiImplement('napi_create_error', 'ipppp', napi_create_error)
emnapiImplement('napi_create_type_error', 'ipppp', napi_create_type_error)
emnapiImplement('napi_create_range_error', 'ipppp', napi_create_range_error)
emnapiImplement('node_api_create_syntax_error', 'ipppp', node_api_create_syntax_error)
emnapiImplement('napi_is_exception_pending', 'ipp', napi_is_exception_pending)
emnapiImplement('napi_fatal_error', 'vpppp', napi_fatal_error, ['$emnapiUtf8ToString'])
emnapiImplement('napi_fatal_exception', 'ipp', napi_fatal_exception)
