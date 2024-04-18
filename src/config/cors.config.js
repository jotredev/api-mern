export const corsConfig = {
  origin: function (origin, callback) {
    const whiteList = [process.env.CLIENT_URL];

    if (process.argv[2] === "--api") {
      whiteList.push(undefined);
    }

    if (whiteList.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Error de cors"));
    }
  },
};
