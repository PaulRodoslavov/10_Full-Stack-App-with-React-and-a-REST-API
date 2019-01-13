import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import axios from "axios";
import PropTypes from 'prop-types';

class UpdateCourse extends Component {
   static propTypes = {
      user: PropTypes.object,
      id: PropTypes.string
   };
   //get info about selected course by using GET requiest
   componentWillMount() {
      fetch(`http://localhost:5000/api/courses/${this.props.id}`)
      .then(res => {
         if(res.ok) {
            this.setState({isLoding:false})
            return res.json()
         }  else {
            this.props.history.push('/notfound');
         }
      })
      .then(res => {
         if (res.user._id !== this.props.user.idUserLogin) {
            console.log("WTF UPDATE")
            this.props.history.push('/forbidden');
            return <div>Loading...</div>;
         } else {
            this.setState({
            res:res,
            title: res.title,
            description: res.description,
            estimatedTime: res.estimatedTime,
            materialsNeeded: res.materialsNeeded,
            firstName: res.user.firstName,
            lastName: res.user.lastName,
            });
         }

      })
      .catch(error => {
         console.log('Error fetching and parsing data', error);
      }
   )};
   //update Course by using PUT request
   updateCourse = event => {
      const name = this.props.user.emailAddress;
      const pass = this.props.user.password;
      event.preventDefault();
      const {
        title,
        description,
        estimatedTime,
        materialsNeeded,
        user
      } = this.state;

      const session_url = `http://localhost:5000/api/courses/${this.props.id}`;
      axios.put(session_url, {}, {
         auth: {
            username: name,
            password: pass
         },
         data: {
            title: title,
            description: description,
            estimatedTime: estimatedTime,
            materialsNeeded: materialsNeeded,
            user: user
         }
      }).then( response => {
      if (response.status === 204 ) this.props.history.push(`/courses/${this.props.id}`);
   }).catch(error => {
        console.log(error);
      });
   }

   state = {
      res:'',
      validTitle: 'Please provide a value for "Title" - min 5 characters',
      validDescrip: 'Please provide a value for "Description" - min 5 characters',
      user: this.props.user.idUserLogin,
      title:'',
      description:'',
      estimatedTime:'',
      materialsNeeded:''
   }

onChange = event => {
   this.setState({[event.target.name]: event.target.value});
}
//check validation Title
validTitle = (event) => {
    this.setState({valueTitle: event.target.value});
    console.log(event.target.value)
}
//check validation Description
validDescrip = (event) => {
   this.setState({valueDescrip: event.target.value});
}
// add or remove error messages validation
removeElement () {
   const validWrap = document.querySelector(".validation-wrapper");
   if (validWrap) {
      if(this.state.title.length > 4 && this.state.description.length > 4) {
         validWrap.style.display = "none"
      } else {
         validWrap.style.display = "block"
      }
   }
}


   render() {
      this.removeElement ();

      return(
         <div className="bounds course--detail">
           <h1>Update Course</h1>
           <div>
             <div className = "validation-wrapper">
               <h2 className="validation--errors--label">Validation errors</h2>
               <div className="validation-errors">
                 <ul>
                    <li className="validTitle">{this.state.title.length > 4 ? "" : this.state.validTitle}</li>
                    <li className="validDescrip">{this.state.description.length > 4 ? "" : this.state.validDescrip}</li>
                 </ul>
               </div>
             </div>
           </div>
           <div>
             <form>
               <div className="grid-66">
                 <div className="course--header">
                   <h4 className="course--label">Course</h4>
                   <div><input id="title" name="title" onChange={this.onChange} type="text" className="input-title course--title--input" placeholder="Course title..."
                       value={this.state.title}/></div>
                   <p>{this.state.firstName + " " + this.state.lastName }</p>
                 </div>
                 <div className="course--description">
                   <div>
                      <textarea id="description" name="description" value={this.state.description} onChange={this.onChange} className="" placeholder="Course description...">
                      </textarea>
                   </div>
                 </div>
               </div>
               <div className="grid-25 grid-right">
                 <div className="course--stats">
                   <ul className="course--stats--list">
                     <li className="course--stats--list--item">
                       <h4>Estimated Time</h4>
                       <div><input id="estimatedTime" name="estimatedTime"  value={this.state.estimatedTime} onChange={this.onChange} type="text" className="course--time--input"
                           placeholder="Hours"/></div>
                     </li>
                     <li className="course--stats--list--item">
                       <h4>Materials Needed</h4>
                       <div>
                          <textarea id="materialsNeeded" name="materialsNeeded" value={this.state.materialsNeeded} onChange={this.onChange} className="" placeholder="List materials...">
                          </textarea>
                       </div>
                     </li>
                   </ul>
                 </div>
               </div>
               <div className="grid-100 pad-bottom">
                  <button className="button" onClick={this.updateCourse}type="submit">Update Course</button>
                  <button className="button button-secondary" onClick={() => this.props.history.push(`/courses/${this.props.id}`)}>Cancel</button>
               </div>
             </form>
           </div>
         </div>
      );
   }
}
export default withRouter(UpdateCourse);
