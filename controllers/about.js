const config = require('../config/config.json');
const readWikiHelper = require("wikipedia-js");
const htmlToText = require('html-to-text');

const smmry = require('smmry')({SM_API_KEY: config.smmry_apikey});

module.exports = async (req, args) => {
  return new Promise((resolve, reject) => {
    const query = args.join(" ");
    const options = {query: query, format: "html", summaryOnly: true};
    readWikiHelper.searchArticle(options, (err, wikiText) => {
      if (err) {
        resolve("Could not find information");
      }
      else {
        const txt = htmlToText.fromString(wikiText, {
          wordwrap:false,
          noLinkBrackets: true,
          ignoreHref: true,
          singleNewLineParagraphs: true
        });

        smmry.summarizeText(txt)
        .then(data => {
          const result = [data.sm_api_content];
          console.log(data.sm_api_content);
          resolve(result);
        })
        .catch(err => {
          resolve("Could not get information");
        });
      }
    })
  })
}
