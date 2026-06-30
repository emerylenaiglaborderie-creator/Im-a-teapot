export interface HttpError {
  code: number
  name: string
  description: string
  fix: string
  origin: string
  category: '1xx' | '2xx' | '3xx' | '4xx' | '5xx'
}

export const httpErrors: HttpError[] = [
  // 1xx Informational
  {
    code: 100, name: 'Continue', category: '1xx',
    description: 'The server has received the request headers and the client should proceed to send the request body.',
    fix: 'No action needed; this is an informational response. Ensure your client handles 1xx responses gracefully and continues sending the request body.',
    origin: 'Defined in RFC 7231 (HTTP/1.1 Semantics) by the IETF, June 2014.',
  },
  {
    code: 101, name: 'Switching Protocols', category: '1xx',
    description: 'The requester has asked the server to switch protocols and the server has agreed to do so.',
    fix: 'Ensure the client sends a valid "Upgrade" header (e.g. to WebSocket). Both client and server must support the target protocol.',
    origin: 'Defined in RFC 7231 by the IETF. WebSocket upgrade use-case standardized in RFC 6455 (2011).',
  },
  {
    code: 102, name: 'Processing', category: '1xx',
    description: 'The server has received and is processing the request, but no response is available yet.',
    fix: 'Increase client timeout settings for long-running requests. This is sent by WebDAV servers; ensure your client supports 1xx interim responses.',
    origin: 'Defined in RFC 2518 (WebDAV) by the IETF, February 1999.',
  },
  {
    code: 103, name: 'Early Hints', category: '1xx',
    description: 'Used to return some response headers before the final HTTP message, allowing the client to preload resources.',
    fix: 'Configure your server to emit Link headers for critical assets early. Ensure your client/CDN supports 103 to benefit from preloading.',
    origin: 'Defined in RFC 8297 by the IETF, December 2017. Championed by Kazuho Oku.',
  },

  // 2xx Success
  {
    code: 200, name: 'OK', category: '2xx',
    description: 'The request has succeeded. The meaning depends on the HTTP method used.',
    fix: 'No fix needed; this is the standard success response.',
    origin: 'Defined in RFC 7231 by the IETF. Present since HTTP/1.0 (RFC 1945, 1996).',
  },
  {
    code: 201, name: 'Created', category: '2xx',
    description: 'The request has been fulfilled, resulting in the creation of a new resource.',
    fix: 'Return a Location header pointing to the newly created resource. Use this in response to POST or PUT requests.',
    origin: 'Defined in RFC 7231 by the IETF. Present since HTTP/1.0.',
  },
  {
    code: 202, name: 'Accepted', category: '2xx',
    description: 'The request has been accepted for processing, but processing has not been completed.',
    fix: 'Provide a way for the client to check the status of the async operation (e.g. a polling endpoint or webhook).',
    origin: 'Defined in RFC 7231 by the IETF.',
  },
  {
    code: 204, name: 'No Content', category: '2xx',
    description: 'The server successfully processed the request and is not returning any content.',
    fix: 'Do not send a body with this response. Commonly used for DELETE or PUT operations where no content needs to be returned.',
    origin: 'Defined in RFC 7231 by the IETF.',
  },
  {
    code: 206, name: 'Partial Content', category: '2xx',
    description: 'The server is delivering only part of the resource due to a range header sent by the client.',
    fix: 'Ensure your server correctly handles Range headers and returns Content-Range in the response. Used for resumable downloads.',
    origin: 'Defined in RFC 7233 (Range Requests) by the IETF, June 2014.',
  },

  // 3xx Redirection
  {
    code: 301, name: 'Moved Permanently', category: '3xx',
    description: 'This and all future requests should be directed to the given URI.',
    fix: 'Update links, bookmarks, and sitemaps to point to the new URL. Add a Location header with the new URI. Browsers cache this permanently.',
    origin: 'Defined in RFC 7231 by the IETF. Present since HTTP/1.0.',
  },
  {
    code: 302, name: 'Found', category: '3xx',
    description: 'The resource was found but resides temporarily under a different URI.',
    fix: 'Include a Location header with the temporary URL. Do not update bookmarks. Prefer 307 if you need to preserve the HTTP method.',
    origin: 'Defined in RFC 7231 by the IETF.',
  },
  {
    code: 304, name: 'Not Modified', category: '3xx',
    description: 'The resource has not been modified since the last request. The client can use the cached version.',
    fix: 'Ensure your server correctly handles If-Modified-Since and If-None-Match headers. No body should be returned with this status.',
    origin: 'Defined in RFC 7232 (Conditional Requests) by the IETF, June 2014.',
  },
  {
    code: 307, name: 'Temporary Redirect', category: '3xx',
    description: 'The request should be repeated with another URI but future requests should still use the original URI.',
    fix: 'Add a Location header. Unlike 302, the client must not change the HTTP method. Use for temporary redirects that must preserve the method.',
    origin: 'Defined in RFC 7231 by the IETF. Introduced in HTTP/1.1 to clarify 302 behavior.',
  },
  {
    code: 308, name: 'Permanent Redirect', category: '3xx',
    description: 'The request and all future requests should be repeated using another URI, preserving the HTTP method.',
    fix: 'Add a Location header. Use instead of 301 when you need to preserve the HTTP method (e.g. POST must stay POST).',
    origin: 'Defined in RFC 7538 by the IETF, April 2015.',
  },

  // 4xx Client Errors
  {
    code: 400, name: 'Bad Request', category: '4xx',
    description: 'The server cannot or will not process the request due to an apparent client error (malformed syntax, invalid framing, etc.).',
    fix: 'Validate the request format, headers, and body on the client side. Return a descriptive error message in the response body to help debug.',
    origin: 'Defined in RFC 7231 by the IETF.',
  },
  {
    code: 401, name: 'Unauthorized', category: '4xx',
    description: 'Authentication is required and has failed or has not yet been provided.',
    fix: 'Include a WWW-Authenticate header describing the authentication scheme. Ensure the client sends valid credentials (e.g. Bearer token, Basic auth).',
    origin: 'Defined in RFC 7235 (Authentication) by the IETF, June 2014.',
  },
  {
    code: 403, name: 'Forbidden', category: '4xx',
    description: 'The request contained valid data and was understood by the server, but the server is refusing action due to insufficient permissions.',
    fix: 'Check the user\'s role and permissions. If the resource existence should be hidden, consider returning 404 instead to avoid leaking information.',
    origin: 'Defined in RFC 7231 by the IETF.',
  },
  {
    code: 404, name: 'Not Found', category: '4xx',
    description: 'The requested resource could not be found but may be available in the future.',
    fix: 'Verify the URL is correct. Implement custom 404 pages. Use redirects (301/302) for moved resources. Check for trailing slashes and case sensitivity.',
    origin: 'Defined in RFC 7231 by the IETF. Popularized by Tim Berners-Lee\'s early web servers at CERN.',
  },
  {
    code: 405, name: 'Method Not Allowed', category: '4xx',
    description: 'A request method is not supported for the requested resource.',
    fix: 'Return an Allow header listing the supported methods. Check your routing configuration to ensure the correct methods are registered.',
    origin: 'Defined in RFC 7231 by the IETF.',
  },
  {
    code: 408, name: 'Request Timeout', category: '4xx',
    description: 'The server timed out waiting for the request. The client may repeat the request.',
    fix: 'Increase server timeout settings or optimize the client to send requests faster. Implement retry logic with exponential backoff on the client.',
    origin: 'Defined in RFC 7231 by the IETF.',
  },
  {
    code: 409, name: 'Conflict', category: '4xx',
    description: 'The request could not be processed because of conflict in the current state of the resource.',
    fix: 'Return details about the conflict in the response body. Use ETags and conditional requests (If-Match) to handle concurrent updates safely.',
    origin: 'Defined in RFC 7231 by the IETF.',
  },
  {
    code: 410, name: 'Gone', category: '4xx',
    description: 'The resource requested is no longer available and will not be available again.',
    fix: 'Unlike 404, this signals permanent removal. Update links and sitemaps. Search engines will deindex the URL faster than with a 404.',
    origin: 'Defined in RFC 7231 by the IETF.',
  },
  {
    code: 413, name: 'Payload Too Large', category: '4xx',
    description: 'The request is larger than the server is willing or able to process.',
    fix: 'Increase the server\'s max body size limit or implement chunked uploads. Communicate size limits clearly to clients via documentation.',
    origin: 'Defined in RFC 7231 by the IETF.',
  },
  {
    code: 414, name: 'URI Too Long', category: '4xx',
    description: 'The URI provided was too long for the server to process.',
    fix: 'Move query parameters to the request body (POST/PUT). Most servers limit URIs to 8,000 characters; design APIs to avoid overly long URLs.',
    origin: 'Defined in RFC 7231 by the IETF.',
  },
  {
    code: 418, name: "I'm a Teapot", category: '4xx',
    description: 'The server refuses the attempt to brew coffee with a teapot. Any attempt to brew coffee with a teapot should result in this error.',
    fix: 'Use a coffee machine instead. This status is not expected to be implemented by real HTTP servers — it\'s an April Fools\' joke that stuck around.',
    origin: 'Defined in RFC 2324 (HTCPCP) by Larry Masinter at IETF, April 1st 1998. An April Fools\' joke that became an official status code.',
  },
  {
    code: 422, name: 'Unprocessable Entity', category: '4xx',
    description: 'The request was well-formed but was unable to be followed due to semantic errors.',
    fix: 'Return detailed validation errors in the response body. Commonly used with REST APIs when input validation fails (e.g. missing required fields).',
    origin: 'Defined in RFC 4918 (WebDAV) by the IETF, June 2007.',
  },
  {
    code: 425, name: 'Too Early', category: '4xx',
    description: 'The server is unwilling to risk processing a request that might be replayed (TLS early data).',
    fix: 'Do not send sensitive or non-idempotent requests in TLS 1.3 early data (0-RTT). Wait for the full TLS handshake to complete.',
    origin: 'Defined in RFC 8470 by the IETF, September 2018.',
  },
  {
    code: 429, name: 'Too Many Requests', category: '4xx',
    description: 'The user has sent too many requests in a given amount of time (rate limiting).',
    fix: 'Implement client-side rate limiting. Respect Retry-After headers. Add exponential backoff with jitter to your retry logic.',
    origin: 'Defined in RFC 6585 by the IETF, April 2012.',
  },
  {
    code: 451, name: 'Unavailable For Legal Reasons', category: '4xx',
    description: 'The user requested a resource that cannot legally be provided, such as a page censored by a government.',
    fix: 'Include a Link header pointing to an explanation of the legal demand. Be as transparent as possible about the nature of the restriction.',
    origin: 'Defined in RFC 7725 by the IETF, February 2016. Proposed by Tim Bray. The code references Ray Bradbury\'s "Fahrenheit 451".',
  },

  // 5xx Server Errors
  {
    code: 500, name: 'Internal Server Error', category: '5xx',
    description: 'An unexpected condition was encountered and no more specific message is suitable.',
    fix: 'Check server logs immediately for stack traces. Implement proper error handling and monitoring. Never expose internal details to the client.',
    origin: 'Defined in RFC 7231 by the IETF. Present since HTTP/1.0.',
  },
  {
    code: 501, name: 'Not Implemented', category: '5xx',
    description: 'The server either does not recognize the request method, or it lacks the ability to fulfill the request.',
    fix: 'Implement the missing functionality or return a clear message indicating it\'s not supported. Include an Allow header if applicable.',
    origin: 'Defined in RFC 7231 by the IETF.',
  },
  {
    code: 502, name: 'Bad Gateway', category: '5xx',
    description: 'The server was acting as a gateway or proxy and received an invalid response from the upstream server.',
    fix: 'Check the health of your upstream services. Review proxy/load balancer configuration. Look for network issues between servers.',
    origin: 'Defined in RFC 7231 by the IETF.',
  },
  {
    code: 503, name: 'Service Unavailable', category: '5xx',
    description: 'The server cannot handle the request because it is overloaded or down for maintenance.',
    fix: 'Return a Retry-After header. Implement health checks, auto-scaling, and circuit breakers. Display a maintenance page during planned downtime.',
    origin: 'Defined in RFC 7231 by the IETF.',
  },
  {
    code: 504, name: 'Gateway Timeout', category: '5xx',
    description: 'The server was acting as a gateway or proxy and did not receive a timely response from the upstream server.',
    fix: 'Increase timeout values in your proxy/load balancer. Optimize slow upstream services. Add caching to reduce upstream load.',
    origin: 'Defined in RFC 7231 by the IETF.',
  },
  {
    code: 505, name: 'HTTP Version Not Supported', category: '5xx',
    description: 'The server does not support the HTTP version used in the request.',
    fix: 'Ensure both client and server agree on a supported HTTP version (1.1, 2, or 3). Update server configuration to support modern HTTP versions.',
    origin: 'Defined in RFC 7231 by the IETF.',
  },
]

export const categoryColors: Record<string, string> = {
  '1xx': '#6B9FD4',
  '2xx': '#6DB87A',
  '3xx': '#E8A85F',
  '4xx': '#E05C60',
  '5xx': '#9B59B6',
}
