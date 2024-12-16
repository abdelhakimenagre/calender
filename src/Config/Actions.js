export const addTask = (eventAdd) => {
    return {type:'addTask',payload:eventAdd}
}
export const updateTask = (eventupd) => {
    return {type:'updateTask',payload:eventupd}
}
export const deleteTask = (eventdel) => {
    return {type:'deletTask',payload:eventdel}
}
export const UpdateTasks =(tasks)=>{
    return {type:"UpdateTasks",payload:tasks}
}