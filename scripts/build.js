const { writeFileSync } = require("fs");
const { spawn, execSync } = require("child_process");
const package = require("../package.json");
const {
  name,
  version: oldVersion,
  docker_repository = "registry.dnamicro.com",
} = package;

const { NODE_ENV = "development", PUBLISH } = process.env;

const context = process.cwd();

const template_name = "machine";

if (name === template_name && NODE_ENV !== "development") {
  throw new Error(`Package Name must be updated.`);
}

const [major, minor, patch] = oldVersion.split(".");

const version = [
  parseInt(major) + (NODE_ENV === "production") ? 1 : 0,
  parseInt(minor) + (NODE_ENV === "staging" ? 1 : 0),
  parseInt(patch) +
    (NODE_ENV !== "staging" && NODE_ENV !== "production" ? 1 : 0),
].join(".");

const docker_binary = execSync("which docker");

if (!eval(docker_binary)) {
  throw new Error(`Docker is not installed.`);
}

const docker_image_name = `${docker_repository}/${name}:${NODE_ENV}-${version}`;

const builder = spawn("docker", [
  "build",
  "--build-arg",
  `NODE_ENV=${NODE_ENV}`,
  "-t",
  docker_image_name,
  context,
]);

builder.stdout.on("data", (data) => {
  console.log(data.toString());
});

builder.stderr.on("data", (data) => {
  console.error(data.toString());
});

builder.on("close", (code) => {
  console.log(`Builder Exited with code: ${code}`);

  if (PUBLISH === "yes" && code === 0) {
    console.log(`Publishing ${docker_image_name}`);

    execSync(`docker push ${docker_image_name}`);

    const updated_package = { ...package, version, docker_image_name };

    writeFileSync(
      `${context}/package.json`,
      JSON.stringify(updated_package, null, 2)
    );
  }
});
