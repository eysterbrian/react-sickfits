import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import ErrorMessages from './ErrorMessage';
import Table from './styles/Table';
import SickButton from './styles/SickButton';

const ALL_USERS_QUERY = gql`
  query ALL_USERS_QUERY {
    users {
      name
      id
      email
      permissions
    }
  }
`;

const ALL_PERMISSIONS_QUERY = gql`
  query ALL_PERMISSIONS {
    __type(name: "Permission") {
      name
      enumValues {
        name
      }
    }
  }
`;

// TODO: Rather than hard-coding the permissions here, use the ALL_PERMISSIONS_QUERY to
// retrieve a list of all permissions from the API
const PERMISSIONS = [
  'ADMIN',
  'USER',
  'ITEMCREATE',
  'ITEMUPDATE',
  'ITEMDELETE',
  'PERMISSIONUPDATE',
];

class EditPermissions extends React.Component {
  render() {
    return (
      <Query query={ALL_USERS_QUERY}>
        {({ data, loading, error }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <ErrorMessages error={error} />;
          else {
            console.log(data);

            return (
              <div>
                <h2>Manage Permissions</h2>
                <Table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      {PERMISSIONS.map((permission) => (
                        <th>{permission}</th>
                      ))}
                      <th>Update</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.users.map((user) => (
                      <UserPermissions user={user} />
                    ))}
                  </tbody>
                </Table>
              </div>
            );
          }
        }}
      </Query>
    );
  }
}

class UserPermissions extends React.Component {
  render() {
    const user = this.props.user;
    return (
      <tr key={user.id}>
        <td>{user.name}</td>
        <td>{user.email}</td>
        {PERMISSIONS.map((permission) => {
          const inputName = `${user.id}-permission-${permission}`;
          return (
            <td>
              <label htmlFor={inputName}>
                <input
                  type="checkbox"
                  name={inputName}
                  id={inputName}
                  defaultChecked={user.permissions.includes(permission)}
                />
              </label>
            </td>
          );
        })}
        <td>
          <SickButton>Update</SickButton>
        </td>
      </tr>
    );
  }
}

export default EditPermissions;
