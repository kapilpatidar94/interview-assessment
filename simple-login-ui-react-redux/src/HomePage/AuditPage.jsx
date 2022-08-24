import React,{useState} from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { userActions } from '../_actions';
import { userService } from '../_services';
import { history } from '../_helpers';

// import {Pagination, PaginationItem, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, FormControl, Select, MenuItem, Button, Box, InputLabel} from "@mui/material";


class AuditPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          tableData: [],
          currentPage: 0,
          size:10
        };
      }
    componentDidMount() {
        this.props.getUsers();
    }
    componentWillMount(){
      userService.getAll().then(data => {
      this.setState({tableData: data.slice(0,10), currentPage: 0})
      })
    }

    handleDeleteUser(id) {
      this.props.deleteUser(id);
      userService.getAll().then(data => {
        this.setState({tableData: data.slice(this.state.currentPage * 10, this.state.currentPage * 10 +10)})
        })

    }

    render() {
        const { user, users } = this.props;

        const setPage = (pageNum) => {
          console.log(pageNum)
          this.setState({currentPage: pageNum,tableData: users.items && users.items.slice(pageNum * 10, pageNum * 10 +10)})
        }

        function formatDate(dt) {
          let date = new Date(dt)
          var hours = date.getHours();
          var minutes = date.getMinutes();
          var ampm = hours >= 12 ? 'PM' : 'AM';
          hours = hours % 12;
          hours = hours ? hours : 12; // the hour '0' should be '12'
          minutes = minutes < 10 ? '0'+minutes : minutes;
          var strTime = hours + ':' + minutes + ' ' + ampm;
          return (date.getMonth()+1) + "/" + date.getDate() + "/" + date.getFullYear() + "  " + strTime;
        }
        return (<div>
              <div className='col-md-6 d-flex justify-content-around'>
                <Link to="/" className="btn ">Home</Link>
                <Link to="/audit" className="btn btn-primary">Auditor</Link>
              </div>
                <div className="col-md-12">
                    <div className="row">
                        <div className="col-md-8"> 
                           <h3>All login audit :</h3>
                        </div>
                            
                            <div className="col-md-4">
                            
                            </div>
                    </div>
                   
                   <br/>
                   <table id="dtBasicExample" className="table table-striped table-bordered table-sm" cellSpacing="0" width="100%">
                    <thead>
                      <tr>
                        <th className="th-sm">S.No.</th>
                        <th className="th-sm">Name</th>
                        <th className="th-sm text-center">Role</th>
                        <th className="th-sm">Login Time</th>
                        <th className="th-sm">Logout Time</th>
                        <th className="th-sm">Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                    {this.state.tableData && this.state.tableData.length> 0 ?
                            this.state.tableData.map((item, index) =>  <tr key={index}>
                              <td>{this.state.currentPage  * this.state.size + index + 1}</td>
                              <td>{item.firstName || '-'}</td>
                              <td className="text-center">{item.role || '-'}</td>
                              <td className="text-center">{item.createdDate ? formatDate(item.createdDate) : '-'}</td>
                              <td className="text-center">{ item.logoutTime ? formatDate(item.logoutTime) : '-'}</td>
                              <td className="text-center"><a onClick={()=>this.handleDeleteUser(item.id)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash3-fill" viewBox="0 0 16 16">
                                  <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z"/>
                                </svg></a>
                              </td>
                            </tr>
                            )
                            : 
                              <tr key={0}><td colSpan={6}><h3 className="text-muted text-center">No Data Found</h3></td></tr>
                          }
                    </tbody>
                  </table>
                  <nav>
                    <ul className="pagination" style={{float:"right"}}>
                      <li className="page-item">
                        <a className="page-link" href="#" aria-label="Previous">
                          <span aria-hidden="true" onClick={() => setPage(this.state.currentPage-1)}>&laquo;</span>
                          <span className="sr-only">Previous</span>
                        </a>
                      </li>
                      { users.items && users.items.length> 0 && users.items.slice(0,Math.ceil(users.items.length/10)).map((item,index)=>
                        <li key={index} onClick={() => {setPage(index)}}><a className="page-link" style={{backgroundColor: index === this.state.currentPage && "#337ab7", color: index === this.state.currentPage && "white"}} href="#"  >{index+1}</a></li>
                      )}
                      <li className="page-item" >
                        <a className="page-link" href="#" aria-label="Next">
                          <span aria-hidden="true" onClick={() => setPage(this.state.currentPage+1)}>&raquo;</span>
                          <span className="sr-only">Next</span>
                        </a>
                      </li>
                    </ul>
                  </nav>                
                </div>
            </div>
        );
    }
}
function mapState(state) {
    const { users, authentication } = state;
    const { user } = authentication;
    if(user.role.toLowerCase() !== "auditor"){
      history.push('/');
    }
    return { user, users }
}

const actionCreators = {
    getUsers: userActions.getAll,
    deleteUser: userActions.delete
}

const connectedAuditPage = connect(mapState, actionCreators)(AuditPage);
export { connectedAuditPage as AuditPage };