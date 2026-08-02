import React from "react";

import PrimaryButton from "../PrimaryButton";

type Props = {
  onPress: () => void;
  loading: boolean;
  disabled?: boolean;
};

export default function PlaceOrderButton({
  onPress,
  loading,
  disabled,
}: Props) {
  return (
    <PrimaryButton
      title={loading ? "Placing Order..." : "Place Order"}
      onPress={onPress}
      disabled={loading || disabled}
    />
  );
}
