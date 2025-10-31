export const assignScopesForRole = (role: string) => {
  switch (role) {
    case "therapist":
      return ["ehr.read"];
    case "system_admin":
      return ["ehr.read", "ehr.write"];
    case "super_admin":
      return ["ehr.read", "ehr.write"];
    default:
      return [];
  }
};
