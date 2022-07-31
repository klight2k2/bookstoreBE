const sql = require('mssql');
class BookController{
    async getTrendingBook(req,res){
        const pool=req.app.locals.db;
        try{
            pool.query(`SELECT Book.id,Book.title,Book.description,Book.image,Book.price,Author.[name] as author,Publisher.[name] as publisher FROM Book,Author,Publisher 
                            where Book.id in (select book_id from (SELECT TOP 5  book_id,SUM(num) AS SUM_NUM FROM Orders_Detail 
                            GROUP BY book_id ORDER BY SUM_NUM DESC ) as trending) 
                            AND Book.author_id=Author.id
                            AND Publisher.id=Book.publisher_id `,(err,recordset)=>{
                res.status(200).send(recordset?.recordset)
            })


        }catch(err){
            console.log(err);
            return res.status(500).json({message:"SERVER ERROR"})
        }
    }
    async getCategories(req,res){
        const pool=req.app.locals.db;
        try{
            pool.query('SELECT * FROM Category',(err,recordset)=>{
                if(err){
                    res.status(500).json({message:"SERVER ERROR"});
                }
                res.status(200).send(recordset.recordset);

            })

    }catch(err){
        return null;
    }}
    async getPublishers(req,res){
        const pool=req.app.locals.db;
        try{
            pool.query('SELECT * FROM Publisher',(err,recordset)=>{
                if(err){
                    res.status(500).json({message:"SERVER ERROR"});
                }
                res.status(200).send(recordset.recordset);

            })

    }catch(err){
        return null;
    }}
    async getAll(req,res){
        const pool=req.app.locals.db;
        try{
            const getAll=`SELECT Book.id,Book.title,Book.description,Book.image,Book.price,Author.[name] as author,Publisher.[name] as publisher FROM Book,Author,Publisher 
            where Book.author_id=Author.id
            AND Publisher.id=Book.publisher_id`
            pool.query(getAll,(err,recordset)=>{
                if(err){
                    res.status(500).json({message:"SERVER ERROR"});
                }
                res.status(200).send(recordset.recordset);

            })

    }catch(err){
        return null;
    }}
    async searchByTitle(req,res){
        const pool=req.app.locals.db;
        try{
            const searchByTitle=`SELECT *,Author.[name] as author,Publisher.[name] as publisher FROM Book,Author,Publisher 
            where Book.title like N'%${req.body.bookTitle}%'
            AND Book.author_id=Author.id
            AND Publisher.id=Book.publisher_id`
            pool.query(searchByTitle,(err,recordset)=>{
                if(err){
                    res.status(500).json({message:"SERVER ERROR"});
                }
                res.status(200).send(recordset.recordset);

            })

    }catch(err){
        return null;
    }}
    async searchBookAdvance(req,res){
        const pool=req.app.locals.db;
        let {bookName,authorName,maxPrice,minPrice,selectedCategoriesId,selectedPublisherId}={...req.body};
        console.log(bookName,authorName,maxPrice,minPrice,selectedCategoriesId,selectedPublisherId)
        selectedCategoriesId=selectedCategoriesId.join(",");
        try{
                const searchBook=`SELECT *,Author.[name] as author FROM Book
                JOIN AuthorBook ON Book.id = AuthorBook.book_id
                JOIN BookCategory ON Book.id = BookCategory.book_id
                JOIN Author ON Author.id = AuthorBook.author_id
                 WHERE (Author.name LIKE N'%${authorName}%')
                 AND (category_id in (${selectedCategoriesId}))
                AND (publisher_id = ${selectedPublisherId})
                AND (title LIKE N'%${bookName}%')
                AND (price > ${minPrice} AND price <= ${maxPrice})`
                console.log(searchBook);
                pool.query(searchBook,(err,recordset)=>{
                                    if(err){
                                        
                                        res.status(500).json({message:"SERVER ERROR"});
                                    }
                                    console.log(recordset);
                                    res.status(200).send(recordset?.recordset);

                                })

    }catch(err){
        console.log(err);
        return null;
    }}
}

module.exports=new BookController();