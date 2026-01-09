import RegistrationForm from './components/RegistrationForm';

export default function Home() {
  return (
    <main className="min-h-screen relative flex items-center justify-center p-4 bg-gray-50">
      {/* Doodle Background */}
      <div
        className="absolute inset-0 z-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'url(/doodle-bg.png)',
          backgroundSize: '400px',
          backgroundRepeat: 'repeat'
        }}
      />

      <div className="relative z-10 w-full">
        <RegistrationForm />
      </div>
    </main>
  );
}
