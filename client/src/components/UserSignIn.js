import React, { Component } from 'react';
// import { browserHistory } from 'react-router'
import { Link } from 'react-router-dom';
import { withRouter } from "react-router-dom";



class UserSignIn extends Component {


  //
  //  static contextTypes = {
  //   router: () => true, // replace with PropTypes.object if you use them
  // }

state = {
   emailAddress:'',
   password:''
}
onChange = event => {
   this.setState({[event.target.name]: event.target.value});
}

onSubmit = event => {
   event.preventDefault();
   this.props.signIn(this.state.emailAddress, this.state.password, this.props.history);

}



   render() {
      return(
         <div className="bounds">
           <div className="grid-33 centered signin">
             <h1>Sign In</h1>
             <div>
               <form onSubmit={this.onSubmit} target="_blank" action="https://google.com">
                 <div>
                  <input id="emailAddress" onChange={this.onChange} name="emailAddress" type="text" className="" placeholder="Email Address" value={this.state.emailAddress}/>
                 </div>
                 <div>
                  <input id="password" onChange={this.onChange} name="password" type="password" className="" placeholder="Password" value={this.state.password}/>
                 </div>
                 <div className="grid-100 pad-bottom">
                    <button className="button" type="submit">Sign In</button>
                    <button onClick={() => this.props.history.push("/")} className="button button-secondary">Cancel</button>
                 </div>
               </form>
             </div>
             <p>&nbsp;</p>
             <p>Don't have a user account? <Link to="/signup">Click here</Link> to sign up!</p>
           </div>
         </div>
      );
   }
}

export default withRouter(UserSignIn);



// static contextTypes = {
//     router: () => true, // replace with PropTypes.object if you use them
//   }
