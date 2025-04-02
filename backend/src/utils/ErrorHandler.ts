class ErrorHandler extends Error {
  constructor(
    public message: string, 
    public statusCode: number,
    public details?: any
  ) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    
    // Ensure proper prototype chain
    Object.setPrototypeOf(this, ErrorHandler.prototype);
  }

  toJSON() {
    return {
      success: false,
      message: this.message,
      statusCode: this.statusCode,
      details: this.details
    };
  }
}

export default ErrorHandler;