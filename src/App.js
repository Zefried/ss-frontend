// All imports must be at the top
import { Routes, Route } from 'react-router-dom';
import { Home } from './Dashboard/Home';
import { AdminRegister } from './extraCompo/AccountRegister/AdminRegister';
import { AdminLogin } from './extraCompo/Login Components/AdminLogin';
import { Test } from './extraCompo/Test';
import { AdminGuard } from './Guards/AdminGuard';
import { AddDoctors } from './Admin/Components/DoctorAndWorker/AddDoctor';
import { ViewDoctors } from './Admin/Components/DoctorAndWorker/ViewDoctor';
import { FullInformation } from './Admin/Components/DoctorAndWorker/FullInformation';
import { DocCredentials } from './Admin/Components/DoctorAndWorker/DoctorCredentials';
import { EditDoctor } from './Admin/Components/DoctorAndWorker/EditDoctor';
import { AddLab } from './Admin/Components/Lab/AddLab';
import { ViewLab } from './Admin/Components/Lab/ViewLab';
import { LabInformation } from './Admin/Components/Lab/LabInformation';
import { EditLab } from './Admin/Components/Lab/EditLab';
import { LabCred } from './Admin/Components/Lab/LabCred';
import { AddLabUser } from './Admin/Components/Lab/LabEmployee/AddLabUser';
import { ViewLabEmployee } from './Admin/Components/Lab/LabEmployee/ViewLabEmployee';
import { AssignEmployee } from './Admin/Components/Lab/LabEmployee/AssignEmployee';
import { AddLabTestCategory } from './Admin/Components/Lab/LabTest/AddLabTestCategory';
import { ViewTestCategory } from './Admin/Components/Lab/LabTest/ViewTestCategory';
import { AddLabTest } from './Admin/Components/Lab/LabTest/AddLabTest';
import { ViewLabTest } from './Admin/Components/Lab/LabTest/ViewLabTest';
import { EditLabTestCategory } from './Admin/Components/Lab/LabTest/EditLabTestCategory';
import { EditLabTest } from './Admin/Components/Lab/LabTest/EditLabTest';
import { UserLogin } from './extraCompo/Login Components/UserLogin';
import { DocWorkerGuard } from './Guards/DocWorkerGuard';
import { AddPatientLocation } from './User/Components/PatientLocation/AddPatientLocation';
import { ViewPatientLocation } from './User/Components/PatientLocation/ViewPatientLocation';
import { AddPatientRequest } from './User/Components/CRUD/PatientRegistrationRequest';
import { ViewAllPatient } from './User/Components/CRUD/ViewAllPatient';
import { PatientViewCard } from './User/Components/CRUD/PatientViewCard';
import { AssigningTest } from './User/Components/PatientAssignFlow/AssigningTest';
import { ViewAssignedTest } from './User/Components/PatientAssignFlow/ViewAssignedTest';
import { LabLogin } from './extraCompo/Login Components/LabLogin';
import { HospitalLogin } from './extraCompo/Login Components/HospitalLogin';
import {ViewPaidPatient} from './Lab/Components/BillingFlow/ViewPaidPatient';
import { BillingStepOne } from './Lab/Components/BillingFlow/BillingStepOne';
import { ViewBillPdf } from './Lab/Components/BillingFlow/ViewBillPdf';
import { ViewPendingTestPatients } from './Lab/Components/BillingFlow/ViewPendingTestPatients';
import { LabHosDashboard } from './Dashboard/Labs/LabHosDashboard';
import { AdminDashboard } from './Dashboard/Admin/AdminDashboard';
import { UserDashboard } from './Dashboard/User/UserDashboard';
import { ViewEditPatient } from './User/Components/CRUD/ViewEditPatient';
import { ViewPatientFullInfo } from './User/Components/CRUD/ViewPatientFullInfo';

function App() {

  return (
    <div className="App">
      
      
      
      <Routes>
        <Route path='/' element={<AdminLogin/>} />
        <Route path='/admin-register' element={<AdminRegister />} />
        <Route path='/admin-login' element={<AdminLogin />} />
        <Route path='/user-login' element={<UserLogin />} />
        <Route path='/lab-login' element={<LabLogin />} />
        <Route path='/hospital-login' element={<HospitalLogin />} />


        {/* Admin Protected Routes starts from here */}
        <Route path='admin' element={<AdminGuard><Home></Home></AdminGuard>}>
          <Route index element={<AdminDashboard />} />
          
          <Route path='test' element={<Test></Test>}></Route>


          {/* admin and worker route starts here */}
          <Route path='add-doctors' element={<AddDoctors/>}/>
          <Route path='view-doctors' element={<ViewDoctors/>}/>
          <Route path='full-information/:id' element={<FullInformation/>}/>
          <Route path='doc-credentials/:id' element={<DocCredentials/>}/>
          <Route path='edit-doctor/:id' element={<EditDoctor/>}/>
          {/* ends here */}


          {/* Lab and Hospital route starts here */}
          <Route path='add-lab' element={<AddLab/>}/>
          <Route path='view-lab' element={<ViewLab/>}/>
          <Route path='lab-full-info/:id' element={<LabInformation/>}/>
          <Route path='edit-lab/:id' element={<EditLab/>}/>
          <Route path='lab-credentials/:id' element={<LabCred/>}/>
          {/* ends here */}


          {/* Lab employee routes starts here */}
          <Route path='add-lab-employee' element={<AddLabUser/>}/>
          <Route path='view-lab-employee' element={<ViewLabEmployee/>}/>
          <Route path='assign-employee/:id' element={<AssignEmployee/>}/>
          {/* ends here */}


          {/* Lab Test and Test Categories master routes starts here */}
          <Route path='add-lab-test-category' element={<AddLabTestCategory/>}/>
          <Route path='view-test-category' element={<ViewTestCategory/>}/>
           
          <Route path='add-lab-test' element={<AddLabTest/>}/>
          <Route path='view-lab-test' element={<ViewLabTest/>}/>
           
          <Route path='edit-lab-test-category/:id' element={<EditLabTestCategory/>}/>
          <Route path='edit-lab-test/:id' element={<EditLabTest/>}/> 
          {/* Ends here  */}

        </Route>
        {/* Ends here */}


        <Route path='user' element={<DocWorkerGuard><Home></Home></DocWorkerGuard>}>
          <Route index element={<UserDashboard />} />
        
          {/* patient location registration request through user panel - routes starts from here  */}
          <Route path='add-patient-location' element={<AddPatientLocation/>} />
          <Route path='view-patient-location' element={<ViewPatientLocation/>} />

          {/* patient registration request through user panel - routes starts from here  */}
          <Route path='add-patient' element={<AddPatientRequest></AddPatientRequest>} />
          <Route path='view-patient' element={<ViewAllPatient></ViewAllPatient>} />
          <Route path='edit-patient/:id' element={<ViewEditPatient></ViewEditPatient>} />
          <Route path='patient-full-Info/:id' element={<ViewPatientFullInfo></ViewPatientFullInfo>} />

          {/* patient registration request through user panel - routes starts from here  */}
          <Route path='view-patient-card/:id' element={<PatientViewCard></PatientViewCard>} />
          <Route path='assign-patient/:id' element={<AssigningTest></AssigningTest>} />
          <Route path='view-assigned-patients' element={<ViewAssignedTest></ViewAssignedTest>} />


        </Route>


  

        <Route path='lab' element={<DocWorkerGuard><Home></Home></DocWorkerGuard>}>
          <Route index element={<LabHosDashboard />} />
          <Route path='billing-step-one/:id' element={<BillingStepOne></BillingStepOne>} />
          <Route path='view-paid-patients' element={<ViewPaidPatient></ViewPaidPatient>} />
          <Route path='view-paid-patient-bill/:id' element={<ViewBillPdf></ViewBillPdf>} />
          <Route path='view-pending-patients' element={<ViewPendingTestPatients></ViewPendingTestPatients>} />
        
        
        </Route>


      </Routes>






      
    </div>
  );
}

export default App;
