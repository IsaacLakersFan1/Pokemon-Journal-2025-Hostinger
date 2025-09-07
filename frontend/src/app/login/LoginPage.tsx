import { LoginForm } from "./components/LoginForm"

export function LoginPage() {
  // const [session, setSession] = useState<Session | null>(null);

  // useEffect(() => {
  //   supabase.auth.getSession().then(({ data: { session } }) => {
  //     setSession(session);
  //     console.log(session);
  //   });

  //   const {
  //     data: { subscription },
  //   } = supabase.auth.onAuthStateChange((_event, session) => {
  //     setSession(session);
  //     console.log(session);
  //   });

  //   return () => {
  //     subscription.unsubscribe();
  //   };
  // }, []);

  // if (!session) {
  //   return (
  //     <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
  //       <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />
  //     </div>
  //   );
  // } else {
  //   return <div>Logged in!</div>;
  // }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
