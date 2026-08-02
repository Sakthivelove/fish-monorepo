import React from "react";

import QuantitySelector from "../QuantitySelector";
import PrimaryButton from "../PrimaryButton";

type Props = {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  onAddToCart: () => void;
};

export default function AddToCartSection({
  quantity,
  onIncrease,
  onDecrease,
  onAddToCart,
}: Props) {
  return (
    <>
      <QuantitySelector
        value={quantity}
        onIncrease={onIncrease}
        onDecrease={onDecrease}
      />

      <PrimaryButton
        title="Add To Cart"
        onPress={onAddToCart}
      />
    </>
  );
}