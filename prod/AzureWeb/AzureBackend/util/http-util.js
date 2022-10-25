const statusCode = {
    continue: 100,
    ok: 200,
    created: 201,
    no_content: 204,
    partial_content: 206,
    moved_permanently: 301,
    found: 302,
    see_other: 303,
    not_modified: 304,
    redirect_temporary: 307,
    redirect_permanetly: 308,
    bad_request: 400,
    unauthorized: 401,
    forbidden: 403,
    not_found: 404,
    method_not_allowed: 405,
    teapot: 418,
    server_error: 500,
    bad_gateway: 502,
    service_unavailable: 503,
}

module.exports = {
    statusCode
}