import React, { useState, useEffect, useCallback } from "react";
import {
  Wrapper,
  BtnsBox,
  ButtonAdd,
  ButtonEdit,
  ButtonDelete,
  IconAdd,
  IconEdit,
  IconDone,
  IconDelete,
  Label,
  Input,
  Block,
  Line,
  Column,
} from "./Tree.styled";
import { nanoid } from "nanoid";
import Modal from "../Modal/Modal";
import { randomColor } from "../../utils/randomColor";
import { concatObject } from "../../utils/concatObject";


export const Tree = ({ transitCount, zoomValue, view }) => {
  const firstColor = randomColor();

  const [xStart, setXStart] = useState(0);
  const [yStart, setYStart] = useState(0);
  const [leftStart, setLeftStart] = useState(0);
  const [topStart, setTopStart] = useState(0);
  const [width, setWidth] = useState({});
  const [left, setLeft] = useState({});
  const [classLabel, setClassLabel] = useState({});
  const [color, setColor] = useState({
    1: firstColor,
  });
  const [disablessInput, setDisablessInput] = useState({});
  const [disablessBtn, setDisablessBtn] = useState({
    "buttonA-first": false,
  });
  const [widthInput, setWidthInput] = useState({});
  const [inputValue, setInputValue] = useState({ first: "Categories" });
  const [columnGap, setColumnGap] = useState({ first: "70px" });
  const [modalVisibility, setModalVisibility] = useState([
    false,
    null,
    "",
  ]);
  const [type, setType] = useState("category");
  const [categoryTree, setCategoryTree] = useState([
    {
      id: "first",
      buttonAdd: true,
      buttonEdit: false,
      buttonDelete: false,
      globalLine: 1,
      type: type,
      children: [],
    },
  ]);
  const [focused, setFocused] = useState(false);
  const [currentCategoryId, setCurrentCategoryId] = useState("");

  function countParents(e) {
    let parent = e.target;
    let i = 1;
    while (parent.id !== "column-first") {
      parent = parent["parentElement"];
      if (parent.id.split("")[0] === "c") {
        i += 1;
      }
    }
    if (!color || !Object.keys(color).includes(`${i}`)) {
      setColor((prev) => concatObject(prev, i, randomColor()));
    }
    return i;
  }

  const handleAddCategory = (
    e,
    parentId,
    value
  ) => {
    const backdrop = document.getElementById("backdrop");
    if (backdrop != null) {
      backdrop.style.pointerEvents = "none";
    }

    if (value + 1 > 2) {
      setModalVisibility([true, e, parentId]);
    } else {
      createCategory(e, parentId, type);
    }
  };

  const createCategory = (
    e,
    parentId,
    type
  ) => {
    const newCategory = {
      id: nanoid(),
      buttonAdd: false,
      buttonEdit: false,
      buttonDelete: false,
      globalLine: countParents(e),
      type: type,
      children: [],
    };

    setCategoryTree((prevTree) => {
      const updatedTree = [...prevTree];
      const parentCategory = findCategoryById(updatedTree, parentId);

      if (parentCategory) {
        parentCategory.children.push(newCategory);
      }
      return updatedTree;
    });
    setDisablessBtn((prev) =>
      Object.fromEntries(
        Object.entries(prev).map((el) =>
          el[0] !== `buttonE-${newCategory.id}` ||
          el[0] !== `buttonD-${newCategory.id}`
            ? [el[0], true]
            : el
        )
      )
    );
    setDisablessBtn((prev) =>
      concatObject(prev, `buttonA-${newCategory.id}`, true)
    );
    setDisablessBtn((prev) =>
      concatObject(prev, `buttonE-${newCategory.id}`, false)
    );
    setDisablessBtn((prev) =>
      concatObject(prev, `buttonD-${newCategory.id}`, false)
    );

    setDisablessInput((prev) => concatObject(prev, newCategory.id, false));

    setCurrentCategoryId(newCategory.id);
    setFocused(true);
  };

  useEffect(() => {
    if (!focused) {
      return;
    }

    const checkFocus = (e) => {
      if (
        (e.target).id !== `input-${currentCategoryId}` ||
        (e.target).id !== `buttonE-${currentCategoryId}` ||
        (e.target).id !== `buttonD-${currentCategoryId}`
      ) {
        const input = document.getElementById(`input-${currentCategoryId}`);
        if (input != null) {
          (input).focus();
        }
      }
    };

    window.addEventListener("click", checkFocus);
    return () => window.removeEventListener("click", checkFocus);
  }, [currentCategoryId, focused]);

  const onType = (e) => {
    setModalVisibility((prev) =>
      prev.map((i, index) => (index === 0 ? false : i))
    );
    const tempType = (e.target).innerText.toLowerCase();
    setType(tempType);

    createCategory(modalVisibility[1], modalVisibility[2], tempType);
    if ((e.target).innerText.toLowerCase() === "service") {
      transitCount(1);
    }
  };

  const findCategoryById = (tree, categoryId) => {
    for (const category of tree) {
      if (category.id === categoryId) {
        return category;
      } else if (category.children.length > 0) {
        const subcategory = findCategoryById(
          category.children,
          categoryId
        );
        if (subcategory) {
          return subcategory;
        }
      }
    }

    return null;
  };

  function findParentCategoryForDelete(tree, id) {
    for (let i = 0; i < tree.length; i++) {
      if (tree[i].id === id) {
        return tree[i];
      } else if (tree[i].children.length > 0) {
        const subcategory = findParentCategoryForDelete(
          tree[i].children,
          id
        );
        if (subcategory) {
          return subcategory;
        }
      }
    }
  }

  const findServices = (category, count) => {
    for (let i = 0; i < category.length; i++) {
      if (category[i].type === "service") {
        count = count + 1;
      }
      if (category[i].children.length > 0) {
        count = findServices(category[i].children, count);
      }
    }
    return count;
  };

  function onDeleteClick(e) {
    const idInput = (
      (e.currentTarget).parentElement?.parentElement
        ?.parentElement?.parentElement?.parentElement?.firstChild
    ).id.slice(6);
    const idButton = (
      (e.currentTarget).previousSibling
    ).id.slice(8);
    if (
      (
        (e.currentTarget).previousSibling
      ).classList.contains("edit")
    ) {
      const count = findServices([findCategoryById(categoryTree, idButton)], 0);
      if (count > 0) {
        transitCount(-1 * count);
      }

      setCategoryTree((prevTree) => {
        const updatedTree = [...prevTree];
        const parentCategory = findParentCategoryForDelete(
          updatedTree,
          idInput
        );

        if (parentCategory) {
          parentCategory.children.splice(
            parentCategory.children.findIndex((el) => el.id === idButton),
            1
          );
        }
        return updatedTree;
      });
      setClassLabel((prev) =>
        Object.fromEntries(
          Object.entries(prev).map((el) =>
            el[0] === `label-${idInput}`
              ? [el[0], el[1].split("parent").join("")]
              : el
          )
        )
      );
    } else {
      const tempName = (
        e.currentTarget.parentElement?.parentElement?.firstChild
          ?.firstChild
      ).name;
      setInputValue((prev) => concatObject(prev, tempName, ""));
    }
  }

  function onEditClick(e) {
    const id = e.currentTarget.id.slice(8);
    const input = document.querySelector(`#input-${id}`);
    if (input != null) {
      (input).blur();
    }
    setFocused(false);

    if (!(e.currentTarget).classList.contains("edit")) {
      if ((input).value === "") {
        alert("You must enter the name!");
        e.preventDefault();
        (input).focus();
      } else {
        setCategoryTree((prevTree) => {
          const updatedTree = [...prevTree];
          const category = findCategoryById(updatedTree, id);

          if (category) {
            category.buttonAdd = true;
            category.buttonEdit = true;
            category.buttonDelete = true;
          }
          return updatedTree;
        });

        setWidthInput((prev) =>
          concatObject(
            prev,
            id,
            `${(input).value.length}ch`
          )
        );

        setDisablessInput((prev) => concatObject(prev, id, true));
        const backdrop = document.getElementById("backdrop");
        if (backdrop != null) {
          backdrop.style.pointerEvents = "auto";
        }
      }
      setDisablessBtn((prev) =>
        Object.fromEntries(
          Object.entries(prev).map((el) => [el[0], false])
        )
      );
    } else {
      setFocused(true);

      setCategoryTree((prevTree) => {
        const updatedTree = [...prevTree];
        const category = findCategoryById(updatedTree, id);

        if (category) {
          category.buttonEdit = false;
          category.buttonDelete = false;
        }
        return updatedTree;
      });

      setDisablessInput((prev) => concatObject(prev, id, false));

      setDisablessBtn((prev) =>
        Object.fromEntries(
          Object.entries(prev).map((el) =>
            el[0] !== `buttonE-${id}` || el[0] !== `buttonD-${id}`
              ? [el[0], true]
              : el
          )
        )
      );
      setDisablessBtn((prev) =>
        concatObject(prev, `buttonE-${id}`, false)
      );
      setDisablessBtn((prev) =>
        concatObject(prev, `buttonD-${id}`, false)
      );
    }
  }

  function handleChange(e) {
    setInputValue((prev) =>
      concatObject(prev, e.target.name, e.target.value)
    );

    setWidthInput((prev) =>
      concatObject(
        prev,
        e.target.id.slice(5),
        `${(e.target).value.length}ch`
      )
    );

    setNet();
  }
  const renderCategory = (category, colorForLabel) => {
    return (
      <Column
        data-view={view}
        key={nanoid()}
        id={`column-${category.id}`}
        className="column"
        data-gap={columnGap[`${category.id}`]}
      >
        <Block className={"block"} id={`block-${category.id}`} data-view={view}>
          <Label
            data-view={view}
            id={`label-${category.id}`}
            className={classLabel[`label-${category.id}`]}
          >
            <Input
              onChange={handleChange}
              type="text"
              name={category.id}
              id={`input-${category.id}`}
              autoFocus
              value={inputValue[`${category.id}`]}
              placeholder={
                category.id === "first"
                  ? "Categories"
                  : `${type.charAt(0).toUpperCase() + type.slice(1)} name`
              }
              data-background-color={
                category.id === "first" || !inputValue[`${category.id}`]
                  ? "white"
                  : colorForLabel
              }
              data-color={category.id === "first" ? "black" : "white"}
              disabled={
                category.id === "first" || disablessInput[`${category.id}`]
                  ? true
                  : false
              }
              width={widthInput[`${category.id}`]}
            />
          </Label>
          <BtnsBox>
            <ButtonAdd
              id={`buttonA-${category.id}`}
              type="button"
              className={
                category.id !== "first" && !category.buttonAdd
                  ? "btn is-hidden"
                  : "btn"
              }
              onClick={(e) =>
                handleAddCategory(e, category.id, category.globalLine)
              }
              style={{
                pointerEvents: disablessBtn[`buttonA-${category.id}`]
                  ? "none"
                  : "auto",
              }}
            >
              <IconAdd />
            </ButtonAdd>
            <ButtonEdit
              id={`buttonE-${category.id}`}
              type="submit"
              style={{
                display: `${category.id === "first" && "none"}`,
                pointerEvents: disablessBtn[`buttonE-${category.id}`]
                  ? "none"
                  : "auto",
              }}
              className={category.buttonEdit ? "btn edit" : "btn"}
              onClick={(e) =>
                onEditClick(e)
              }
            >
              <IconEdit
                style={{ display: `${!category.buttonEdit && "none"}` }}
              />
              <IconDone
                style={{ display: `${category.buttonEdit && "none"}` }}
              />
            </ButtonEdit>
            <ButtonDelete
              id={`buttonD-${category.id}`}
              type="button"
              style={{
                display: `${category.id === "first" && "none"}`,
                pointerEvents: disablessBtn[`buttonD-${category.id}`]
                  ? "none"
                  : "auto",
              }}
              className={category.buttonDelete ? "btn delete" : "btn"}
              onClick={(e) =>
                onDeleteClick(e)
              }
            >
              <IconDelete />
            </ButtonDelete>
          </BtnsBox>
        </Block>
        {category.children.length > 0 && (
          <Line
            id={`line-${category.id}`}
            className="line"
            width={width[`line-${category.id}`]}
            left={left[`line-${category.id}`]}
            data-view={view}
          >
            {category.children.map((child) =>
              renderCategory(child, color[`${category.globalLine}`])
            )}
          </Line>
        )}
      </Column>
    );
  };

  const setNet = useCallback(() => {
    const labels = document.querySelectorAll("label");
    if (labels != null) {
      for (const label of labels) {
        if ((label).id !== "label-first") {
          setClassLabel((prev) => concatObject(prev, label.id, "child"));
        }
        if ((label?.parentElement).nextSibling) {
          setClassLabel((prev) =>
            concatObject(prev, label.id, "parent child")
          );
        }

        if (
          (label?.parentElement).nextSibling &&
          (label).id === "label-first"
        ) {
          setClassLabel((prev) => concatObject(prev, label.id, "parent"));
        }
      }
    }
    const lines = document.querySelectorAll(".line");

    if (lines != null) {
      for (const line of lines) {
        setColumnGap((prev) =>
          concatObject(prev, line.id.slice(5), "70px")
        );

        const labelZero = (
          line.children[0].firstChild?.firstChild
        ).getBoundingClientRect();
        const labelPrev = (
          line.previousSibling?.firstChild
        ).getBoundingClientRect();

        const lineDiv = (line).getBoundingClientRect();

        let tempLeft =
          view !== "tree view"
            ? (labelZero.right - labelZero.left) / 2 +
              (labelZero.left - lineDiv.left)
            : (labelZero.bottom - labelZero.top) / 2;
        if (line.children.length === 1) {
          let tempWidth =
            view !== "tree view"
              ? (labelPrev.right + labelPrev.left) / 2 -
                (labelZero.right + labelZero.left) / 2
              : (labelPrev.bottom + labelPrev.top) / 2 -
                (labelZero.bottom + labelZero.top) / 2;

          if (tempWidth < 0) {
            tempWidth *= -1;
            tempLeft -= tempWidth;
          }

          if (Math.floor(tempWidth) === 0) {
            setClassLabel((prev) =>
              Object.fromEntries(
                Object.entries(prev).map((el) =>
                  el[0] === `${line.id.slice(5)}`
                    ? [el[0], el[1].split("child").join("")]
                    : el
                )
              )
            );
            setColumnGap((prev) =>
              Object.fromEntries(
                Object.entries(prev).map((el) =>
                  el[0] === `${line.id.slice(5)}` ? [el[0], "35px"] : el
                )
              )
            );
          }
          setWidth((prev) =>
            concatObject(
              prev,
              `${line.id}`,
              `${(tempWidth / zoomValue) * 100}px`
            )
          );

          setLeft((prev) =>
            concatObject(
              prev,
              `${line.id}`,
              `${(tempLeft / zoomValue) * 100}px`
            )
          );
        }
        if (line.children.length === 2) {
          const labelNext = (
            line.children[1].firstChild?.firstChild
          ).getBoundingClientRect();

          let tempWidth =
            view !== "tree view"
              ? (labelNext.right + labelNext.left) / 2 -
                (labelZero.right + labelZero.left) / 2
              : (labelNext.bottom + labelNext.top) / 2 -
                (labelZero.bottom + labelZero.top) / 2;
          if (tempWidth < 0) {
            tempWidth *= -1;
            tempLeft -= tempWidth;
          }
          setWidth((prev) => {
            let obj = {};
            obj[`${line.id}`] = `${(tempWidth / zoomValue) * 100}px`;
            return Object.assign({}, prev, obj);
          });
          setLeft((prev) => {
            let obj = {};
            obj[`${line.id}`] = `${(tempLeft / zoomValue) * 100}px`;
            return Object.assign({}, prev, obj);
          });
        }

        if (line.children.length > 2) {
          const labelLast = (
            line.lastChild?.firstChild?.firstChild
          ).getBoundingClientRect();

          let tempWidth =
            view !== "tree view"
              ? (labelLast.right + labelLast.left) / 2 -
                (labelZero.right + labelZero.left) / 2
              : (labelLast.bottom + labelLast.top) / 2 -
                (labelZero.bottom + labelZero.top) / 2;

          if (tempWidth < 0) {
            tempWidth *= -1;
            tempLeft -= tempWidth;
          }

          setWidth((prev) => {
            let obj = {};
            obj[`${line.id}`] = `${(tempWidth / zoomValue) * 100}px`;
            return Object.assign({}, prev, obj);
          });
          setLeft((prev) => {
            let obj = {};
            obj[`${line.id}`] = `${(tempLeft / zoomValue) * 100}px`;
            return Object.assign({}, prev, obj);
          });
        }
      }
    }
  }, [view, zoomValue]);

  function dragStart(e) {
    setXStart(e.clientX);
    setYStart(e.clientY);

    const tree = document.querySelector(".tree") || null;

    if (tree != null) {
      setLeftStart(tree.offsetLeft);
      setTopStart(tree.offsetTop);
    }
  }

  function dragEnd(e) {
    e.preventDefault();

    const xMove = e.clientX - xStart;
    const yMove = e.clientY - yStart;

    const tree = document.querySelector(".tree") || null;

    if (tree != null && tree.offsetParent != null) {
      const positionLeft = tree.offsetLeft + xMove;
      const maxRight = tree.offsetParent.clientWidth;
      const positionTop = tree.offsetTop + yMove;
      const maxBottom = tree.offsetParent.clientHeight;

      if (
        positionLeft < 0 ||
        positionLeft > maxRight ||
        positionTop < 0 ||
        positionTop > maxBottom
      ) {
        tree.style.left = `${leftStart}px`;
        tree.style.top = `${topStart}px`;
      } else {
        tree.style.left = `${positionLeft}px`;
        tree.style.top = `${positionTop}px`;
      }
    }
  }

  useEffect(() => {
    setNet();
  }, [setNet, categoryTree, view]);

  return (
    <Wrapper
      className="tree"
      draggable={true}
      onDragStart={dragStart}
      onDragEnd={dragEnd}
    >
      {categoryTree.map((category) => renderCategory(category, ""))}
      {modalVisibility[0] && <Modal type={onType} />}
    </Wrapper>
  );
};