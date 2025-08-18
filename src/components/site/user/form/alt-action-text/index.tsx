export default function AltActionText({
  children
}: {
  children: React.ReactNode
}) {
  return <p className="mt-5 [&_a]:underline">{children}</p>
}
