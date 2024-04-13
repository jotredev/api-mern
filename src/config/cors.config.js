export const corsConfig = {
  origin: function (origin, callback) {
    const whiteList = [process.env.CLIENT_URL];

    if (whiteList.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Error de cors'));
    }
  },
};
