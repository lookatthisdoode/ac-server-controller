"use client";
import { controlServer, fetchStatus } from "@/lib/actions";
import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { Server } from "@/app/page";

export default function ServerControls({ server }: { server: Server }) {
  const [status, setStatus] = useState("Status");

  // const fakeDelay = (ms: number) =>
  //   new Promise((resolve) => setTimeout(resolve, ms));

  const updateStatus = async () => {
    const currentStatus = await fetchStatus(server.serviceRef);
    setStatus(currentStatus);
  };

  useEffect(() => {
    updateStatus();
  }, []);

  async function toggleServer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "active") {
      setStatus("working");
      handleServer("stop");
    } else if (status === "inactive") {
      setStatus("working");
      handleServer("start");
    } else if (status === "working") {
      return;
    } else {
      try {
        setStatus("working");
        handleServer("start");
      } catch (error) {
        console.log(error);
      }
    }
  }

  async function handleServer(action: string) {
    try {
      const result = await controlServer(action, server.serviceRef);
      if (result === "success") {
        updateStatus();
      }
    } catch (error) {
      console.error("Error controlling server:", error);
    }
  }

  return (
    <>
      <div className="flex gap-5 text-center border-b border-gray-600 py-4 last-of-type:border-0 justify-between">
        <h1 className="">{server.name}</h1>

        {/* Control Buttons */}
        <div className="flex gap-5 *:text-xs text-xs">
          <form className={""} onSubmit={(e) => toggleServer(e)}>
            <button
              className={`border rounded-md px-2 h-full ${
                status === "active"
                  ? " text-emerald-600 border-emerald-600 animate-round"
                  : status === "working"
                  ? " text-yellow-600 border-yellow-600 shadow-yellow-700 animate-round"
                  : " text-red-600 border-red-600 shadow-red-700 animate-round"
              }`}
              type="submit"
            >
              {/* LOL */}
              {status && `${status[0].toUpperCase()}${status.slice(1)}`}
              {/* <MdPowerSettingsNew size={25} /> */}
            </button>
          </form>
          <button
            className="border border-slate-400 rounded-md px-2"
            onClick={async () => {
              await navigator.clipboard.writeText(server.link);
            }}
          >
            Copy Link
          </button>

          <button className="border border-slate-400 rounded-md px-2">
            <Link href={`/edit-cfg?service=${server.serviceRef}`}>CFG</Link>
          </button>
        </div>
      </div>
    </>
  );
}
