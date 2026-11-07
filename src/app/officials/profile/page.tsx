import { Suspense } from "react";

import OfficialProfilePage, { ProfileSkeleton } from "./profile-client";

/* ------------------------------------------------------------------ */
/*  Route                                                              */
/* ------------------------------------------------------------------ */

/*
 * The client page reads `?id` via `useSearchParams`, which is unknown at
 * prerender time. Suspend so static generation renders the skeleton
 * fallback instead of bailing out; the client hydrates with the real params.
 */
export default function OfficialProfileRoute() {
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <OfficialProfilePage />
    </Suspense>
  );
}

