const ErrorMsg = ({error}) => (error instanceof Error) ? error.message : JSON.stringify(error, null, 2);

export default ErrorMsg;
