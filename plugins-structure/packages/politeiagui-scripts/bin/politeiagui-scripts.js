#!/usr/bin/env node

const path = require("path");
const spawn = require("cross-spawn");
const glob = require("glob");

const [executor, ignoredBin, script] = process.argv;

if (script && script !== "--help" && script !== "help") {
  runScript();
} else {
  const scriptsPath = path.join(__dirname, "../scripts/");
  const scriptsAvailable = glob.sync(path.join(__dirname, "../scripts", "*"));
  // `glob.sync` returns paths with unix style path separators even on Windows.
  // So we normalize it before attempting to strip out the scripts path.
  const scriptsAvailableMessage = scriptsAvailable
    .map(path.normalize)
    .map((s) =>
      s
        .replace(scriptsPath, "")
        .replace(/__tests__/, "")
        .replace(/\.js$/, "")
    )
    .filter(Boolean)
    .join("\n  ")
    .trim();
  const fullMessage = `
Usage: ${ignoredBin} [script] [--flags]
Available Scripts:
  ${scriptsAvailableMessage}
Options:
  You can assume that the args you pass will be forwarded to the respective tool that's being run under the hood.
  `.trim();
  console.log(`\n${fullMessage}\n`);
}

function getEnv() {
  // this is required to address an issue in cross-spawn
  return Object.keys(process.env)
    .filter((key) => process.env[key] !== undefined)
    .reduce(
      (envCopy, key) => {
        envCopy[key] = process.env[key];
        return envCopy;
      },
      {
        [`SCRIPTS_${script.toUpperCase().replace(/-/g, "_")}`]: true,
      }
    );
}

function runScript() {
  const args = process.argv.slice(2);
  const scriptIndex = args.findIndex((x) =>
    ["build", "prettify", "lint", "start", "test"].includes(x)
  );

  const buildCommand = scriptIndex === -1 ? args[0] : args[scriptIndex];
  const nodeArgs = scriptIndex > 0 ? args.slice(0, scriptIndex) : [];

  if (!buildCommand) {
    throw new Error(`Unknown script "${script}".`);
  }

  const relativeScriptPath = path.join(__dirname, "../scripts", buildCommand);
  const scriptPath = attemptResolve(relativeScriptPath);
  if (!scriptPath) {
    throw new Error(`Unknown script "${script}".`);
  }

  // Attempt to strt the script with the passed node arguments
  const result = spawn.sync(
    executor,
    nodeArgs.concat(scriptPath).concat(args.slice(scriptIndex + 1)),
    {
      stdio: "inherit",
      env: getEnv(),
    }
  );

  if (result.signal) {
    handleSignal(result);
  } else {
    process.exit(result.status);
  }
}

function handleSignal(result) {
  if (result.signal === "SIGKILL" || result.signal === "SIGTERM") {
    console.log(
      `The script "${script}" failed because the process exited too early.`
    );
  }
  process.exit(1);
}

function attemptResolve(...resolveArgs) {
  try {
    return require.resolve(...resolveArgs);
  } catch (error) {
    return null;
  }
}
