import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "../CSS/homepage.css";
import "../CSS/menuPage.css";

const CategoryView = ({
  selectedItems,
  parentSubmenu,
  category,
  items,
  onLeftClick,
  onRightClick,
  onItemClick,
}) => {
  const textColor = category.textColor;
  const [status, setStatus] = useState(true);
  const imagesToBePreloaded = items.map((menu) => {
    return {
      image: menu.preview_url,
    };
  });
  imagesToBePreloaded.forEach((image) => {
    const my_image = new Image();
    my_image.src = image;
  });
  return (
    <div>
      <div
        onClick={() => {
          setStatus(!status);
          console.log("status: " + status);
        }}
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
        }}
      >
        <div className="item-drop-row1" style={{ marginLeft: "15px" }}>
          <div>
            <span
              className="item-drop-head"
              style={{ color: textColor ?? "black" }}
            >
              {category.name}
            </span>
            {!status ? (
              <div>
                <span
                  className="item-drop-head"
                  style={{
                    color: textColor ?? "black",
                    fontSize: "14px",
                    marginBottom: "10px",
                    fontWeight: "300",
                  }}
                >
                  {category.description}
                </span>
              </div>
            ) : null}
          </div>
        </div>
        <div style={{ marginRight: "15px" }} className="item-drop-row2">
          <div
            style={{
              background: "rgba(229,44,88,0.1)",
              width: "25px",
              height: "25px",
              borderRadius: "50%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              className="triangle-down"
              style={{
                transform: `rotate(${status ? "0deg" : "180deg"})`,
              }}
            ></div>
          </div>
        </div>
      </div>
      <div>
        {!status ? (
          <div>
            {}
            {items.map((item) => {
              return (
                <div key={item.id} className="menu_row">
                  <ItemView
                    selectedItems={selectedItems}
                    parentSubmenu={parentSubmenu}
                    parentCategory={category}
                    item={item}
                    key={item.id}
                    onLeftClick={onLeftClick}
                    onRightClick={onRightClick}
                    onItemClick={onItemClick}
                  />
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
};

const ItemView = ({
  selectedItems,
  parentSubmenu,
  parentCategory,
  item,
  onLeftClick,
  onRightClick,
  onItemClick,
}) => {
  const image = item.image;
  const name = item.name;
  const description = item.description;
  const price = item.price;
  const food_side_effect = item.food_side_effect;

  const this_item = selectedItems.find((my_item) => my_item.id === item.id);
  return (
    <tr>
      <td
        style={{
          width: "100%",
          float: "left",
        }}
      >
        <div>
          {item.preview_url && (
            <img
              style={{ width: "50px", height: "50px", float: "left" }}
              className="drop-item-image"
              src={item.preview_url}
              alt="img"
            />
          )}

          <div
            style={{
              marginLeft: "15px",
              float: "left",
              width: "calc(100% - 210px)",
              padding: "0px",
              paddingBottom: "5px",
            }}
            onClick={() =>
              onItemClick({
                image,
                name,
                description,
                price,
                food_side_effect,
              })
            }
          >
            <div
              className="item-drop-head"
              style={{ color: parentCategory.textColor ?? "black" }}
            >
              {item.title}
            </div>
            {description !== "" && (
              <div
                className="item-drop-head-dsc"
                style={{ color: parentCategory.textColor ?? "black" }}
              >
                {item.description}
              </div>
            )}
            <div
              className="item-drop-head-price"
              style={{ color: parentCategory.textColor ?? "#db2668" }}
            >{`${item.price} €`}</div>
          </div>
        </div>
        {item.digitallyAvailable && (
          <div className="banner-quantity-container">
            <div
              className="banner-quantity-button"
              id="banner-quantity-left-button"
              onClick={() => {
                const selected_item = {
                  id: item.id,
                  parentSubmenu: parentSubmenu,
                  orderWithdrawTypes: item.orderWithdrawTypes,
                  available: item.quantity
                    ? item.quantity - item.quantity_used
                    : 1000,
                };
                onLeftClick(selected_item);
              }}
            >
              -
            </div>
            <input
              type="number"
              className="banner-quantity-text"
              id={"banner-quantity-text-" + item.id}
              value={
                this_item && this_item.quantity
                  ? String(this_item.quantity)
                  : "0"
              }
              readOnly
            />
            <div
              className="banner-quantity-button"
              id="banner-quantity-right-button"
              onClick={() => {
                const available = item.quantity
                  ? item.quantity - item.quantity_used
                  : 1000;
                const selected_item = {
                  id: item.id,
                  parentSubmenu: parentSubmenu,
                  orderWithdrawTypes: item.orderWithdrawTypes,
                  available: available,
                };
                onRightClick(selected_item);
              }}
            >
              +
            </div>
          </div>
        )}
      </td>
    </tr>
  );
};

const ItemDrop = ({
  selectedItems,
  submenu,
  categories,
  onLeftClick,
  onRightClick,
  onItemClick,
  my_status,
}) => {
  const { t } = useTranslation();
  const items = [];
  if (categories) {
    categories.forEach((category) => {
      items.push(category.items);
    });
  }
  const [status, setStatus] = useState(my_status);
  const imagesToBePreloaded = items.map((menu) => {
    return {
      image: menu.preview_url,
    };
  });
  imagesToBePreloaded.forEach((image) => {
    new Image().src = image;
  });

  return (
    <div>
      <div
        onClick={() => {
          setStatus(!status);
          console.log("status: " + status);
        }}
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
        }}
      >
        <div className="item-drop-row1" style={{ marginLeft: "15px" }}>
          <div>
            <span className="item-drop-head first-item-drop-head">
              {submenu.name}
            </span>
          </div>
        </div>

        <div style={{ marginRight: "15px" }} className="item-drop-row2">
          <div
            style={{
              background: "rgba(229,44,88,0.1)",
              width: "25px",
              height: "25px",
              borderRadius: "50%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              className="triangle-down"
              style={{
                transform: `rotate(${status ? "0deg" : "180deg"})`,
              }}
            ></div>
          </div>
        </div>
      </div>
      <div>
        {!status ? (
          <div>
            {categories.map((category) => {
              return (
                <div
                  key={category.category.name}
                  className="menu_row"
                  style={{
                    backgroundColor: category.category.labelColor ?? "white",
                  }}
                >
                  <CategoryView
                    selectedItems={selectedItems}
                    parentSubmenu={submenu}
                    category={category.category}
                    items={category.items}
                    onLeftClick={onLeftClick}
                    onRightClick={onRightClick}
                    onItemClick={onItemClick}
                  />
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export { ItemDrop, ItemView, CategoryView };
