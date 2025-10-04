const ZDBRefresh = () => {
  return (
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-database-backup-icon lucide-database-backup"
      >
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M3 12a9 3 0 0 0 5 2.69" />
        <path d="M21 9.3V5" />
        <path d="M3 5v14a9 3 0 0 0 6.47 2.88" />
        <path d="M12 12v4h4" />
        <path d="M13 20a5 5 0 0 0 9-3 4.5 4.5 0 0 0-4.5-4.5c-1.33 0-2.54.54-3.41 1.41L12 16" />
      </svg>
    </div>
  );
};

const ZDBZap = () => {
  return (
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-database-zap-icon lucide-database-zap"
      >
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M3 5V19A9 3 0 0 0 15 21.84" />
        <path d="M21 5V8" />
        <path d="M21 12L18 17H22L19 22" />
        <path d="M3 12A9 3 0 0 0 14.59 14.87" />
      </svg>
    </div>
  );
};

const ZDatabase = () => {
  return (
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#66f07d"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-database-icon lucide-database"
      >
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M3 5V19A9 3 0 0 0 21 19V5" />
        <path d="M3 12A9 3 0 0 0 21 12" />
      </svg>
    </div>
  );
};

const ZLine = () => {
  return (
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        stroke="gray"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-minus-icon lucide-minus"
      >
        <path d="M5 12h14" />
      </svg>
    </div>
  );
};

const ZElipsis = () => {
  return (
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-ellipsis-icon lucide-ellipsis"
      >
        <circle cx="12" cy="12" r="1" />
        <circle cx="19" cy="12" r="1" />
        <circle cx="5" cy="12" r="1" />
      </svg>
    </div>
  );
};

const ZBan = () => {
  return (
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-ban-icon lucide-ban"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="m4.9 4.9 14.2 14.2" />
      </svg>
    </div>
  );
};

const ZCheck = () => {
  return (
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#84f066"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-check-icon lucide-check"
      >
        <path d="M20 6 9 17l-5-5" />
      </svg>
    </div>
  );
};

const ZCheckCheck = () => {
  return (
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#84f066"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-check-check-icon lucide-check-check"
      >
        <path d="M18 6 7 17l-5-5" />
        <path d="m22 10-7.5 7.5L13 16" />
      </svg>
    </div>
  );
};

export {
  ZDBRefresh,
  ZDBZap,
  ZDatabase,
  ZLine,
  ZElipsis,
  ZBan,
  ZCheck,
  ZCheckCheck,
};
