import Link from "next/link";

function Unauthorized() {
  return (
    <div className="container login">
      <section className="section">
        <h2 className="title is-size-4">Unauthorized</h2>
        <p>You are not authorized to view this page.</p>
        <p>Please log in as Admin.</p>
        <Link href="/auth/signin">
          <a>Login</a>
        </Link>
      </section>
    </div>
  );
}

export default Unauthorized;
