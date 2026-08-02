import { useEffect, useState } from "react";

import {
  CustomerProfile,
  EMPTY_PROFILE,
  loadProfile,
  saveProfile,
} from "../storage/customerStorage";

export function useProfile() {
  const [profile, setProfile] =
    useState<CustomerProfile>(EMPTY_PROFILE);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      const stored = await loadProfile();
      setProfile(stored);
      setLoading(false);
    }

    init();
  }, []);

  async function updateProfile(next: CustomerProfile) {
    setProfile(next);
    await saveProfile(next);
  }

  return { profile, updateProfile, loading };
}
