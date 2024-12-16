

 
  
const initialState={
    tasks:[]
};



const reducer=(state=initialState,action)=>{
switch(action.type) {
case "UpdateTasks":
    return {...state,tasks:[...action.payload]}
case "addTask":
    return {...state,tasks:[...state.tasks,action.payload]}
case "updateTask":
    const task=state.tasks.find(
        (e)=> e.id===parseInt(action.payload.id)
    );
    if(task){
        task.completeState=action.payload.completeState;
        

    }
    return state;
case "deletTask":
    return {
        ...state,tasks:[...state.tasks.filter(e=>e.id!==parseInt(action.payload.id))]}
    default:
        return state;
}
}
export default reducer;