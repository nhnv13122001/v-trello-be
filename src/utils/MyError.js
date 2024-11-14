class MyError extends Error {
  constructor(statusCode, message) {
    super(message)
    this.name = 'MyError'
    this.statusCode = statusCode
    Error.captureStackTrace(this, this.constructor)
  }
}

export default MyError
