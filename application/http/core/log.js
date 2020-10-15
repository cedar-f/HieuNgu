function init(path) {
    var winston = require("winston");
    const logger = winston.createLogger({
        level: "debug",
        format: winston.format.json(),
        transports: [
            new winston.transports.File({ filename: path+"error.log", level: "error" }),
            new winston.transports.File({ filename: path+"info.log", level: "info" }),
            new winston.transports.File({ filename: path+"debug.log", level: "debug" }),
            new winston.transports.File({ filename: path+"combined.log" })
        ]
    });

    // chỉ ghi log ra console nếu không phải là môi trường production
    if (process.env.NODE_ENV !== "production") {
        logger.add(new winston.transports.Console({
            format: winston.format.simple()
        }));
    }

    return logger;
}
module.exports = init;
