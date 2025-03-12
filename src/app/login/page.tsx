import LoginForm from '../components/login/login_form';
import RegisterForm from '../components/login/register_form';

// TODO: Add login page
// Remember the guest mode button
// Use render switcher for login/register forms
export default function Page() {
  return (
    <div>
      <LoginForm />
      <RegisterForm />
    </div>
  );
}
