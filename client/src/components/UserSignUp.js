import React, { Component } from 'react';
import axios from "axios";
import { withRouter } from "react-router-dom";
import { Link } from 'react-router-dom';

class UserSignUp extends Component {

state = {
   firstName: '',
   lastName: '',
   emailAddress: '',
   password: '',
   confirmPassword: '',
   error: '',
   uniqPass:''
}
validAll = () => {
   if (this.state.firstName &&
      this.state.lastName &&
      this.state.emailAddress &&
      this.state.password === this.state.confirmPassword )
   {
      return true
   } else return false
}
onChange = event => {
   this.setState({ [event.target.name]: event.target.value})
}

onSubmit = (el) => {
   const {firstName,
         lastName,
         emailAddress,
         password
      } = this.state;
   const newUser = {
            firstName,
            lastName,
            emailAddress,
            password
         }
   el.preventDefault();
   if(this.validAll()) {
      axios.post("http://localhost:5000/api/users", newUser)
         .then(response => {
            if (response.status === 201) {
               this.props.history.push("/signin");
            }
         })
         .catch(error => {
            if (error) {
               this.setState({
                  uniqPass: true
               });
               console.log("change password")
            }
         });
} else {
   console.log('fill all fields')
}


}

checkValid = val => {
   let chkVal;
   if (val) {
      chkVal='';
   } else {
      chkVal = "Error validation"
   }
   return chkVal;
}
checkValidPass = (pass, confirm) => {
   let chkVal;
   if (pass !== confirm) {
      chkVal = "No match password";
   } else {
      chkVal=""
   }
   return chkVal
}
checkUniqPass = (pass) => {
   if (pass) {
      let error = "There is already an account associated with this email.";
      return error;
   }
}

   render() {

      return(
         <div className="bounds">
           <div className="grid-33 centered signin">
             <h1>Sign Up</h1>
             <div>
               <form onSubmit={this.onSubmit}>
                  <div>
                     <input id="firstName" name="firstName" onChange={this.onChange} type="text" className="" placeholder="First Name" value={this.state.firstName}/>
                     <div className="checkValid">{this.checkValid(this.state.firstName)}</div>
                  </div>
                  <div>
                     <input id="lastName" name="lastName" onChange={this.onChange} type="text" className="" placeholder="Last Name" value={this.state.lastName}/>
                     <div className="checkValid">{this.checkValid(this.state.lastName)}</div>
                  </div>
                  <div>
                     <input id="emailAddress" name="emailAddress" onChange={this.onChange} type="text" className="" placeholder="Email Address" value={this.state.emailAddress}/>
                     <div className="checkValid">{this.checkValid(this.state.emailAddress)}</div>

                  </div>
                  <div>
                     <input id="password" name="password" onChange={this.onChange} type="password" className="" placeholder="Password" value={this.state.password}/>

                     <div className="checkValid">{this.checkUniqPass(this.state.uniqPass)}</div>
                  </div>
                  <div>
                     <input id="confirmPassword" name="confirmPassword" onChange={this.onChange} type="password" className="" placeholder="Confirm Password" value={this.state.confirmPassword}/>
                     <div className="checkValid">{this.checkValid(this.state.password)}</div>
                  </div>
                 <div className="grid-100 pad-bottom">
                    <button className="button" type="submit">Sign Up</button>
                    <button className="button button-secondary" onClick={() => this.props.history.push("/")} >Cancel</button>
                 </div>
               </form>
             </div>
             <p>&nbsp;</p>
             <p>Already have a user account? <Link to="/signin">Click here</Link> to sign in!</p>
           </div>
         </div>
      );
   }
}
export default withRouter (UserSignUp);
