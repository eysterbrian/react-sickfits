import PleaseSignIn from '../components/PleaseSignIn';
import EditPermissions from '../components/EditPermissions';

const PermissionsPage = (props) => (
  <div>
    <PleaseSignIn>
      <EditPermissions />
    </PleaseSignIn>
  </div>
);

export default PermissionsPage;
