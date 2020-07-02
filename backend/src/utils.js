// Does the user have any of the permissionsNeeded?
//  permissionsNeeded is an array where we just need to match any of them
function hasPermission(user, permissionsNeeded) {
  // Compare the array of permissionsNeeded with user's permissions array
  const matchedPermissions = user.permissions.filter((permissionTheyHave) =>
    permissionsNeeded.includes(permissionTheyHave)
  );

  // If there was no intersection between the 2 arrays, then they don't have needed permissions
  if (!matchedPermissions.length) {
    throw new Error(`You do not have sufficient permissions

      : ${permissionsNeeded}

      You Have:

      ${user.permissions}
      `);
  }
  return true;
}

exports.hasPermission = hasPermission;
