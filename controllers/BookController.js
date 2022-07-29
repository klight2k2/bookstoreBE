const sql = require('mssql');
class BookController{
    async getTrendingBook(req,res){
        const pool=req.app.locals.db;
        try{
            pool.query('SELECT * FROM Book where id in (select book_id from (SELECT TOP 5  book_id,SUM(num) AS SUM_NUM FROM Orders_Detail GROUP BY book_id ORDER BY SUM_NUM DESC ) as trending)',(err,recordSet)=>{
                res.status(200).send(recordSet)
            })


        }catch(err){
            console.log(err);
            return res.status(500).json({message:"SERVER ERROR"})
        }
    }
}

module.exports=new BookController();