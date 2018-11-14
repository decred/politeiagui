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

      if (bodyParsed.email === "test@error.com") {
        return response.end(JSON.stringify({ errorcode: 2 }));
      }

      return response.end(
        JSON.stringify({
          paywalladdress: "TsjVuA79gsSaoG1uVaBfDQF6wo1wwD3AJTH",
          paywallamount: "0.1",
          paywalltxnotbefore: 0,
          verificationtoken:
            "77b9bb7d23272cddc9a8b613c915c95a5dc9a7dbd84be01ea67d73edd4238d89"
        })
      );
    });
};
