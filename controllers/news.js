const NewsAPI = require('newsapi');
const newsapi = new NewsAPI('851c5fb9fbab4a04ab9daed72a9311f9');
const Console = require('console');

module.exports = async (req, qry) => {
    return new Promise((resolve, reject) => {
        let cntry='NG';
        if("FromCountry" in req) {
            cntry=req.FromCountry;
        }
        let query = qry.join(' ');
        if(query=="") {
            query="business";
        }
        newsapi.v2.topHeadlines({
            q: query,
            country: cntry,
            language: 'en',
        }).then((response) => {
            let result = "Top " + cntry + " headlines about " + query + ".\n  Powered by newsapi.org.\n";
            for(let i=0;i<response.articles.length && i<3; i++) {
                let article = response.articles[i];
                result+=(i+1)+". "+article.title+" - "+article.source.name+"\n";
                result+="   "+article.description+" By: "+article.author+"\n";
            }
            Console.log(result);
            resolve(result);
        })
    });
        
}