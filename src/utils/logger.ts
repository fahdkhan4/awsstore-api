import logger from "pino";
import dayjs from "dayjs";

const log = logger({
  target: "pino-pretty",
  options: {
    levelFirst: true,
    translateTime: true,
    colorize: true,
    ignore: "pid,hostname",
    messageFormat(msg: any) {
      return `${msg.level} ${msg.time} ${msg.msg}`;
    },
  },
  timestamp: () => `,"time":"${dayjs().format()}"`,
});

export default log;
