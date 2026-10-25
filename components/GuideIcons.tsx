type IconName = "download" | "delete" | "memorial";

function Icon({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}

export function GoalIcon({ id }: { id: IconName }) {
  if (id === "download") {
    return (
      <Icon>
        <path d="M12 4.5v9" />
        <path d="M8.5 10.5 12 14l3.5-3.5" />
        <path d="M5.5 18.5h13" />
      </Icon>
    );
  }
  if (id === "delete") {
    return (
      <Icon>
        <path d="M5.5 7.5h13" />
        <path d="M9.5 7.4V5.8h5v1.6" />
        <path d="M8.2 7.5l.6 11h6.4l.6-11" />
      </Icon>
    );
  }
  return (
    <Icon>
      <path d="M12 19.5c3.4-2 5.2-4.4 5.2-7.1C17.2 9.2 15.2 7.2 12 4.8 8.8 7.2 6.8 9.2 6.8 12.4c0 2.7 1.8 5.1 5.2 7.1Z" />
      <path d="M12 19.5V9.5" />
    </Icon>
  );
}

export function SearchIcon() {
  return (
    <Icon>
      <circle cx="11" cy="11" r="5.5" />
      <path d="m15.5 15.5 3.5 3.5" />
    </Icon>
  );
}

export function ChevronIcon() {
  return (
    <Icon>
      <path d="m9 6 6 6-6 6" />
    </Icon>
  );
}

export function AccountGlyph({ variant }: { variant: "mine" | "deceased" }) {
  if (variant === "mine") {
    return (
      <Icon>
        <circle cx="12" cy="8" r="3.1" />
        <path d="M6.4 19c1.2-2.7 3.1-4 5.6-4s4.4 1.3 5.6 4" />
      </Icon>
    );
  }
  return (
    <Icon>
      <circle cx="9" cy="9" r="2.5" />
      <circle cx="15.4" cy="9.3" r="2.2" />
      <path d="M4.8 18.6c.9-2.2 2.4-3.3 4.3-3.3 1.6 0 2.9.8 3.8 2.3" />
      <path d="M13.4 15.8c1.4-.4 2.7.2 3.7 1.5.6.8 1 1.6 1.3 2.4" />
    </Icon>
  );
}
