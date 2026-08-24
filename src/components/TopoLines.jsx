export default function TopoLines({ className = '' }) {
  return (
    <svg
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M40 200c0-88 72-160 160-160s160 72 160 160-72 160-160 160S40 288 40 200Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M75 200c0-69 56-125 125-125s125 56 125 125-56 125-125 125S75 269 75 200Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M110 200c0-50 40-90 90-90s90 40 90 90-40 90-90 90-90-40-90-90Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M145 200c0-30 25-55 55-55s55 25 55 55-25 55-55 55-55-25-55-55Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="200" cy="200" r="4" fill="currentColor" />
    </svg>
  )
}
