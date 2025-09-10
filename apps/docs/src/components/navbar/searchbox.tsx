export default function SearchBox() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-h-[50%] max-w-xl rounded-2xl border border-border bg-background p-2 shadow-xl">
        <input
          className="w-full h-14 rounded-lg p-2 border-2 outline-none dark:bg-[#1d1d1ecb] xl:text-lg"
          type="text"
          placeholder="Search"
        />
      </div>
    </div>
  );
}
