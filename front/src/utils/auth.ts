export const setUser = (token: string, username: string, firstName: string, lastName: string, createdAt: string) => {
  localStorage.setItem("token", token);
  localStorage.setItem("username", username);
  localStorage.setItem("firstName", firstName);
  localStorage.setItem("lastName", lastName);
  localStorage.setItem("createdAt", createdAt);
};

export const getUser = () => {
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  const firstName = localStorage.getItem("firstName");
  const lastName = localStorage.getItem("lastName");
  const createdAt = localStorage.getItem("createdAt");

  return {
    token,
    username,
    firstName,
    lastName,
    createdAt,
  };
};

export const removeUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  localStorage.removeItem("firstName");
  localStorage.removeItem("lastName");
  localStorage.removeItem("createdAt");
};
