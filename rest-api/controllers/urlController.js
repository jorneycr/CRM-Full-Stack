const validUrl = require("valid-url");
const shortid = require("shortid");

const Url = require("../models/Url");

exports.addUrl = async (req, res) => {
  const baseUrl = "http:localhost:5000";

  const { longUrl } = req.body;
  //check base url
  if (!validUrl.isUri(baseUrl)) return res.status(401).json("Invalid base URL");

  // create url code
  const urlCode = shortid.generate();

  //check long url
  if (validUrl.isUri(longUrl)) {
    try {
      let url = await Url.findOne({ longUrl });
      if (url) {
        res.json(url);
      } else {
        const shortUrl = baseUrl + "/" + urlCode;
        url = new Url({
          longUrl,
          shortUrl,
          urlCode,
          date: new Date(),
        });
        await url.save();
        res.json(url);
      }
    } catch (err) {
      console.log(err);
      res.status(500).json("Server Error");
    }
  } else {
    res.status(401).json("Invalid longUrl");
  }
};

exports.getUrl = async (req, res, next) => {
  try {
    const url = await Url.findOne({ urlCode: req.params.code });
    if (url) {
      return res.redirect(url.longUrl);
    } else {
      return res.status(404).json("No URL Found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json("Server Error");
  }
};
