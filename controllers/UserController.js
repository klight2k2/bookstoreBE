const sql = require('mssql');

class UserController {
	async orders(req,res){
			const pool=req.app.locals.db;
			try{
				const user_id=req.user.id;
				const {note,address,phone_number}= {...req.body} ;
				let total_money=0;
				const ordersId=req.body.orders.map(order=>order.id).join(",");
				const orders=req.body.orders.sort((a,b)=>a.id-b.id);
				const books=await pool.query(`SELECT * FROM Book WHERE Book.id in (${ordersId})`)
				const check=books.recordset.sort((a,b)=>a.id-b.id).every((book,index)=>{
					total_money+=orders[index].num*book.price;
					return orders[index].num<=book.quantity;
				})
				console.log(check);
				const orderQuery=`DECLARE @ID INT
				INSERT INTO Orders([user_id],[note],[phone_number],[address],[order_date],[status_id],[total_money])
				VALUES (${user_id},N'${note}','${phone_number}',N'${address}',GETDATE(),1,${total_money})
								(SELECT SCOPE_IDENTITY() AS [SCOPE_IDENTITY]);	
								`
								console.log(orderQuery);
								if(check){
					const transaction=new sql.Transaction(pool)
					try{
						
						await transaction.begin()
						const request = new sql.Request(transaction)
						const result= await request.query(orderQuery)
						console.log(result);
						const order_id=result.recordset[0].SCOPE_IDENTITY
						const ordersDetail=orders.map(book=> `(${order_id},${book.id},${book.price},${book.num})`).join("\n,")+';';
						const orderDetailQuery=`INSERT INTO Orders_Detail([order_id],[book_id],[price],[num]) VALUES ${ordersDetail}`
						console.log(orderDetailQuery);
						const result2=await request.query(orderDetailQuery)
						console.log(result2);
						transaction.commit(err => {
							// ... error checks
							
							console.log("Transaction committed.")
						})
						return result.status(200).json({message:"Đặt hàng thành công"});
					}catch(err){
						console.log(err);
						transaction.rollback()
					}
					
				}else{
					return res.status(500).json({message:"Đơn hàng bạn đặt không còn đủ hàng"})
				}
	
	
			}catch(err){
				console.log(err);
				return res.status(500).json({message:"SERVER ERROR"})
			}
	}
}

module.exports = new UserController();
