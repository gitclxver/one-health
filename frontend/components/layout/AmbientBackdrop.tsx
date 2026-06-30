export default function AmbientBackdrop() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[#B3DEE2]/45 rounded-full blur-[140px]"></div>
      <div className="absolute top-[30%] right-[-10%] w-[60vw] h-[60vw] bg-[#CCD5AE]/40 rounded-full blur-[160px]"></div>
      <div className="absolute bottom-[-10%] left-[20%] w-[45vw] h-[45vw] bg-[#B3DEE2]/35 rounded-full blur-[130px]"></div>
      <div className="absolute top-[60%] left-[-5%] w-[35vw] h-[35vw] bg-[#CCD5AE]/35 rounded-full blur-[120px]"></div>
    </div>
  );
}
