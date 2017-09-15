import * as methods from "./methods";

const demo = () =>
  console.log("=== GET / ===") || methods
    .apiInfo()
    .then(({ csrfToken, route, version }) => {
      console.log(`Version: ${version}`);
      console.log(`Route  : ${route}`);
      console.log(`CSRF   : ${csrfToken}`);
      console.log("=== POST /api/v1/user/new ===");
      return methods
        .newUser(csrfToken, "somenewuser1@somenewuser.com", "sikrit!")
        .then(({ verificationtoken }) => {
          console.log("=== POST /api/v1/user/verify ===");
          return methods.verifyNewUser(csrfToken, "somenewuser1@somenewuser.com", verificationtoken);
        })
        .then(() => {
          console.log("=== POST /api/v1/login ===");
          return methods.login(csrfToken, "somenewuser1@somenewuser.com", "sikrit!");
        })
        .then(() => {
          console.log("=== POST /api/v1/secret ===");
          return methods.secret(csrfToken);
        })
        .then(() => {
          console.log("=== POST /api/v1/secret ===");
          return methods.secret(csrfToken);
        })
        .then(() => {
          console.log("=== POST /api/v1/logout ===");
          return methods.logout(csrfToken);
        })
        .then(() => {
          console.log("=== get /api/assets ===");
          return methods.assets(csrfToken);
        })
        .then(() => {
          console.log("=== get /api/secret ===");
          return methods.secret(csrfToken)
            .catch(error => console.log("expected error", error));
        });
    })
    .catch(error => console.error("=(", error.stack || error));

demo();
