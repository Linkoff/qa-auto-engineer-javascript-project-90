export default class LoginPage {
  constructor(page) {
    this.page = page
    this.usernameInput = page.getByRole('textbox', { name: 'Username' })
    this.passwordInput = page.getByRole('textbox', { name: 'Password' })
    this.signInButton = page.getByRole('button', { name: 'Sign in' })
    this.profileButton = page.getByRole('button', { name: 'Profile' })
    this.logoutMenuItem = page.getByRole('menuitem', { name: 'Logout' })
  }
  async goto() {
    await this.page.goto('/')
  }
  async login(username, password) {
    await this.usernameInput.fill(username)
    await this.passwordInput.fill(password)
    await this.signInButton.click()
  }
  async logout() {
    await this.profileButton.click()
    await this.logoutMenuItem.click()
  }
}
