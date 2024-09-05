"use server";
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { Service } from "@/lib/types";
dotenv.config();
const baseConfigPath = process.env.CONFIG_BASE_PATH || "";

if (!baseConfigPath) {
  throw new Error(
    "CONFIG_BASE_PATH is not defined in the environment variables."
  );
}

export async function resetCFG(service: Service) {
  const pathToDefault = path.join(baseConfigPath, service, "cfg_backup");
  const pathToCfg = path.join(baseConfigPath, service, "cfg");

  const execAsync = promisify(exec);

  try {
    // Check if pathToDefault exists
    if (!fs.existsSync(pathToDefault)) {
      throw new Error(`Backup directory ${pathToDefault} does not exist`);
    }

    // Remove existing configuration directory
    await execAsync(`rm -rf ${pathToCfg}`);

    // Create a new configuration directory
    await execAsync(`mkdir -p ${pathToCfg}`);

    // Copy default configuration to the target path
    await execAsync(`cp -r ${pathToDefault}/* ${pathToCfg}`);

    // Return success message
    return { success: true, message: "Configuration reset successfully" };
  } catch (error) {
    // Handle errors and return an error message
    console.error(`Error resetting configuration`);
    return {
      success: false,
      message: `Error resetting configuration`,
    };
  }
}

export async function readCFG(serverName: Service, filename: string) {
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

export async function fetchStatus(service: Service) {
  try {
    const execAsync = promisify(exec);

    const { stdout } = await execAsync(`systemctl is-active ${service}`);
    // Trim any extra whitespace
    const status = stdout.trim();
    return status;
  } catch (error) {
    // console.log(error);
    if (error.stdout.trim() === "inactive") return "inactive";
  }
}

export async function controlServer(action: string, service: Service) {
  try {
    const execAsync = promisify(exec);
    const command = `sudo systemctl ${action} ${service}`;

    const { stderr } = await execAsync(command);
    if (stderr) {
      throw new Error(stderr);
    }
    // if success
    console.log(`${service} ${action}ed`);
    return "success";
  } catch (error) {
    console.log(error);
    return `Error: cant execure ${action} command`;
  }
}
