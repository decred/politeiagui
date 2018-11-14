module.exports = function(request, response) {
  let body = [];
  request
    .on("data", chunk => {
      body.push(chunk);
    })
    .on("end", () => {
      body = Buffer.concat(body).toString();
      // At this point, we have the headers, method, url and body, and can now
      // do whatever we need to in order to respond to this request.
      const bodyParsed = JSON.parse(body);
      response.writeHead(200);

      if (
        bodyParsed.email &&
        bodyParsed.verificationtoken &&
        bodyParsed.newpassword
      ) {
        return handlePasswordReset(bodyParsed, response);
      }

      return handleForgottenPassword(bodyParsed, response);
    });
};

function handleForgottenPassword(body, response) {
  if (body.email === "test@error.com") {
    return response.end(JSON.stringify({ errorcode: 2 }));
  }

  return response.end(JSON.stringify({}));
}

function handlePasswordReset(body, response) {
  if (body.email === "test@error.com") {
    return response.end(JSON.stringify({ errorcode: 2 }));
  }
  console.log(body.verificationtoken);
  if (body.verificationtoken === "invalid") {
    return response.end(JSON.stringify({ errorcode: 3 }));
  }
  if (body.verificationtoken === "expired") {
    return response.end(JSON.stringify({ errorcode: 4 }));
  }

  return response.end(JSON.stringify({}));
}
