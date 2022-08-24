import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { userActions } from '../_actions';
import { history } from '../_helpers';
class HomePage extends React.Component {

    constructor(props) {
        super(props);
        history.listen((location, action) => {
            // clear alert on location change
            this.props.clearAlerts();
        });
    }

    componentDidMount() {
        this.props.getUsers();
    }

    logoutUserClick(id) {
        console.log(id)
        this.props.logoutUser(id)
    }

    render() {
        const { user, users } = this.props;
        return (<div>       
                
            <div className='col-md-6'>
                <Link to="/" className="btn btn-primary">Home</Link>
                {user && user.role.toLowerCase() === "auditor" &&
                 <Link to="/audit" className="btn ">Audit Page</Link>}
            </div>
            
            <div className="col-md-6 col-md-offset-3">
                <h1>Hi {user.firstName}!</h1>
                <p>You're logged in with React!!</p>
                <h3>All registered users:</h3>
                {users.loading && <em>Loading users...</em>}
                
                <Link to="/login" ><p onClick={()=>this.logoutUserClick(user._id)}>Logout</p></Link>
            </div>
        </div>
        );
    }
}

function mapState(state) {
    const { users, authentication } = state;
    const { user } = authentication;
    return { user, users };
}

const actionCreators = {
    getUsers: userActions.getAll,
    deleteUser: userActions.delete,
    logoutUser: userActions.logout
}

const connectedHomePage = connect(mapState, actionCreators)(HomePage);
export { connectedHomePage as HomePage };