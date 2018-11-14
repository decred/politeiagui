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

      if (bodyParsed.name === "error") {
        return response.end(JSON.stringify({ errorcode: 5 }));
      }

      return response.end(
        JSON.stringify({
          censorshiprecord: {
            token:
              "6284c5f8fba5665373b8e6651ebc8747b289fed242d2f880f64a284496bb4ca7",
            merkle:
              "0dd10219cd79342198085cbe6f737bd54efe119b24c84cbc053023ed6b7da4c8",
            signature:
              "fcc92e26b8f38b90c2887259d88ce614654f32ecd76ade1438a0def40d360e461d995c796f16a17108fad226793fd4f52ff013428eda3b39cd504ed5f1811d0d"
          }
        })
      );
    });
};
