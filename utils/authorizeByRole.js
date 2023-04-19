export function authorizeByRole(session, accessLevel, userIdFromUrl) {
  let accessLevelNumber;

  switch (accessLevel) {
    case "admin":
      accessLevelNumber = 3;
      break;
    case "userIdentified":
      accessLevelNumber = 2;
      break;
    case "userGeneral":
      accessLevelNumber = 1;
      break;
    default:
      accessLevelNumber = 0;
  }

  const userRole = session.user.role;
  const userId = session.user.id;

  let accessPoints = 0;

  if (userRole === "Admin") {
    accessPoints += 3;
  }
  if (userRole === "Basic") {
    accessPoints += 1;
  }
  if (userId === userIdFromUrl) {
    accessPoints += 1;
  }

  if (accessPoints < accessLevelNumber) {
    return "Unauthorized";
  } else {
    return "Authorized";
  }
}
