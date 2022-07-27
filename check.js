detail=require( './db.js');
const  fs=require('fs');
count=0
categoryList=[]
authorList=[]

const sql="insert into category ([name]) values" 

detail.map(
    book=>{
        
        if(book.category){
            // if (categoryList.includes(book.category)) return ;
                categoryList.push(book.category)
        }
        
        if(book.author){
            if (!!authorList.includes(book.author)) return ;
            authorList.push(book.author)
        }
    }
)

function randomQuantity(){
    return Math.floor(Math.random()*1000)
}


detail.map(book=>{
    if( book.author){
    count++
    console.log(book.author)

    }
    newbook={
        title:book.title,
        price:book.price,
        image:book.files,
        description:book.description,
        publisher:book.publisher,
        pages:book.page,
        quantity:randomQuantity(),



    }
    // fs.appendFile('book.txt',book.category,err=>console.log(err))

})
result=[]
result=authorList.filter( author=>{
    return result.includes(author)? '':result.push(author);
}
)
authorList=result
result=[]
result=categoryList.filter( category=>{
    return result.includes(category)? '':result.push(category);
}
)
categoryList=result
console.log(sql+categoryList.map(category=>`(N'${category}'),\n`).join(''))
console.log(sql+authorList.map(author=>`(N'${author}'),\n`).join(''))