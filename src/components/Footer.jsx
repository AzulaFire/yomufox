export default function Footer() {
  return (
    <footer className='flex flex-col items-center w-full flex-1 text-neutral-400 text-sm mt-20'>
      © {new Date().getFullYear()} YomuFox
    </footer>
  );
}
