const myReducertkn = (state, action) => {
    if(!state) {
      return {
    jwt:"",
      id:"" 
      };
    }

    switch(action.type) {
      case "SAVE_TOKEN":
        console.log(action.data);
        return {
          ...state,
          jwt: action.data.token,

          id: action.data.userId
        

        }

     
      default:
        return state;
    }
}

export default myReducertkn;