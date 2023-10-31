import {
  Wrapper,
  Title,
  BoxButtons,
  Button,
} from "./Modal.styled";

const Modal = ({ type }) => {

  return (
    <Wrapper>
      <Title>What do you want to create?</Title>
      <BoxButtons>
        <Button type="button" onClick={(e) => type(e)}>
          Category
        </Button>
        <Button type="button" onClick={(e) => type(e)}>
          Service
        </Button>
      </BoxButtons>
    </Wrapper>
  );
};

export default Modal;
