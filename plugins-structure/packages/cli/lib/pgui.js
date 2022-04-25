#!/usr/bin/env node

const program = require("commander");
const pkg = require("../package.json");
const cmdnewplugin = require("./cmdnewplugin");
const cmdnewapp = require("./cmdnewapp");

function execute() {
  program.version(pkg.version);

  program
    .command("newplugin [plugin-name]")
    .option("-p, --port <port>", "port number", 3000)
    .description("Creates a new plugin")
    .action(cmdnewplugin);

  program
    .command("newapp")
    .argument("[app-name]", "The name of your new app")
    .option(
      "--plugins [plugins]",
      "list of plugins comma separated. Example: ticketvote,comments",
      "ticketvote"
    )
    .option("-p, --port <port>", "port number", 3000)
    .description("Creates a new app-shell")
    .action(cmdnewapp);

  program.parse(process.argv);
}

execute();
