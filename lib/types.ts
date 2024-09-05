export type Service = "japan" | "nurburgring" | "rally" | "germany";

export type Server = {
  name: string;
  serviceRef: Service;
  link: string;
  port: number;
  status: string;
  logs: boolean;
};
