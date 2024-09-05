"use server";
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();
const baseConfigPath = process.env.CONFIG_BASE_PATH || "";

if (!baseConfigPath) {
  throw new Error(
    "CONFIG_BASE_PATH is not defined in the environment variables."
  );
}

export async function resetCFG(service: string) {
  // get path
  try {
    const execPromise = promisify(exec);
    const pathToDefault = path.join(baseConfigPath, service, "cfg_default");
    const pathToCfg = path.join(baseConfigPath, service, "cfg");

    // Remove existing configuration directory
    // await execPromise(`rm -rf ${pathToCfg}`);

    // // Copy default configuration to the target path
    // await execPromise(`cp -r ${pathToDefault}/* ${pathToCfg}`);

    // Return success message
    return { success: true, message: "Configuration reset successfully" };
  } catch (error) {
    // Handle errors and return an error message
    console.error(`Error resetting configuration: ${error.message}`);
    return {
      success: false,
      message: `Error resetting configuration: ${error.message}`,
    };
  }
}

export async function readCFG(serverName: string, filename: string) {
  const configFilePath = path.join(
    baseConfigPath,
    serverName,
    "/cfg/",
    filename
  );

  console.log(configFilePath);

  try {
    const data = fs.readFileSync(configFilePath, "utf8");
    return { success: true, content: data };
  } catch (error) {
    return { success: false, message: "Failed to read the file" };
  }
}

export async function updateCFG(
  content: string,
  serverName: string,
  filename: string
) {
  const configFilePath = path.join(
    baseConfigPath,
    serverName,
    "/cfg/",
    filename
  );
  try {
    fs.writeFileSync(configFilePath, content, "utf8");
    return { success: true, message: "File updated successfully" };
  } catch (error) {
    return { success: false, message: "Failed to write to the file" };
  }
}

export async function fetchStatus(service: string) {
  try {
    const execAsync = promisify(exec);

    const { stdout, stderr } = await execAsync(
      `sudo systemctl is-active ${service}`
    );
    // Trim any extra whitespace
    const status = stdout.trim();

    if (stderr) {
      throw new Error(stderr.trim());
    }
    return status;
  } catch (error: any) {
    // weird bug, this error contains responce which is correct
    if (error.stdout.trim() === "inactive") return "inactive";
    // Return error message if
    return `Error: ${error.message}`;
  }
}

export async function controlServer(action: string, service: string) {
  try {
    const execAsync = promisify(exec);
    const command = `sudo systemctl ${action} ${service}`;

    const { stdout, stderr } = await execAsync(command);
    if (stderr) {
      throw new Error(stderr);
    }
    // if success
    console.log(`${service} ${action}ed`);
    return "success";
  } catch (error: any) {
    return `Error: ${error.message}`;
  }
}
