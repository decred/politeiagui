module.exports = function (request, response) {
  let body = [];
  request
    .on("data", (chunk) => {
      body.push(chunk);
    })
    .on("end", () => {
      response.writeHead(200);
      const commentid = Math.floor(Math.random()*100000000) + "";
      return response.end(JSON.stringify({ commentid }));
    });
};

