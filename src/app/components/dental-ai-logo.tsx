export function DentalAILogo({
  className = "h-8 w-8",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer tooth outline */}
      <path
        d="M50 10C42 10 34 12 28 18C22 24 18 32 18 42C18 48 19 54 21 60C23 66 26 72 29 76C31 79 34 82 37 84C40 86 43 87 46 86C48 85 50 83 51 80C52 77 53 73 54 68C54 63 54 58 54 54C54 58 54 63 54 68C54 73 55 77 56 80C57 83 59 85 61 86C64 87 67 86 70 84C73 82 76 79 78 76C81 72 84 66 86 60C88 54 89 48 89 42C89 32 85 24 79 18C73 12 65 10 57 10C53 10 50 11 47 13C46 14 45 15 44 16C43 15 42 14 41 13C38 11 35 10 50 10Z"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        className="text-white"
      />

      {/* Inner root structure */}
      <path
        d="M46 54C46 60 45 66 44 72C43 76 42 79 41 81"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
        className="text-white"
      />

      <path
        d="M54 54C54 60 55 66 56 72C57 76 58 79 59 81"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
        className="text-white"
      />

      {/* Top surface detail */}
      <path
        d="M35 25C38 22 42 20 47 19C52 18 57 18 62 20C65 21 68 23 70 26"
        stroke="currentColor"
        strokeWidth="4.5"
        strokeLinecap="round"
        fill="none"
        className="text-white"
        opacity="0.8"
      />

      {/* AI circuit nodes - subtle */}
      <circle cx="36" cy="45" r="1.8" fill="#60A5FA" />
      <circle cx="40" cy="52" r="1.8" fill="#60A5FA" />
      <circle cx="64" cy="45" r="1.8" fill="#60A5FA" />
      <circle cx="60" cy="52" r="1.8" fill="#60A5FA" />

      {/* AI connecting lines */}
      <line
        x1="36"
        y1="45"
        x2="40"
        y2="52"
        stroke="#60A5FA"
        strokeWidth="1"
        opacity="0.5"
      />
      <line
        x1="64"
        y1="45"
        x2="60"
        y2="52"
        stroke="#60A5FA"
        strokeWidth="1"
        opacity="0.5"
      />
    </svg>
  );
}

export function DentalAILogoBlue({
  className = "h-8 w-8",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer tooth outline */}
      <path
        d="M50 10C42 10 34 12 28 18C22 24 18 32 18 42C18 48 19 54 21 60C23 66 26 72 29 76C31 79 34 82 37 84C40 86 43 87 46 86C48 85 50 83 51 80C52 77 53 73 54 68C54 63 54 58 54 54C54 58 54 63 54 68C54 73 55 77 56 80C57 83 59 85 61 86C64 87 67 86 70 84C73 82 76 79 78 76C81 72 84 66 86 60C88 54 89 48 89 42C89 32 85 24 79 18C73 12 65 10 57 10C53 10 50 11 47 13C46 14 45 15 44 16C43 15 42 14 41 13C38 11 35 10 50 10Z"
        stroke="#2563EB"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Inner root structure */}
      <path
        d="M46 54C46 60 45 66 44 72C43 76 42 79 41 81"
        stroke="#3B82F6"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />

      <path
        d="M54 54C54 60 55 66 56 72C57 76 58 79 59 81"
        stroke="#3B82F6"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Top surface detail */}
      <path
        d="M35 25C38 22 42 20 47 19C52 18 57 18 62 20C65 21 68 23 70 26"
        stroke="#3B82F6"
        strokeWidth="4.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.7"
      />

      {/* AI circuit nodes - subtle */}
      <circle cx="36" cy="45" r="1.8" fill="#60A5FA" />
      <circle cx="40" cy="52" r="1.8" fill="#60A5FA" />
      <circle cx="64" cy="45" r="1.8" fill="#60A5FA" />
      <circle cx="60" cy="52" r="1.8" fill="#60A5FA" />

      {/* AI connecting lines */}
      <line
        x1="36"
        y1="45"
        x2="40"
        y2="52"
        stroke="#60A5FA"
        strokeWidth="1"
        opacity="0.5"
      />
      <line
        x1="64"
        y1="45"
        x2="60"
        y2="52"
        stroke="#60A5FA"
        strokeWidth="1"
        opacity="0.5"
      />
    </svg>
  );
}
