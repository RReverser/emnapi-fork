function _napi_create_async_work (env: napi_env, resource: napi_value, resource_name: napi_value, execute: number, complete: number, data: number, result: number): napi_status {
  $CHECK_ENV!(env)
  const envObject = emnapiCtx.envStore.get(env)!
  $CHECK_ARG!(envObject, execute)
  $CHECK_ARG!(envObject, result)

  let resourceObject: any
  if (resource) {
    resourceObject = Object(emnapiCtx.handleStore.get(resource)!.value)
  } else {
    resourceObject = {}
  }

  $CHECK_ARG!(envObject, resource_name)

  const resourceName = String(emnapiCtx.handleStore.get(resource_name)!.value)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const id = emnapiAWST.create(env, resourceObject, resourceName, execute, complete, data)
  $makeSetValue('result', 0, 'id', '*')
  return envObject.clearLastError()
}

function _napi_delete_async_work (env: napi_env, work: number): napi_status {
  $CHECK_ENV!(env)
  const envObject = emnapiCtx.envStore.get(env)!
  $CHECK_ARG!(envObject, work)

  emnapiAWST.remove(work)
  return envObject.clearLastError()
}

function _napi_queue_async_work (env: napi_env, work: number): napi_status {
  $CHECK_ENV!(env)
  const envObject = emnapiCtx.envStore.get(env)!
  $CHECK_ARG!(envObject, work)

  emnapiAWST.queue(work)
  return envObject.clearLastError()
}

function _napi_cancel_async_work (env: napi_env, work: number): napi_status {
  $CHECK_ENV!(env)
  const envObject = emnapiCtx.envStore.get(env)!
  $CHECK_ARG!(envObject, work)

  const status = emnapiAWST.cancel(work)
  if (status === napi_status.napi_ok) return envObject.clearLastError()
  return envObject.setLastError(status)
}

emnapiImplement('napi_create_async_work', 'ippppppp', _napi_create_async_work, ['$emnapiAWST'])
emnapiImplement('napi_delete_async_work', 'ipp', _napi_delete_async_work, ['$emnapiAWST'])
emnapiImplement('napi_queue_async_work', 'ipp', _napi_queue_async_work, ['$emnapiAWST'])
emnapiImplement('napi_cancel_async_work', 'ipp', _napi_cancel_async_work, ['$emnapiAWST'])
