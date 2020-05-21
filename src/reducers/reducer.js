const myReducertkn = (state, action) => {
    if(!state) {
      return {
      jwt:"",         //intiial values 
      id:"" ,
      username:""
      };
    }

    switch(action.type) {
      case "SAVE_TOKEN":
        console.log(action.data);
        return {
          ...state,    //copy previous data
          jwt: action.data.token,

          id: action.data.userId,
          username: action.data.username
        

        }

     
      default:
        return state;
    }
}

export default myReducertkn;