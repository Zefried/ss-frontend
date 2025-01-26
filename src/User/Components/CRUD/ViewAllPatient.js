import React from 'react';
import { customStateMethods } from '../../../../Admin/protected/CustomAppState/CustomState';
import usePagination from '../../../../CustomHook/usePagination';
import useSearch from '../../../../CustomHook/useSearch';
import { Link } from 'react-router-dom';
import userIcon from '../../../../Assets/img/registration/userIcon.jpeg';

export const ViewAllPatient = () => {
  const token = customStateMethods.selectStateKey('appState', 'token');
  const apiUrl = '/api/admin/lab-search';

  // Using the custom search hook
  const {
    query,
    handleSearch,
    suggestions,
    selected,
    suggestionUI,
    selectedItemUI,
    messageUI,
  } = useSearch(token, apiUrl);

  // Use pagination hook
  const { listData, loading, messages, paginationUI } = usePagination('/api/user/fetch-all-patient', token);

  const patientTable = listData?.map((item, index) => (
    <tr key={item.id}>
      <td>{index + 1}</td>
      <td><img className='userIcon' src={userIcon} alt="User Icon" /></td>
      <td>{item.name}</td>
      <td>{item.age}</td>
      <td>{item.phone}</td>
      <td>{item.district}</td>
      <td><Link to={`/user/view-patient-card/${item.id}`} className='btn btn-outline-primary btn-sm'>View Card</Link></td>
      {/* <td><Link to={`/user/assign-patient-step-one/${item.id}`} className='btn btn-outline-success btn-sm'>Assign Patient</Link></td> */}
      <td><Link to={`/user/view-patient-full-info/${item.id}`} className='btn btn-outline-primary btn-sm'>Full Info</Link></td>
      <td><Link to={`/user/edit-patient/${item.id}`} className='btn btn-outline-success btn-sm'>Edit</Link></td>
      <td><button className='btn btn-outline-danger btn-sm'>Disable</button></td>
    </tr>
  ));

  return (
    <div>
        {loading && <p>Loading...</p>}
        {messages && <div>{messages}</div>}


      {/* Search Input */}
      <input
        className='form-control col-lg-5'
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="Search..."
      />

       {/* Suggestions UI */}
       <div>
        {suggestionUI()}
        {selectedItemUI()}
        {messageUI()}
      </div>

    

      <p className="h3 text-center mt-3">View All Patient</p>

      <div className="table-responsive table-container">
        <table className="table table-striped table-bordered table-hover">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Profile</th>
              <th>Name</th>
              <th>Age</th>
              <th>Phone</th>
              <th>District</th>
              <th>Patient Card</th>
              {/* <th>Assign Patient</th> */}
              <th>Full Info</th>
              <th>Edit</th>
              <th>Disable</th>
            </tr>
          </thead>
          <tbody>
            {patientTable}
          </tbody>
        </table>
      </div>

      {/* Render pagination UI */}
      {paginationUI}

     
    </div>
  );
};
