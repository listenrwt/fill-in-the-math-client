//TODO: Create a register form component
export default function RegisterForm() {
  return (
    <div>
      <h1>Register</h1>
      <form>
        <input type="text" placeholder="Username" />
        <input type="password" placeholder="Password" />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}
