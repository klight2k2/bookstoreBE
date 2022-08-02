const sql = require('mssql');

class AdminController {
	async getUsers(req,res){
            // if(req?.user?.role_id!=2) return res.status(500).json({message:"You are not allowed to access this page"});
			const pool=req.app.locals.db;
			try{
				// const user_id=req.user.id;
				const users=await pool.query(`SELECT * FROM [User]`)
				return res.status(200).json(users.recordset)
					
	
			}catch(err){
				console.log(err);
				return res.status(500).json({message:"SERVER ERROR"})
			}
	}


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

	async getPurchase(req,res){
        const pool=req.app.locals.db;
        try{
			const user_id=req.user.id;
			console.log(user_id);
            const ordersDetail=await pool.query(`select * from [Order_Book_User] where user_id=${user_id} order by order_date desc`);
            let ordersInfo=await pool.query(`select * from [Orders_status] where user_id=${user_id} order by order_date desc`);
			ordersInfo=ordersInfo.recordset.map(orderInfo=>({...orderInfo,ordersDetail:[]}));

			ordersDetail.recordset.map(
				(orderDetail)=>{
					ordersInfo.map((orderInfo,index)=>{
						
						if(orderInfo.order_id== orderDetail.order_id) {
							const reduceOrderDetail={book_id:orderDetail.book_id,price:orderDetail.price,title:orderDetail.title,image:orderDetail.image,author:orderDetail.author,num:orderDetail.num};
							orderInfo.ordersDetail.push(reduceOrderDetail);
						}
					})
				}
			)
				return res.status(200).json(ordersInfo);

        }catch(err){
            console.log(err);
            return res.status(500).json({message:"SERVER ERROR"})
        }
    }
	async cancelOrder(req,res){
        const pool=req.app.locals.db;
        try{
			const user_id=parseInt(req.user.id);
			const order_id=parseInt(req.body.order_id);
			console.log(order_id);

            const order=await pool.query(`select * from [Orders] where id=${order_id} and user_id=${user_id}`);
			console.log(order);
			if(order.recordset.length<=0 || order.recordset[0].status_id==4){
				return res.status(500).json({message:"Đơn hàng đã bị hủy"});
			}
            await pool.query(`update [Orders] set status_id=4 where id=${order_id}`);
			let ordersDetail= await pool.query(`select * from [Orders_Detail] where order_id=${order_id}`);
			ordersDetail=ordersDetail.recordset;
			for (let i=0 ;i<ordersDetail.length ;i++) {
				const orderDetail=ordersDetail[i]
				await pool.query(`update [Book] set quantity=quantity+${orderDetail.num} where id=${orderDetail.book_id}`)

			}
		
				return res.status(200).json({code:200,message:"Hủy đơn hàng thành công"});

        }catch(err){
            console.log(err);
            return res.status(500).json({message:"SERVER ERROR"})
        }
    }


}

module.exports = new AdminController();
