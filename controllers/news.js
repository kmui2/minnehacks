const NewsAPI = require('newsapi');
const newsapi = new NewsAPI('851c5fb9fbab4a04ab9daed72a9311f9');

module.exports = async (qry, cntry) => {
    if(cntry==undefined || cntry=="") {
        cntry="US";
    }
    let query = "";
    for(term in qry) {
        query += term + " ";
    }
    if(query=="") {
        query="agriculture";
    }
    const response = await newsapi.v2.topHeadlines({
        q: query,
        country: cntry
    });
    
    let result = "Top " + cntry + " headlines about " + query + ".\n  Powered by newsapi.org.\n";
    for(let i=0;i<response.articles.length && i<3; i++) {
        let article = response.articles[i];
        result+=(i+1)+". "+title+" - "+article.source.name+"\n";
        result+="   "+article.description+" By: "+article.author+"\n";
    }
    return result;
}