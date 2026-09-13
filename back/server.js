const express = require("express");
const config = require("./config");
const cors = require("cors");
const helmet = require("helmet");
const app = express();
const extrasRouter = require("./routes/extrasRoute");
const statsRouter = require("./routes/statsRoute");
const authRouter = require("./routes/authRoute");
const articleRouter = require("./routes/articleRoute");
const aboutRouter = require("./routes/aboutRoute");
const contactRouter = require("./routes/contactRoute");
const themeRouter = require("./routes/themeRoute");
const heroSlidesRouter = require("./routes/heroSlidesRoute");
const aboutLmcRouter = require("./routes/lmc/aboutLmcRoute");
const contactLmcRouter = require("./routes/lmc/contactLmcRoute");
const formationRouter = require("./routes/lmc/formationRoute");
const siteLmcRouter = require("./routes/lmc/siteRoute");
const heroSlidesLmcRouter = require("./routes/lmc/heroSlidesRoute");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "data:"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      fontSrc: ["'self'"],
    },
  })
);
app.use("/uploads", express.static("uploads"));

app.use("/", extrasRouter);
app.use("/", statsRouter);
app.use("/", authRouter);
app.use("/", articleRouter);
app.use("/", aboutRouter);
app.use("/", contactRouter);
app.use("/", themeRouter);
app.use("/", heroSlidesRouter);

app.use("/lmc", siteLmcRouter);
app.use("/lmc", heroSlidesLmcRouter);
app.use("/lmc", aboutLmcRouter);
app.use("/lmc", contactLmcRouter);
app.use("/lmc", formationRouter);

app.listen(config.port, () => {
  console.log(`serveur en cours d execution sur le port ${config.port}`);
});
