import {
  Wrapper,
  ButtonTop,
  ButtonRight,
  ButtonBottom,
  ButtonLeft,
  IconTop,
  IconLeft,
  IconRight,
  IconBottom,
} from "./Main.styled";
import { Tree } from "../Tree/Tree";

const Main = ({ transitCount, zoomValue, view }) => {
  function onClickTop() {
    const tree = document.querySelector(".tree");

    if (tree != null) {
      const position = tree.offsetTop;
      tree.style.top = `${position - 10}px`;
    }
  }

  function onClickRight() {
    const tree = document.querySelector(".tree");

    if (tree != null) {
      const position = tree.offsetLeft;
      tree.style.left = `${position + 10}px`;
    }
  }

  function onClickBottom() {
    const tree = document.querySelector(".tree");

    if (tree != null) {
      const position = tree.offsetTop;
      tree.style.top = `${position + 10}px`;
    }
  }

  function onClickLeft() {
    const tree = document.querySelector(".tree");

    if (tree != null) {
      const position = tree.offsetLeft;
      tree.style.left = `${position - 10}px`;
    }
  }

  function dragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }

  return (
    <Wrapper onDragOver={dragOver}>
      <ButtonTop onClick={onClickTop}>
        <IconTop />
      </ButtonTop>
      <ButtonRight onClick={onClickRight}>
        <IconRight />
      </ButtonRight>
      <ButtonBottom onClick={onClickBottom}>
        <IconBottom />
      </ButtonBottom>
      <ButtonLeft onClick={onClickLeft}>
        <IconLeft />
      </ButtonLeft>
      <Tree transitCount={transitCount} zoomValue={zoomValue} view={view} />
    </Wrapper>
  );
};

export default Main;
