export default function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-5">
      <div className="max-w-[400px] mx-auto p-5 rounded-lg bg-muted">
        {children}
      </div>
    </div>
  )
}
