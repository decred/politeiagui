import navBar from "../components/navBar";

const logout = function() {
  return this.click(navBar.elements.logOutButton, () => this.api);
};

export { logout as command };
