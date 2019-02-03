const NewsAPI = require('newsapi');
const config = require('../config/config.json');
const newsapi = new NewsAPI(config.news_key);
const Console = require('console');

module.exports = async (req, qry) => {
    return new Promise((resolve, reject) => {
        let cntry='US';
        /*
        if("FromCountry" in req) {
            cntry=req.FromCountry;
        }
        */
        let query = qry.join(' ');
        let param = {
            country: cntry,
            language: 'en'
        }
        if(query!="") {
            param.p=query;
        }
        newsapi.v2.topHeadlines(param).then((response) => {
            let result = ["Top " + cntry + " headlines about " + query + ".\n  Powered by newsapi.org."];
            for(let i=0;i<response.articles.length && i<3; i++) {
              let news = ""
              let article = response.articles[i];
              news+=(i+1)+". "+article.title+" - "+article.source.name+"\n";
              news+="   "+article.description+((artcle.author)?+" By: "+article.author:"")+"\n";
              result.push(news);
            }
            Console.log(result);
            resolve(result);
        })
    });
}

module.exports({}, []);