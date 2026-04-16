export default function LoginPage() {
  return (
    <div className="mx-auto mt-20 max-w-md rounded-xl bg-slate-900 p-6">
      <h1 className="mb-4 text-2xl font-bold">Entrar</h1>
      <form className="space-y-3">
        <input className="w-full rounded bg-slate-800 p-3" placeholder="Email" />
        <input className="w-full rounded bg-slate-800 p-3" placeholder="Senha" type="password" />
        <button className="w-full rounded bg-indigo-500 p-3 font-semibold">Login</button>
      </form>
    </div>
  );
}
