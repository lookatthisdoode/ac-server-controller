"use client";
import { useState, FormEvent, ChangeEvent } from "react";
import { readCFG, updateCFG, resetCFG } from "@/lib/actions";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import dotenv from "dotenv";

export default function EditCfg() {
  dotenv.config();
  const searchParams = useSearchParams();
  const serviceName = searchParams.get("service") || "";

  const [activeConfigFile, setActiveConfigFile] = useState({
    filename: "",
    content: "Config file not chosen",
  });

  const [errMessage, setErrMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();

  async function fetchConfig(e: ChangeEvent<HTMLSelectElement>) {
    const filename = e.target.value;
    const configData = await readCFG(serviceName, filename);
    if (configData.success) {
      const content = configData.content || "";
      setActiveConfigFile({ filename, content });
    } else {
      const errMessage = configData.message || "";
      setErrMessage(errMessage);
    }
  }

  async function handleReset() {
    const result = await resetCFG(serviceName);
    if (result.success) {
      setSuccessMessage("Successfully reset to default!");
      setTimeout(() => setSuccessMessage(null), 1300); // Hide message after 1.3 seconds
    } else {
      setErrMessage("Some error ocurred");
    }
  }

  async function updateFileContent(e: ChangeEvent<HTMLTextAreaElement>) {
    const edited = e.target.value;
    const newConfigFile = { ...activeConfigFile, content: edited };
    setActiveConfigFile(newConfigFile);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); // Prevent default form submission

    const result = await updateCFG(
      activeConfigFile.content,
      serviceName,
      activeConfigFile.filename
    );

    if (result.success) {
      setSuccessMessage("Changes saved successfully!");
      setTimeout(() => setSuccessMessage(null), 1300); // Hide message after 1.3 seconds
      // Optionally refresh or navigate after a delay
      setTimeout(() => router.push(`/edit-cfg?service=${serviceName}`), 1300);
    } else {
      setErrMessage(result.message); // Display error message
    }
  }

  return (
    <div className="bg-gray-800 rounded-lg p-5 h-[80dvh] flex flex-col">
      <select
        name="configselector"
        id="configselector"
        className="p-2 text-black my-5 rounded-lg"
        onChange={(e) => fetchConfig(e)}
        defaultValue=""
      >
        <option disabled value="">
          Choose config file to edit it
        </option>
        <option value="server_cfg.ini">server_cfg.ini</option>
        <option value="entry_list.ini">entry_list.ini</option>
        <option value="extra_cfg.yml">extra_cfg.yml</option>
      </select>

      {errMessage && <p className="text-red-500">{errMessage}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col h-full">
        <textarea
          spellCheck={false}
          className="text-black w-full rounded-lg p-5 flex-1 mb-4"
          name="cfgcontent"
          value={activeConfigFile.content}
          onChange={(e) => updateFileContent(e)}
        />
        <div className="flex justify-between">
          <div className="flex gap-3 items-center">
            <button
              className="p-2 border border-slate-400 rounded-md px-2"
              type="submit"
            >
              Save
            </button>
            <button
              type="button"
              className="p-2 border border-slate-400 rounded-md px-2"
            >
              <Link href={"/"}>Back</Link>
            </button>
            {successMessage && (
              <p className="text-green-500">{successMessage}</p>
            )}
          </div>

          <button
            onClick={handleReset}
            type="button"
            className="p-2 border border-slate-400 rounded-md px-2"
          >
            Reset To Default
          </button>
        </div>
      </form>
    </div>
  );
}
