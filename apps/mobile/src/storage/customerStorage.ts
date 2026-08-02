import AsyncStorage from "@react-native-async-storage/async-storage";

const PROFILE_KEY = "customer_profile";

export type CustomerProfile = {
  name: string;
  phoneNumber: string;
  email: string;
  deliveryAddress: string;
  pincode: string;
};

export const EMPTY_PROFILE: CustomerProfile = {
  name: "",
  phoneNumber: "",
  email: "",
  deliveryAddress: "",
  pincode: "",
};

export async function saveProfile(profile: CustomerProfile) {
  try {
    await AsyncStorage.setItem(
      PROFILE_KEY,
      JSON.stringify(profile)
    );
  } catch (error) {
    console.error("Failed to save profile", error);
  }
}

export async function loadProfile(): Promise<CustomerProfile> {
  try {
    const value = await AsyncStorage.getItem(PROFILE_KEY);

    if (!value) {
      return EMPTY_PROFILE;
    }

    return JSON.parse(value) as CustomerProfile;
  } catch (error) {
    console.error("Failed to load profile", error);
    return EMPTY_PROFILE;
  }
}
