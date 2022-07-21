const path = require("path");
const spawn = require("cross-spawn");
const yargsParser = require("yargs-parser");
const { hasPkgProp, resolveBin, hasFile, fromRoot } = require("../utils");

let args = process.argv.slice(2);
const here = (p) => path.join(__dirname, p);
const hereRelative = (p) => here(p).replace(process.cwd(), ".");
const parsedArgs = yargsParser(args);

const useBuiltinConfig =
  !args.includes("--config") &&
  !hasFile(".eslintrc") &&
  !hasFile(".eslintrc.js") &&
  !hasPkgProp("eslintConfig");

const config = useBuiltinConfig
  ? ["--config", hereRelative("../config/eslint/eslintrc.js")]
  : [];

const defaultExtensions = "js,ts,tsx";
const ext = args.includes("--ext") ? [] : ["--ext", defaultExtensions];
const extensions = (parsedArgs.ext || defaultExtensions).split(",");

const useBuiltinIgnore =
  !args.includes("--ignore-path") &&
  !hasFile(".eslintignore") &&
  !hasPkgProp("eslintIgnore");

const ignore = useBuiltinIgnore
  ? ["--ignore-path", hereRelative("../config/eslint/eslintignore")]
  : [];

const cache = args.includes("--no-cache")
  ? []
  : [
      "--cache",
      "--cache-location",
      fromRoot("node_modules/.cache/.eslintcache"),
    ];

const filesGiven = parsedArgs._.length > 0;

const filesToApply = filesGiven ? [] : ["."];

if (filesGiven) {
  // take all the files that should be linted
  // and filter out the ones that aren't js files.
  args = args.filter(
    (a) => !parsedArgs._.includes(a) || extensions.some((e) => a.endsWith(e))
  );
}
// adding this flag to ignore politeiagui .eslintrc
// TODO: this can be removed once plugins-structure becomes the root
const noEslintRc = "--no-eslintrc";
const result = spawn.sync(
  resolveBin("eslint"),
  [
    ...config,
    ...ext,
    ...ignore,
    ...cache,
    ...args,
    noEslintRc,
    ...filesToApply,
  ],
  { stdio: "inherit" }
);

process.exit(result.status);
