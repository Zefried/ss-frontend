import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {Link} from 'react-router-dom';
import { customStateMethods } from '../StateMng/Slice/AuthSlice';

export const Home = () => {
    
    const role = customStateMethods.selectStateKey('appState', 'role'); 
    
    const navigate = useNavigate();

    function logOut(){
        customStateMethods.resetState();
        alert('Logout Successfully!'); 
        navigate('/')
    }

    let adminTabs;

    let userTabs;

    let labTabs;


    if (role === 'admin') {

        adminTabs = (
            <>
            <li className="nav-item active">
                <a className="nav-link" href="index.html">
                <i className="fas fa-fw fa-tachometer-alt" />
                <span>Admin Dashboard</span></a>
            </li>

            <li className="nav-item">
                <a className="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapseFour" aria-expanded="true" aria-controls="collapseThree">
                <i className="fas fa-fw fa-cog" />
                <span>Add Masters</span>
                </a>
                <div id="collapseFour" className="collapse" aria-labelledby="headingTwo" data-parent="#accordionSidebar">
                <div className="bg-white py-2 collapse-inner rounded">
                    <h6 className="collapse-header">Employee Masters</h6>
                    <Link className="collapse-item" to='/admin/add-lab-employee' >Add Lab Employee</Link>
                    <Link className="collapse-item" to='/admin/view-lab-employee' >View Lab Employee</Link>

                    <h6 className="collapse-header">Test Category</h6>
                    <Link className="collapse-item" to='/admin/add-lab-test-category' >Add Test Category</Link>
                    <Link className="collapse-item" to='/admin/view-test-category' >View Test Category</Link>
              
                    
                    <h6 className="collapse-header">Test Master</h6>
                    <Link className="collapse-item" to='/admin/add-lab-test' >Add Lab Test</Link>
                    <Link className="collapse-item" to='/admin/view-lab-test' >View Lab Test</Link>
                </div>
                </div>
            </li>

            <li className="nav-item">
                <a className="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapseThree" aria-expanded="true" aria-controls="collapseThree">
                <i className="fas fa-fw fa-cog" />
                <span>User Registration</span>
                </a>
                <div id="collapseThree" className="collapse" aria-labelledby="headingTwo" data-parent="#accordionSidebar">
                <div className="bg-white py-2 collapse-inner rounded">
                    <h6 className="collapse-header">Doctor & Pharma</h6>
                    <Link className="collapse-item" to='/admin/add-doctors' >Add User</Link>
                    <Link className="collapse-item" to='/admin/view-doctors' >View User</Link>
                    <h6 className="collapse-header">Pending User Account</h6>
                    <Link className="collapse-item" to='/admin/pending-accounts' >View Pending Accounts</Link>
                </div>
                </div>
            </li>

            <li className="nav-item">
                <a className="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="true" aria-controls="collapseTwo">
                <i className="fas fa-fw fa-cog" />
                <span>Laboratory</span>
                </a>
                <div id="collapseTwo" className="collapse" aria-labelledby="headingTwo" data-parent="#accordionSidebar">
                <div className="bg-white py-2 collapse-inner rounded">
                    <h6 className="collapse-header">Laboratory:</h6>
                    <Link className="collapse-item" to='/admin/add-lab' >Add Lab</Link>
                    <Link className="collapse-item" to='/admin/view-lab' >View Lab</Link>
                </div>
                </div>
            </li>

            <li className="nav-item">
                <a className="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapseFive" aria-expanded="true" aria-controls="collapseTwo">
                <i className="fas fa-fw fa-cog" />
                <span>Patient Control</span>
                </a>
                <div id="collapseFive" className="collapse" aria-labelledby="headingTwo" data-parent="#accordionSidebar">
                <div className="bg-white py-2 collapse-inner rounded">
                    <h6 className="collapse-header">Patient Master:</h6>
                    <Link className="collapse-item" to='/user/add-patient-location' >Add Patient location</Link>
                    <Link className="collapse-item" to='/user/view-patient-location' >View Location</Link>

                    <h6 className="collapse-header">Patient Data:</h6>
                    <Link className="collapse-item" to='/user/add-patient' >Add Patient</Link>
                    <Link className="collapse-item" to='/user/view-patient' >View All Patient</Link>
                    <Link className="collapse-item" to='/user/view-assigned-patients' >View Assigned Patient</Link>
                    
                </div>
                </div>
            </li>
            </>
        );
    }

    if (role === 'user') {
        
        userTabs = (
            <>
            <li className="nav-item active">
                <a className="nav-link" href="index.html">
                <i className="fas fa-fw fa-tachometer-alt" />
                <span>User Dashboard</span></a>
            </li>

            <li className="nav-item">
                <a className="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapseThree" aria-expanded="true" aria-controls="collapseThree">
                <i className="fas fa-fw fa-cog" />
                <span>Patient Registration</span>
                </a>
                <div id="collapseThree" className="collapse" aria-labelledby="headingTwo" data-parent="#accordionSidebar">
                <div className="bg-white py-2 collapse-inner rounded">
                    <h6 className="collapse-header">Patient Registration </h6>
                    <Link className="collapse-item" to='/user/add-patient' >Add Patient Request</Link>
                    <Link className="collapse-item" to='/user/view-patient' >View All Patient</Link>
                    {/* <Link className="collapse-item" to='/user/view-pending-patient' >View Pending Patient</Link> */}
                </div>
                </div>
            </li>

            <li className="nav-item">
                <a className="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapseFive" aria-expanded="true" aria-controls="collapseTwo">
                <i className="fas fa-fw fa-cog" />
                <span>Patient Control</span>
                </a>
                <div id="collapseFive" className="collapse" aria-labelledby="headingTwo" data-parent="#accordionSidebar">
                <div className="bg-white py-2 collapse-inner rounded">
                    <h6 className="collapse-header">Patient Master:</h6>
                    <Link className="collapse-item" to='/user/add-patient-location' >Add Patient location</Link>
                    <Link className="collapse-item" to='/user/view-patient-location' >View Location</Link>

                    <h6 className="collapse-header">Patient Data:</h6>
                    <Link className="collapse-item" to='/user/add-patient-request' >Add Patient</Link>
                    <Link className="collapse-item" to='/user/view-patient' >View All Patient</Link>
                    <Link className="collapse-item" to='/user/view-assigned-patients' >View Assigned Patient</Link>
                    
                </div>
                </div>
            </li>

            </>
        );

    }

    
    if (role === 'hospital' || role === 'lab') {
        
        labTabs = (
            <>
            <li className="nav-item active">
                <Link to='/lab/view-lab-dashboard' className="nav-link" >
                    <i className="fas fa-fw fa-tachometer-alt" />
                    <span> Dashboard</span>
                </Link>
            </li>

            
            <li className="nav-item">
                <a className="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapseThree" aria-expanded="true" aria-controls="collapseThree">
                <i className="fas fa-fw fa-cog" />
                <span>Patient Control</span>
                </a>
                <div id="collapseThree" className="collapse" aria-labelledby="headingTwo" data-parent="#accordionSidebar">
                <div className="bg-white py-2 collapse-inner rounded">
                    <h6 className="collapse-header">Patient Data</h6>
                    <Link className="collapse-item" to='/lab/view-assigned-patient-lab' >View Assigned Patient</Link>
                    <Link className="collapse-item" to='/lab/view-paid-patient' >View Paid Patient</Link>
                </div>
                </div>
            </li>


            </>
        );
    }


    return (
        <div className='Home'>
            <div id="wrapper">
                {/* Sidebar */}
                <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">

                    {/* Sidebar - Brand */}
                    <a className="sidebar-brand d-flex align-items-center justify-content-center" href="index.html">
                    <div className="sidebar-brand-icon rotate-n-15">
                        <i class="fa-solid fa-cart-shopping"></i>
                    </div>
                    <div className="sidebar-brand-text mx-3">ERP<sup> Nxt Gen</sup></div>
                    </a>
                    {/* Divider */}
                    <hr className="sidebar-divider my-0" />


                    {/* Dashboard ${User Type} starts here */}
                        
                    {/* Dashboard ${User Type} ends here */}


                    {/* Divider */}
                    <hr className="sidebar-divider" />
                    {/* Heading */}
                    <div className="sidebar-heading">
                        Interface
                    </div>

                {/* Role Based Dashboard links space starts from here  */}

                    {/* Admin nav starts here  */}
                        {adminTabs}
                    {/* Admin nav ends here  */}


                    {/* User nav starts here  */}
                        {userTabs}
                    {/* User nav ends here  */}


                    {/* Lab nav starts here  */}
                        {labTabs}
                    {/* Lab nav ends here */}


                {/* Role Based Dashboard links space ends here  */}



                    {/* Divider */}
                    <hr className="sidebar-divider" />
                    {/* Heading */}
                    {/* <div className="sidebar-heading">
                    Addons
                    </div> */}
                    {/* Nav Item - Pages Collapse Menu */}
                    {/* <li className="nav-item">
                    <a className="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapsePages" aria-expanded="true" aria-controls="collapsePages">
                        <i className="fas fa-fw fa-folder" />
                        <span>Pages</span>
                    </a>
                    <div id="collapsePages" className="collapse" aria-labelledby="headingPages" data-parent="#accordionSidebar">
                        <div className="bg-white py-2 collapse-inner rounded">
                        <h6 className="collapse-header">Login Screens:</h6>
                        <a className="collapse-item" href="login.html">Login</a>
                        <a className="collapse-item" href="register.html">Register</a>
                        <a className="collapse-item" href="forgot-password.html">Forgot Password</a>
                        <div className="collapse-divider" />
                        <h6 className="collapse-header">Other Pages:</h6>
                        <a className="collapse-item" href="404.html">404 Page</a>
                        <a className="collapse-item" href="blank.html">Blank Page</a>
                        </div>
                    </div>
                    </li> */}
                    {/* Nav Item - Charts */}
                    {/* <li className="nav-item">
                    <a className="nav-link" href="charts.html">
                        <i className="fas fa-fw fa-chart-area" />
                        <span>Charts</span></a>
                    </li> */}
                    {/* Nav Item - Tables */}
                    {/* <li className="nav-item">
                    <a className="nav-link" href="tables.html">
                        <i className="fas fa-fw fa-table" />
                        <span>Tables</span></a>
                    </li> */}
                    {/* Divider */}
                    <hr className="sidebar-divider d-none d-md-block" />
                    {/* Sidebar Toggler (Sidebar) */}
                    {/* <div className="text-center d-none d-md-inline">
                    <button className="rounded-circle border-0" id="sidebarToggle" />
                    </div> */}
                    {/* Sidebar Message */}
                    {/* <div className="sidebar-card d-none d-lg-flex">
                    <img className="sidebar-card-illustration mb-2" src="img/undraw_rocket.svg" alt="..." />
                    <p className="text-center mb-2"><strong>SB Admin Pro</strong> is packed with premium features, components, and more!</p>
                    <a className="btn btn-success btn-sm" href="https://startbootstrap.com/theme/sb-admin-pro">Upgrade to Pro!</a>
                    </div> */}
                </ul>
                {/* End of Sidebar */}


                
                {/* Content Wrapper */}
                <div id="content-wrapper" className="d-flex flex-column">
                    {/* Main Content */}
                    <div id="content">
                        {/* Topbar */}
                        <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
                            {/* Sidebar Toggle (Topbar) */}
                            <button id="sidebarToggleTop" className="btn btn-link d-md-none rounded-circle mr-3">
                            <i className="fa fa-bars" />
                            </button>
                            {/* Topbar Search */}
                            <form className="d-none d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search">
                            <div className="input-group">
                                <input type="text" className="form-control bg-light border-0 small" placeholder="Search for..." aria-label="Search" aria-describedby="basic-addon2" />
                                <div className="input-group-append">
                                <button className="btn btn-primary" type="button">
                                    <i className="fas fa-search fa-sm" />
                                </button>
                                </div>
                            </div>
                            </form>
                            {/* Topbar Navbar */}
                            <ul className="navbar-nav ml-auto">
                            {/* Nav Item - Search Dropdown (Visible Only XS) */}
                            <li className="nav-item dropdown no-arrow d-sm-none">
                                <a className="nav-link dropdown-toggle" href="#" id="searchDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i className="fas fa-search fa-fw" />
                                </a>
                                {/* Dropdown - Messages */}
                                <div className="dropdown-menu dropdown-menu-right p-3 shadow animated--grow-in" aria-labelledby="searchDropdown">
                                <form className="form-inline mr-auto w-100 navbar-search">
                                    <div className="input-group">
                                    <input type="text" className="form-control bg-light border-0 small" placeholder="Search for..." aria-label="Search" aria-describedby="basic-addon2" />
                                    <div className="input-group-append">
                                        <button className="btn btn-primary" type="button">
                                        <i className="fas fa-search fa-sm" />
                                        </button>
                                    </div>
                                    </div>
                                </form>
                                </div>
                            </li>
                            {/* Nav Item - Alerts */}
                            <li className="nav-item dropdown no-arrow mx-1">
                                <a className="nav-link dropdown-toggle" href="#" id="alertsDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i className="fas fa-bell fa-fw" />
                                {/* Counter - Alerts */}
                                <span className="badge badge-danger badge-counter">3+</span>
                                </a>
                                {/* Dropdown - Alerts */}
                                <div className="dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in" aria-labelledby="alertsDropdown">
                                <h6 className="dropdown-header">
                                    Alerts Center
                                </h6>
                                <a className="dropdown-item d-flex align-items-center" href="#">
                                    <div className="mr-3">
                                    <div className="icon-circle bg-primary">
                                        <i className="fas fa-file-alt text-white" />
                                    </div>
                                    </div>
                                    <div>
                                    <div className="small text-gray-500">December 12, 2019</div>
                                    <span className="font-weight-bold">A new monthly report is ready to download!</span>
                                    </div>
                                </a>
                                <a className="dropdown-item d-flex align-items-center" href="#">
                                    <div className="mr-3">
                                    <div className="icon-circle bg-success">
                                        <i className="fas fa-donate text-white" />
                                    </div>
                                    </div>
                                    <div>
                                    <div className="small text-gray-500">December 7, 2019</div>
                                    $290.29 has been deposited into your account!
                                    </div>
                                </a>
                                <a className="dropdown-item d-flex align-items-center" href="#">
                                    <div className="mr-3">
                                    <div className="icon-circle bg-warning">
                                        <i className="fas fa-exclamation-triangle text-white" />
                                    </div>
                                    </div>
                                    <div>
                                    <div className="small text-gray-500">December 2, 2019</div>
                                    Spending Alert: We've noticed unusually high spending for your account.
                                    </div>
                                </a>
                                <a className="dropdown-item text-center small text-gray-500" href="#">Show All Alerts</a>
                                </div>
                            </li>
                            {/* Nav Item - Messages */}
                            <li className="nav-item dropdown no-arrow mx-1">
                                <a className="nav-link dropdown-toggle" href="#" id="messagesDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i className="fas fa-envelope fa-fw" />
                                {/* Counter - Messages */}
                                <span className="badge badge-danger badge-counter">7</span>
                                </a>
                                {/* Dropdown - Messages */}
                                <div className="dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in" aria-labelledby="messagesDropdown">
                                <h6 className="dropdown-header">
                                    Message Center
                                </h6>
                                <a className="dropdown-item d-flex align-items-center" href="#">
                                    <div className="dropdown-list-image mr-3">
                                    <img className="rounded-circle" src="img/undraw_profile_1.svg" alt="..." />
                                    <div className="status-indicator bg-success" />
                                    </div>
                                    <div className="font-weight-bold">
                                    <div className="text-truncate">Hi there! I am wondering if you can help me with a
                                        problem I've been having.</div>
                                    <div className="small text-gray-500">Emily Fowler · 58m</div>
                                    </div>
                                </a>
                                <a className="dropdown-item d-flex align-items-center" href="#">
                                    <div className="dropdown-list-image mr-3">
                                    <img className="rounded-circle" src="img/undraw_profile_2.svg" alt="..." />
                                    <div className="status-indicator" />
                                    </div>
                                    <div>
                                    <div className="text-truncate">I have the photos that you ordered last month, how
                                        would you like them sent to you?</div>
                                    <div className="small text-gray-500">Jae Chun · 1d</div>
                                    </div>
                                </a>
                                <a className="dropdown-item d-flex align-items-center" href="#">
                                    <div className="dropdown-list-image mr-3">
                                    <img className="rounded-circle" src="img/undraw_profile_3.svg" alt="..." />
                                    <div className="status-indicator bg-warning" />
                                    </div>
                                    <div>
                                    <div className="text-truncate">Last month's report looks great, I am very happy with
                                        the progress so far, keep up the good work!</div>
                                    <div className="small text-gray-500">Morgan Alvarez · 2d</div>
                                    </div>
                                </a>
                                <a className="dropdown-item d-flex align-items-center" href="#">
                                    <div className="dropdown-list-image mr-3">
                                    <img className="rounded-circle" src="https://source.unsplash.com/Mv9hjnEUHR4/60x60" alt="..." />
                                    <div className="status-indicator bg-success" />
                                    </div>
                                    <div>
                                    <div className="text-truncate">Am I a good boy? The reason I ask is because someone
                                        told me that people say this to all dogs, even if they aren't good...</div>
                                    <div className="small text-gray-500">Chicken the Dog · 2w</div>
                                    </div>
                                </a>
                                <a className="dropdown-item text-center small text-gray-500" href="#">Read More Messages</a>
                                </div>
                            </li>
                            <div className="topbar-divider d-none d-sm-block" />
                            {/* Nav Item - User Information */}
                            <li className="nav-item dropdown no-arrow">
                                <a className="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <span className="mr-2 d-none d-lg-inline text-gray-600 small">ABC Company</span>
                                <img className="img-profile rounded-circle" src="https://static.toiimg.com/thumb/msid-102039189,imgsize-36132,width-400,resizemode-4/102039189.jpg" />
                                </a>
                                {/* Dropdown - User Information */}
                                <div className="dropdown-menu dropdown-menu-right shadow animated--grow-in" aria-labelledby="userDropdown">
                                <a className="dropdown-item" href="#">
                                    <i className="fas fa-user fa-sm fa-fw mr-2 text-gray-400" />
                                    Profile
                                </a>
                                <a className="dropdown-item" href="#">
                                    <i className="fas fa-cogs fa-sm fa-fw mr-2 text-gray-400" />
                                    Settings
                                </a>
                                <a className="dropdown-item" href="#">
                                    <i className="fas fa-list fa-sm fa-fw mr-2 text-gray-400" />
                                    Activity Log
                                </a>
                                <div className="dropdown-divider" />
                                <a onClick={logOut} className="dropdown-item" href="#" data-toggle="modal" data-target="#logoutModal">
                                    <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400" />
                                    Logout
                                </a>
                                </div>
                            </li>
                            </ul>
                        </nav>
                        {/* End of Topbar */}

                        {/* Begin Page Content */}
                        <div className="container-fluid">
                            <Outlet/>   
                        </div>
                        {/* /.container-fluid */}

                    </div>
                    {/* End of Main Content */}
                    {/* Footer */}
                    <footer className="sticky-footer bg-white">
                    <div className="container my-auto">
                        <div className="copyright text-center my-auto">
                        <span>Copyright © Swasthya sewak 2025</span>
                        </div>
                    </div>
                    </footer>
                    {/* End of Footer */}
                </div>
                {/* End of Content Wrapper */}
            </div>
        </div>
    )
}
