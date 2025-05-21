'use client'

export default function SentryTestComponent() {
  return (
    <div style={{ marginTop: '20px' }}>
      <h1>Sentry Test Component</h1>
      <button
        onClick={() => {
          throw new Error('Test Sentry Error')
        }}
      >
        Throw Error
      </button>
    </div>
  )
}
