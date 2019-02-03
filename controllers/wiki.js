const ReadWikiHelper = require("wikipedia-js");


module.exports = async (req, args) => {
  return new Promise((resolve, rejct) =>{

    const query = args[0];
    const options = {query: query, format: "json", summaryOnly: true};
    wikipedia.searchArticle(options, function(err, wikiText){
      if (err){
        resolve("Could not find information");
      }
      else{
        const result = [wikiText];
        console.log(wikiText);
        resolve(result);
      }
    }
  }}
