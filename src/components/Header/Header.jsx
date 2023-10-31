import React, { useEffect, useState } from "react";

import {
  Wrapper,
  Title,
  Count,
  BoxLeft,
  BoxRight,
  ButtonView,
  ZoomDecrement,
  ZoomIncrement,
  ZoomValue,
  Center,
  CenterIcon,
  ZoomBox,
} from "./Header.styled";

const valuesIn = [25, 30, 40, 50, 60, 70, 80, 90, 100, 125, 150];
const valuesOut = [
  20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150,
];

const Header = ({
  serviceCount,
  transitZoomValue,
  transitView,
}) => {
  const [zoomValue, setZoomValue] = useState(100);
  const [values, setValues] = useState(valuesIn);
  const [view, setView] = useState("list view");

  useEffect(() => {
    transitZoomValue(zoomValue);
  }, [transitZoomValue, zoomValue]);

  function onCenter() {
    const tree = document.querySelector(".tree");

    if (tree != null) {
      tree.style.top = "50%";
      tree.style.left = "50%";
      tree.style.transform = `translateX(-50%) translateY(-50%) scale(${
        zoomValue / 100
      })`;
    }
  }

  function zoomDecrement() {
    setValues(valuesOut);

    setZoomValue((prev) =>
      zoomValue <= 20 ? 20 : zoomValue % 10 !== 0 ? prev - 5 : prev - 10
    );
    setZoom(zoomValue <= 20 ? 20 : zoomValue - 10);
  }

  function zoomIncrement() {
    setValues(valuesOut);

    setZoomValue((prev) =>
      zoomValue >= 150 ? 150 : zoomValue % 10 !== 0 ? prev + 5 : prev + 10
    );
    setZoom(zoomValue >= 150 ? 150 : zoomValue + 10);
  }

  function setZoom(value) {
    const tree = document.querySelector(".tree");

    if (tree != null) {
      tree.style.transform = `translateX(-50%) translateY(-50%) scale(${
        value / 100
      })`;
    }
  }

  function onClickView(e) {
    transitView(
      (e.target.innerText.toLowerCase() === "list view")
        ? "tree view"
        : "list view"
    );
    setView(view === "list view" ? "tree view" : "list view");
  }

  return (
    <Wrapper>
      <BoxLeft>
        <Title>Services</Title>
        <Count>{serviceCount}</Count>
      </BoxLeft>
      <BoxRight>
        <ButtonView onClick={onClickView}>{view.toUpperCase()}</ButtonView>
        <Center onClick={onCenter}>
          <CenterIcon />
        </Center>
        <ZoomBox>
          <ZoomDecrement onClick={zoomDecrement}>-</ZoomDecrement>
          <ZoomValue
            onClick={() => setValues(valuesIn)}
            onChange={(e) => {
              setZoomValue(Number(e.target.value.split("%")[0]));
              setZoom(Number(e.target.value.split("%")[0]));
            }}
            value={`${zoomValue}%`}
          >
            {values.map((item) => (
              <option key={item}>{item}%</option>
            ))}
          </ZoomValue>
          <ZoomIncrement onClick={zoomIncrement}>+</ZoomIncrement>
        </ZoomBox>
      </BoxRight>
    </Wrapper>
  );
};

export default Header;
