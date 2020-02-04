import React, { Component } from 'react'
import { connect } from 'react-redux';
import { getUsersByID } from './http.service';
export class Homepage extends Component {
    constructor(props) {
        super(props);
        this.state = {  
        //    showtkn:this.props.showtkn
        showtkn: "",
       usrid:""
        };
    }

    handleLogout = () => {
            getUsersByID(this.props.usrid).then( () => {
                console.log("successfully logout");
                localStorage.removeItem("Token");
                this.props.history.push("/login");
            }).catch ( (err) => {
                console.log(err.response.data);
            });
    }



    render() {
        return (
            <div>
                <h1>Welcome</h1>
                <button  onClick= {this.handleLogout} type="button" className="btn btn-warning">Logout</button>
  
            </div>
        )
    }
}


const mapStateToProps = (state) => ({
    data:state,
    showtkn: state.myReducertkn.jwt,
    usrid: state.myReducertkn.id
});

export default connect(mapStateToProps)(Homepage);
