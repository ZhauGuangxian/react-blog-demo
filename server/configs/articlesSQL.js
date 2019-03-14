module.exports = {
    getTopArticlesList: 'SELECT * FROM articles WHERE top_flag BETWEEN 0 AND 4',
    getNormalArticlesList:'SELECT * FROM articles WHERE top_flag = 99 ORDER BY createTime DESC limit ?,10',
    getAllArticlesList:'SELECT * FROM articles',
    getArticlesByPage:'SELECT  COUNT(*) FROM articles;SELECT * FROM articles ORDER BY createTime DESC limit ?,?',
    getArticlesByTitle:'SELECT * FROM articles WHERE title=?',
    deleteArticle:'DELETE FROM articles WHERE id=?',
    addNewArticle:'INSERT INTO articles(title,cover,content,article_desc,top_flag,createTime,updateTime) VALUES(?,?,?,?,?,?,?)',
    updateTopOther:'UPDATE articles SET top_flag=top_flag+1 WHERE top_flag BETWEEN 0 AND 3;UPDATE articles SET top_flag=99 WHERE top_flag=3',
    insertTopOne:'UPDATE articles SET top_flag=0 WHERE id=?',
    articleInfo:'SELECT * FROM articles WHERE id=?'
}
