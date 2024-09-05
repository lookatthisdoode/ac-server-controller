import Logs from "@/components/logs";
import ServerControls from "@/components/serverControls";
import Stats from "@/components/stats";

export default function Home() {
  const servers = [
    {
      name: "Germany",
      serviceRef: "germany",
      link: "https://acstuff.ru/s/q:race/online/join?ip=86.49.234.241&httpPort=8084",
      port: 8084,
      status: "",
      logs: false,
    },
    {
      name: "Rally",
      serviceRef: "rally",
      link: "https://acstuff.ru/s/q:race/online/join?ip=86.49.234.241&httpPort=8083",
      port: 8083,
      status: "",
      logs: false,
    },
    {
      name: "Nurburgring",
      serviceRef: "nurburgring",
      link: "https://acstuff.ru/s/q:race/online/join?ip=86.49.234.241&httpPort=8082",
      port: 8082,
      status: "",
      logs: false,
    },
    {
      name: "Japan",
      serviceRef: "japan",
      link: "https://acstuff.ru/s/q:race/online/join?ip=86.49.234.241&httpPort=8081",
      port: 8081,
      status: "",
      logs: false,
    },
  ];

  return (
    <div className="flex gap-5 h-[80dvh] flex-col md:flex-row">
      <div className="flex flex-col gap-5 md:w-2/5 h-full">
        <div className="w-full rounded-lg bg-gray-800 p-5">
          {servers.map((server, index) => (
            <ServerControls key={index} server={server} />
          ))}
        </div>

        <div className="bg-gray-800 rounded-lg p-5 flex-1 overflow-y-auto ">
          <Stats />
        </div>
      </div>

      <div className="md:w-3/5">
        <Logs />
      </div>
    </div>
  );
}
