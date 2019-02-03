const NewsAPI = require('newsapi');
const newsapi = new NewsAPI('851c5fb9fbab4a04ab9daed72a9311f9');

module.exports = async (req, qry) => {
    let country='NG';
    if("FromCountry" in req) {
        country=req.FromCountry;
    }
    let query = qry.join(' ');
    if(query=="") {
        query="agriculture";
    }
    newsapi.v2.topHeadlines({
        q: query,
        country: cntry
    }).then(response => {
        let result = "Top " + cntry + " headlines about " + query + ".\n  Powered by newsapi.org.\n";
        for(let i=0;i<response.articles.length && i<3; i++) {
            let article = response.articles[i];
            result+=(i+1)+". "+title+" - "+article.source.name+"\n";
            result+="   "+article.description+" By: "+article.author+"\n";
        }
        return result;
    })
}