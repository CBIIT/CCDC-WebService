var winston = require("winston");
var config = require("../Config");

const transports = [];

if(config.env !== "dev"){
    transports.push(
        new winston.transports.Console()
    );
}
else{
    transports.push(
        new winston.transports.Console(
            {
                format: winston.format.combine(
                    winston.format.cli(),
                    winston.format.splat(),
                )
            }
        )
    );
}

const LoggerInstance = winston.createLogger({
    level: config.log_level,
    format: winston.format.combine(
      winston.format.timestamp({
        format: "YYYY-MM-DD HH:mm:ss"
      }),
      winston.format.errors({ stack: true }),
      winston.format.splat(),
      winston.format.json()
    ),
    transports
  });
  
module.exports = LoggerInstance;