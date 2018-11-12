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

      if (bodyParsed.email === "testlogin@nonadmin.com") {
        return response.end(
          JSON.stringify({
            isadmin: false,
            userid: "0",
            email: bodyParsed.email,
            publickey:
              "ec88b934fd9f334a9ed6d2e719da2bdb2061de5370ff20a38b0e1e3c9538199a"
          })
        );
      }

      return response.end(
        JSON.stringify({
          isadmin: true,
          userid: "0",
          email: bodyParsed.email,
          publickey:
            "ec88b934fd9f334a9ed6d2e719da2bdb2061de5370ff20a38b0e1e3c9538199a"
        })
      );
    });
};
