function DayTable(month,year){
    let date=new Date(`${month}-1-${year}`);
    console.log(date)
    let table=[];
    let nextDay;
    let x=1-date.getDay();
    let y=x
    if(date.getDay()===0){
        x=-6;
        y=x+7
    }
    
    for (let i =x;i<35+(y);i++ ){
        
    
       nextDay=date.setHours(i*24);
    
       table[i-x]=new Date(nextDay);
       date.setHours(-i*24);
       
    }
    return table;
}
export default DayTable; 
