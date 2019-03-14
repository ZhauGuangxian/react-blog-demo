module.exports={
    addComment:'INSERT INTO comments(articleId,touristId,replyTo,content,env,createTime,belong) VALUES(?,?,?,?,?,?,?)',
    addtourist:'INSERT INTO tourist(touristName,touristqq,touristEmail) VALUES(?,?,?)',
    findtourist:'SELECT * FROM tourist WHERE id=?',
    checktourist:'SELECT id FROM tourist WHERE touristName=?',
    getComments:'SELECT t1.*,t2.touristName,t2.touristqq,t2.touristEmail FROM comments t1 LEFT JOIN tourist t2 ON t2.id = t1.touristId WHERE t1.articleId=? AND t1.replyTo=0',
    getChildComments:'SELECT t1.*,t2.touristName,t2.touristqq,t2.touristEmail FROM comments t1 LEFT JOIN tourist t2 ON t2.id = t1.touristId WHERE t1.belong IN (SELECT id FROM comments WHERE articleId=?)'
}